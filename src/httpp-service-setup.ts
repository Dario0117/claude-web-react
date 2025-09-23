import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import { getAppVersion } from './lib/version';
import type { paths } from './types/api.generated';

const fetchClient = createFetchClient<paths>({
  baseUrl: 'http://127.0.0.1:9000/',
  headers: {
    'Content-Type': 'application/json',
    'X-App-Version': getAppVersion(),
  },
  credentials: 'include',
});
export const $api = createClient(fetchClient);
