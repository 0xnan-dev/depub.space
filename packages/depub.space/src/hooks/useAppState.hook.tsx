import React, {
  useMemo,
  createContext,
  FC,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import * as Sentry from '@sentry/nextjs';
import update from 'immutability-helper';
import * as Crypto from 'expo-crypto';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { BroadcastTxSuccess } from '@cosmjs/stargate';
import Debug from 'debug';
import { DesmosProfile, Message, User, HashTag, PaginatedResponse, List } from '../interfaces';
import {
  getMessages,
  submitToArweaveAndISCN,
  getMessagesByOwner,
  getUserByDTagOrAddress,
  getMessagesByHashTag,
  getMessageById,
  getChannels,
  GetChannelsResponse,
  GetUserWithMessagesResponse,
} from '../utils';
import { signISCN } from '../utils/iscn';
import { useAlert } from '../components/molecules/Alert';
import { LoadingModal } from '../components/organisms/LoadingModal';
import { useWallet } from './useWallet.hook';

const debug = Debug('web:useAppState');

export class AppStateError extends Error {}

export interface AppStateContextProps {
  isLoading: boolean;
  isLoadingModalOpen: boolean;
  error: string | null;
  profile: DesmosProfile | null;
  channels: List[];
  isImageModalOpen: boolean;
  image: string | null; // image modal
  imageAspectRatio: number | null; // image modal
  hashTags: HashTag[];
  showLoading: () => void;
  closeLoading: () => void;
  showImageModal: (image: string, aspectRatio: number) => void;
  closeImageModal: () => void;
  fetchUser: (dtagOrAddress: string) => Promise<User | null>;
  fetchChannels: () => Promise<GetChannelsResponse>;
  fetchMessage: (iscnId: string) => Promise<Message | null>;
  fetchMessages: (previousId?: string) => Promise<PaginatedResponse<Message[]>>;
  fetchMessagesByHashTag: (
    tag: string,
    previousId?: string,
    limit?: number
  ) => Promise<PaginatedResponse<Message[]>>;
  fetchMessagesByOwner: (
    owner: string,
    previousId?: string
  ) => Promise<PaginatedResponse<GetUserWithMessagesResponse | null> | null>;
  postMessage: (
    offlineSigner: OfflineSigner,
    message: string,
    files?: string | File[]
  ) => Promise<BroadcastTxSuccess | TxRaw | null>;
}

const initialState: AppStateContextProps = {
  channels: [],
  hashTags: [],
  isImageModalOpen: false,
  image: null,
  imageAspectRatio: null,
  error: null,
  isLoading: false,
  isLoadingModalOpen: false,
  profile: null,
  fetchUser: null as never,
  showLoading: null as never,
  closeLoading: null as never,
  showImageModal: null as never,
  closeImageModal: null as never,
  fetchChannels: null as never,
  fetchMessages: null as never,
  fetchMessage: null as never,
  fetchMessagesByHashTag: null as never,
  fetchMessagesByOwner: null as never,
  postMessage: null as never,
};

const ISCN_FINGERPRINT = process.env.NEXT_PUBLIC_ISCN_FINGERPRINT || '';

export const AppStateContext = createContext<AppStateContextProps>(initialState);

const enum ActionType {
  SET_IS_LOADING = 'SET_IS_LOADING',
  SET_ERROR = 'SET_ERROR',
  SET_PROFILE = 'SET_PROFILE',
  SET_CHANNELS = 'SET_CHANNELS',
  SET_HASHTAGS = 'SET_HASHTAGS',
  SET_IS_LOADING_MODAL_OPEN = 'SET_IS_LOADING_MODAL_OPEN',
  SET_IS_IMAGE_MODAL_OPEN = 'SET_IS_IMAGE_MODAL_OPEN',
}

type Action =
  | { type: ActionType.SET_IS_LOADING; isLoading: boolean }
  | { type: ActionType.SET_ERROR; error: string | null }
  | { type: ActionType.SET_PROFILE; profile: DesmosProfile | null }
  | { type: ActionType.SET_CHANNELS; channels: List[] }
  | { type: ActionType.SET_HASHTAGS; hashTags: HashTag[] }
  | {
      type: ActionType.SET_IS_IMAGE_MODAL_OPEN;
      isImageModalOpen: boolean;
      image: string | null;
      aspectRatio: number | null;
    }
  | { type: ActionType.SET_IS_LOADING_MODAL_OPEN; isLoadingModalOpen: boolean };

const reducer: Reducer<AppStateContextProps, Action> = (state, action) => {
  debug('reducer: %O', action);

  switch (action.type) {
    case ActionType.SET_IS_LOADING:
      return update(state, {
        isLoading: { $set: action.isLoading },
      });
    case ActionType.SET_ERROR:
      return update(state, {
        isLoading: { $set: false },
        error: { $set: action.error },
      });
    case ActionType.SET_PROFILE:
      return update(state, {
        profile: { $set: action.profile },
      });
    case ActionType.SET_HASHTAGS:
      return update(state, {
        hashTags: { $set: action.hashTags },
      });
    case ActionType.SET_CHANNELS:
      return update(state, {
        channels: { $set: action.channels },
      });
    case ActionType.SET_IS_LOADING_MODAL_OPEN:
      return update(state, {
        isLoadingModalOpen: { $set: action.isLoadingModalOpen },
      });
    case ActionType.SET_IS_IMAGE_MODAL_OPEN:
      return update(state, {
        isImageModalOpen: { $set: action.isImageModalOpen },
        image: { $set: action.image },
        imageAspectRatio: { $set: action.aspectRatio },
      });
    default:
      throw new AppStateError(`Cannot match action type ${(action as any).type}`);
  }
};

export const useAppState = () => useContext(AppStateContext);

const useAppActions = (dispatch: React.Dispatch<Action>) => ({
  postMessage: async (offlineSigner: OfflineSigner, message: string, files?: string | File[]) => {
    debug('postMessage() -> message: %s, files: %O', message, files);

    dispatch({ type: ActionType.SET_IS_LOADING, isLoading: true });

    try {
      const [wallet] = await offlineSigner.getAccounts();
      const recordTimestamp = new Date().toISOString();
      const datePublished = recordTimestamp.split('T')[0];
      const messageSha256Hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        message
      );
      const payload = {
        contentFingerprints: [ISCN_FINGERPRINT, `hash://sha256/${messageSha256Hash}`],
        recordTimestamp,
        datePublished,
        stakeholders: [
          {
            entity: {
              '@id': wallet.address,
              name: wallet.address,
            },
            contributionType: 'http://schema.org/author',
            rewardProportion: 0.975,
          },
          {
            entity: {
              '@id': 'https://depub.SPACE',
              name: 'depub.SPACE',
            },
            contributionType: 'http://schema.org/publisher',
            rewardProportion: 0.025,
          },
        ],
        name: `depub.space-${recordTimestamp}`,
        recordNotes: 'A Message posted on depub.SPACE',
        type: 'Article',
        author: wallet.address,
        description: message,
        version: 1,
        usageInfo: 'https://creativecommons.org/licenses/by/4.0',
      };

      debug('postMessage() -> payload: %O', payload);

      let txn: TxRaw | BroadcastTxSuccess;

      if (files) {
        txn = await submitToArweaveAndISCN(files, payload, offlineSigner, wallet.address);
      } else {
        txn = await signISCN(payload, offlineSigner, wallet.address);
      }

      dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

      return txn;
    } catch (ex) {
      debug('postMessage() -> error: %O', ex);

      if (/^Account does not exist on chain/.test(ex.message)) {
        dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

        throw new AppStateError(ex.message);
      } else if (ex.message === 'Request rejected') {
        dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

        throw new AppStateError('Request rejected');
      }

      Sentry.captureException(ex);
    }

    dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

    throw new AppStateError('Failed to post your message, please try it again later.');
  },
  fetchUser: async (dtagOrAddress: string): Promise<User | null> => {
    debug('fetchUser(dtagOrAddress: %s)', dtagOrAddress);

    dispatch({ type: ActionType.SET_IS_LOADING, isLoading: true });

    try {
      const user = await getUserByDTagOrAddress(dtagOrAddress);

      dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

      return user;
    } catch (ex) {
      debug('fetchUser() -> error: %O', ex);

      dispatch({
        type: ActionType.SET_ERROR,
        error: 'Fail to fetch messages, please try again later.',
      });

      Sentry.captureException(ex);
    }

    return null;
  },
  fetchMessages: async (previousId?: string): Promise<PaginatedResponse<Message[]>> => {
    debug('fetchMessages(previousId: %s)', previousId);

    dispatch({ type: ActionType.SET_IS_LOADING, isLoading: true });

    try {
      const messages = await getMessages(previousId);

      dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

      return messages;
    } catch (ex) {
      debug('fetchMessages() -> error: %O', ex);

      dispatch({
        type: ActionType.SET_ERROR,
        error: 'Fail to fetch messages, please try again later.',
      });

      Sentry.captureException(ex);
    }

    return {
      data: [],
      hasMore: false,
    };
  },
  fetchMessage: async (iscnId: string): Promise<Message | null> => {
    debug('fetchMessage(iscnId: %s)', iscnId);

    dispatch({ type: ActionType.SET_IS_LOADING, isLoading: true });

    try {
      const message = await getMessageById(iscnId);

      dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

      return message;
    } catch (ex) {
      debug('fetchMessage() -> error: %O', ex);

      dispatch({
        type: ActionType.SET_ERROR,
        error: `Fail to fetch message(${iscnId}), please try again later.`,
      });

      Sentry.captureException(ex);
    }

    return null;
  },
  fetchChannels: async (): Promise<GetChannelsResponse> => {
    debug('fetchChannels()');

    dispatch({ type: ActionType.SET_IS_LOADING, isLoading: true });

    try {
      const channels = await getChannels();

      dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });
      dispatch({ type: ActionType.SET_CHANNELS, channels: channels.list });
      dispatch({ type: ActionType.SET_HASHTAGS, hashTags: channels.hashTags });

      return channels;
    } catch (ex) {
      debug('fetchChannels() -> error: %O', ex);

      dispatch({
        type: ActionType.SET_ERROR,
        error: 'Fail to fetch channels, please try again later.',
      });

      Sentry.captureException(ex);
    }

    return { list: [], hashTags: [] };
  },
  fetchMessagesByHashTag: async (
    tag: string,
    previousId?: string,
    limit?: number
  ): Promise<PaginatedResponse<Message[]>> => {
    debug('fetchMessagesByHashTag(tag: %s, previousId: %s)', tag, previousId);

    dispatch({ type: ActionType.SET_IS_LOADING, isLoading: true });

    try {
      const messages = await getMessagesByHashTag(tag, previousId, limit);

      dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

      return messages;
    } catch (ex) {
      debug('fetchMessagesByHashTag() -> error: %O', ex);

      dispatch({
        type: ActionType.SET_ERROR,
        error: 'Fail to fetch messages, please try again later.',
      });

      Sentry.captureException(ex);
    }

    return {
      data: [],
      hasMore: false,
    };
  },
  fetchMessagesByOwner: async (
    owner: string,
    previousId?: string
  ): Promise<PaginatedResponse<GetUserWithMessagesResponse | null> | null> => {
    debug('fetchMessagesByOwner(owner: %s, previousId: %s)', owner, previousId);

    dispatch({ type: ActionType.SET_IS_LOADING, isLoading: true });

    try {
      const messagesByOwner = await getMessagesByOwner(owner, previousId);

      dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

      return messagesByOwner;
    } catch (ex) {
      debug('fetchMessagesByOwner() -> error: %O', ex);

      dispatch({
        type: ActionType.SET_ERROR,
        error: 'Fail to fetch messages, please try again later.',
      });

      Sentry.captureException(ex);
    }

    return null;
  },
  showLoading: () => {
    dispatch({ type: ActionType.SET_IS_LOADING_MODAL_OPEN, isLoadingModalOpen: true });
  },
  closeLoading: () => {
    dispatch({ type: ActionType.SET_IS_LOADING_MODAL_OPEN, isLoadingModalOpen: false });
  },
  showImageModal: (image: string, aspectRatio: number) => {
    dispatch({
      type: ActionType.SET_IS_IMAGE_MODAL_OPEN,
      isImageModalOpen: true,
      image,
      aspectRatio,
    });
  },
  closeImageModal: () => {
    dispatch({
      type: ActionType.SET_IS_IMAGE_MODAL_OPEN,
      isImageModalOpen: false,
      image: null,
      aspectRatio: null,
    });
  },
});

export const AppStateProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const alert = useAlert();
  const { walletAddress, error: connectError } = useWallet();
  const actions = useAppActions(dispatch);

  useEffect(() => {
    void (async () => {
      if (walletAddress) {
        const user = await actions.fetchUser(walletAddress);

        if (user && user.profile) {
          dispatch({ type: ActionType.SET_PROFILE, profile: user.profile });
        } else {
          dispatch({ type: ActionType.SET_PROFILE, profile: null });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  useEffect(() => {
    if (connectError) {
      debug('useEffect() -> connectError: %s', connectError);

      alert.show({
        title: connectError,
        status: 'error',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectError]);

  const contextValue = useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
      <LoadingModal isOpen={state.isLoadingModalOpen} />
    </AppStateContext.Provider>
  );
};

// (AppStateProvider as any).whyDidYouRender = true;
