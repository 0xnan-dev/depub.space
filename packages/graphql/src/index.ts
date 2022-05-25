// import { Secp256k1Signature } from '@cosmjs/crypto';
import { Bindings } from '../bindings';
import { apollo, playground } from './handlers';
import { GqlHandlerOptions } from './handlers/handler.types';
import { setCorsHeaders as setCors } from './utils';

export { IscnTxn, UserProfile } from './durable-objects';

const graphQLOptions: GqlHandlerOptions = {
  baseEndpoint: '/',
  playgroundEndpoint: '/playground',
  cors: true,
  forwardUnmatchedRequestsToOrigin: false,
  debug: process.env.NODE_ENV === 'development',
  kvCache: false,
};

// const verifySign = rawTxt => {
//   const [signature, nounce] = rawTxt.split('.');

//   const sign = Buffer.from(signature, 'base64');
//   const secpSignature = Secp256k1Signature.fromFixedLength(sign);
// };

const handleRequest = async (request: Request, env: Bindings) => {
  const url = new URL(request.url);
  const isDev = env.ENVIRONMENT !== 'production';
  const referer = request.headers.get('referer');
  const refererUrl = referer && new URL(referer);

  try {
    // Authentication with signed message
    const authHeader = request.headers.get('Authorization');

    if (authHeader) {
      // const [, authValue] = authHeader.split('Bearer ');
    }

    if (url.pathname === graphQLOptions.baseEndpoint) {
      const response =
        request.method === 'OPTIONS'
          ? new Response('', { status: 204 })
          : await apollo(request, {
              ...graphQLOptions,
              context: () => ({
                env,
                signedAddress: authHeader,
              }),
            });

      // CORS
      if (graphQLOptions.cors) {
        let allowOrigin = '*';

        if (refererUrl) {
          // development only
          if (isDev && refererUrl.hostname === 'localhost') {
            allowOrigin = refererUrl.origin;
          } else if (refererUrl.hostname.endsWith('depub.space')) {
            allowOrigin = refererUrl.origin;
          }
        }

        setCors(response, {
          allowOrigin,
          allowCredentials: 'true',
          allowHeaders: '*',
          allowMethods: 'GET, POST',
        });
      }

      return response;
    }

    if (graphQLOptions.playgroundEndpoint && url.pathname === graphQLOptions.playgroundEndpoint) {
      return playground(request, graphQLOptions);
    }

    if (graphQLOptions.forwardUnmatchedRequestsToOrigin) {
      return await fetch(request);
    }

    return new Response('Not found', { status: 404 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('ERROR ?', err);

    return new Response(graphQLOptions.debug ? (err as any) : 'Something went wrong', {
      status: 500,
    });
  }
};

export default {
  fetch: (request: Request, env: Bindings) => handleRequest(request, env),
};
