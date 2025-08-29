import { getAppVersion } from './version';

export interface HttpClientConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

/**
 * Enhanced fetch function that automatically includes the app version header
 * and provides a consistent interface for HTTP requests.
 */
export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-App-Version': getAppVersion(),
      ...config.defaultHeaders,
    };
  }

  private buildUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.baseUrl}${url}`;
  }

  private buildHeaders(
    customHeaders?: Record<string, string>,
  ): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...customHeaders,
    };
  }

  async request(url: string, options: RequestInit = {}): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    const headers = this.buildHeaders(
      options.headers as Record<string, string>,
    );

    return await fetch(fullUrl, {
      ...options,
      headers,
    });
  }

  async get(
    url: string,
    options: Omit<RequestInit, 'method'> = {},
  ): Promise<Response> {
    return await this.request(url, { ...options, method: 'GET' });
  }

  async post(
    url: string,
    body?: unknown,
    options: Omit<RequestInit, 'method' | 'body'> = {},
  ): Promise<Response> {
    return await this.request(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put(
    url: string,
    body?: unknown,
    options: Omit<RequestInit, 'method' | 'body'> = {},
  ): Promise<Response> {
    return await this.request(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete(
    url: string,
    options: Omit<RequestInit, 'method'> = {},
  ): Promise<Response> {
    return await this.request(url, { ...options, method: 'DELETE' });
  }
}

// Create a default instance for the application
export const httpClient = new HttpClient({
  baseUrl: 'http://127.0.0.1:9000/api/v1',
});
