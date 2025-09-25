import createFetchClient, { type Middleware } from 'openapi-fetch';
import createClient from 'openapi-react-query';
import { getAppVersion } from './lib/version';
import type { paths } from './types/api.generated';

const authMiddleware: Middleware = {
  // biome-ignore lint/suspicious/useAwait: no need to await
  async onResponse({ response }) {
    const loginPath = '/login';
    if (response.status === 401 && window.location.pathname !== loginPath) {
      window.location.replace(loginPath);
    }
  },
};

const fetchClient = createFetchClient<paths>({
  baseUrl: 'http://127.0.0.1:9000/',
  headers: {
    'Content-Type': 'application/json',
    'X-App-Version': getAppVersion(),
  },
  credentials: 'include',
});
fetchClient.use(authMiddleware);

export const $api = createClient(fetchClient);
