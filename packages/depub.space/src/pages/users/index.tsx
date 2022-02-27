import React, { memo, useEffect, useState } from 'react';
import Debug from 'debug';
import {
  Link,
  Button,
  Box,
  IconButton,
  HStack,
  useToast,
  Divider,
  VStack,
  Text,
  Tooltip,
  Image,
  Heading,
  Avatar,
} from 'native-base';
import { Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'next/router';
import { TipsModal, Layout, MessageList, MessageModal, ConnectModal } from '../../components';
import { Message, DesmosProfile } from '../../interfaces';
import { useAppState, useSigningCosmWasmClient } from '../../hooks';
import {
  sendLIKE,
  getShortenAddress,
  getAbbrNickname,
  getLikecoinAddressByProfile,
} from '../../utils';
import { MAX_WIDTH } from '../../contants';

const debug = Debug('web:<UserPage />');
const isDev = process.env.NODE_ENV !== 'production';
const ISCN_SCHEME = process.env.NEXT_PUBLIC_ISCN_SCHEME;

export default function IndexPage() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const rewriteRouteObject =
    typeof window !== 'undefined' ? ((window as any) || {}).rewriteRoute || {} : {};
  const account = isDev ? router.query.account?.toString() : rewriteRouteObject.account; // rewriteRoute object is injecting by Cloudflare worker
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModaOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [profile, setProfile] = useState<DesmosProfile | null>(null);
  const shortenAccount = account ? getShortenAddress(account) : '';
  const [messages, setMessages] = useState<Message[]>([]);
  const {
    error: connectError,
    isLoading: isConnectLoading,
    connectKeplr,
    connectWalletConnect,
    walletAddress,
    offlineSigner,
  } = useSigningCosmWasmClient();
  const { isLoading, fetchMessagesByOwner } = useAppState();
  const toast = useToast();
  const profilePic = profile?.profilePic;
  const nickname = profile?.nickname || shortenAccount;
  const abbrNickname = getAbbrNickname(nickname);
  const accountIsWalletAddress = /^(cosmos1|like1)/.test(account);
  const bio = profile?.bio;
  const dtag = profile?.dtag;
  const likecoinWalletAddress = profile && getLikecoinAddressByProfile(profile);
  const showMessagesList = accountIsWalletAddress || likecoinWalletAddress || !isReady;
  const isPageOwner = likecoinWalletAddress === walletAddress;

  const handleOnTips = async (amount: number) => {
    if (walletAddress && likecoinWalletAddress && offlineSigner) {
      await sendLIKE(
        walletAddress,
        likecoinWalletAddress,
        amount.toFixed(2),
        offlineSigner,
        'Send tips on depub.SPACE'
      );

      toast.show({
        title: 'Sent tips successfully!',
        status: 'success',
        placement: 'top',
      });
    }
  };

  const fetchNewMessages = async (previousId?: string) => {
    debug('fetchNewMessages()');

    if (!account) {
      return;
    }

    if (isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    const res = await fetchMessagesByOwner(account, previousId);

    if (res) {
      if (res.messages) {
        setMessages(msgs => msgs.concat(res.messages));
      }

      if (res.profile) {
        setProfile(res.profile);
        setIsReady(true);
      }
    }

    setIsLoadingMore(false);
  };

  const handleOnShare = async (message: Message) => {
    const messageIscnId = message.id.replace(new RegExp(`^${ISCN_SCHEME}/`), '');
    const shareableUrl = isDev ? `/?id=${messageIscnId}` : `/${messageIscnId}`;

    await router.push(`/users?account=${account}`, shareableUrl, { shallow: true });

    setSelectedMessage(message);
  };

  const handleOnCloseModal = async () => {
    const currentUrl = isDev ? `/users?account=${account}` : `/${account}`;

    setSelectedMessage(null);

    await router.push(`/users?account=${account}`, currentUrl, { shallow: true });
  };

  useEffect(() => {
    // eslint-disable-next-line func-names
    void (async function () {
      if (router.isReady && !account) {
        if (Platform.OS === 'web') {
          window.location.href = '/';
        }

        return;
      }

      await fetchNewMessages();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, router.isReady]);

  useEffect(() => {
    if (connectError) {
      debug('useEffect() -> connectError: %s', connectError);

      setIsConnectModaOpen(false);
      setIsTipsModalOpen(false);

      toast.show({
        title: connectError,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectError]);

  const ListHeaderComponent = memo(() => (
    <VStack h="100%" maxW="640px" mx="auto" my={4} px={4} w="100%">
      <HStack alignItems="center" flex={1} justifyContent="center" space={2}>
        <Link href="/">
          <IconButton
            _icon={{
              as: AntDesign,
              name: 'back',
            }}
          />
        </Link>
        <VStack alignItems="center" flex={1} justifyContent="center" space={4}>
          <Avatar
            bg="gray.200"
            borderColor={likecoinWalletAddress ? 'primary.500' : 'gray.200'}
            borderWidth={2}
            size="md"
            source={profilePic ? { uri: profilePic } : undefined}
          >
            {abbrNickname}
          </Avatar>
          <VStack alignItems="center" flex={1} justifyContent="center" space={1}>
            <Box textAlign="center">
              <Heading fontSize="xl">{nickname}</Heading>
              {dtag ? (
                <Text color="gray.500" fontSize="sm">
                  @{dtag}
                </Text>
              ) : null}
            </Box>
            {bio ? <Text fontSize="sm">{bio}</Text> : null}
          </VStack>
          <HStack>
            {likecoinWalletAddress && !isPageOwner && (
              <Tooltip label="Send tips">
                <Button
                  isLoading={isConnectLoading}
                  isLoadingText="Connecting to wallet..."
                  leftIcon={
                    <Image alt="tips" h={8} source={{ uri: '/images/likecoin-like.svg' }} w={8} />
                  }
                  variant="unstyled"
                  onPress={() => {
                    if (walletAddress) {
                      setIsTipsModalOpen(true);
                    } else {
                      setIsConnectModaOpen(true);
                    }
                  }}
                />
              </Tooltip>
            )}
          </HStack>
        </VStack>
      </HStack>

      <Divider mb={8} />
    </VStack>
  ));

  const ListItemSeparatorComponent = memo(() => (
    <Divider maxW={MAX_WIDTH} mx="auto" my={4} w="100%" />
  ));

  return account ? (
    <>
      <Layout metadata={{ title: `${nickname || walletAddress} on depub.SPACE` }}>
        {showMessagesList ? (
          <MessageList
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            ItemSeparatorComponent={ListItemSeparatorComponent}
            ListHeaderComponent={ListHeaderComponent}
            messages={messages}
            onFetchMessages={fetchNewMessages}
            onShare={handleOnShare}
          />
        ) : (
          <VStack maxWidth={MAX_WIDTH} mx="auto" space={3}>
            <ListHeaderComponent />
            <Box>
              <Text color="gray.500" textAlign="center">
                This profile has not linked to Likecoin, if you are the profile owner, please go to{' '}
                <Link href="https://x.forbole.com/" isExternal>
                  Forbole X
                </Link>{' '}
                to link your Likecoin wallet address
              </Text>
            </Box>
          </VStack>
        )}
      </Layout>
      {selectedMessage && (
        <MessageModal isOpen message={selectedMessage} onClose={handleOnCloseModal} />
      )}
      {likecoinWalletAddress && (
        <TipsModal
          isOpen={isTipsModalOpen}
          nickname={nickname}
          recipientAddress={account}
          senderAddress={walletAddress}
          onClose={() => setIsTipsModalOpen(false)}
          onSubmit={handleOnTips}
        />
      )}
      {walletAddress && (
        <ConnectModal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModaOpen(false)}
          onPressKeplr={connectKeplr}
          onPressWalletConnect={connectWalletConnect}
        />
      )}
    </>
  ) : null;
}
