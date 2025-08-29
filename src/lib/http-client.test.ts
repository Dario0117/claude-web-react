import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient, httpClient } from './http-client';

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock the version utility
vi.mock('./version', () => ({
  getAppVersion: vi.fn(() => 'test-version'),
}));

describe('HttpClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true }),
    });
  });

  describe('constructor', () => {
    it('should create an instance with default configuration', () => {
      const client = new HttpClient();
      expect(client).toBeInstanceOf(HttpClient);
    });

    it('should create an instance with custom configuration', () => {
      const client = new HttpClient({
        baseUrl: 'https://api.example.com',
        defaultHeaders: { 'Custom-Header': 'value' },
      });
      expect(client).toBeInstanceOf(HttpClient);
    });
  });

  describe('request method', () => {
    it('should make a request with version header', async () => {
      const client = new HttpClient();

      await client.request('https://api.example.com/test');

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
        },
      });
    });

    it('should merge custom headers with default headers', async () => {
      const client = new HttpClient();

      await client.request('https://api.example.com/test', {
        headers: { 'Authorization': 'Bearer token' },
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
          'Authorization': 'Bearer token',
        },
      });
    });

    it('should build full URL with baseUrl', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.example.com' });

      await client.request('/users');

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
        },
      });
    });

    it('should not modify absolute URLs', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.example.com' });

      await client.request('https://other-api.com/test');

      expect(mockFetch).toHaveBeenCalledWith('https://other-api.com/test', {
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
        },
      });
    });
  });

  describe('HTTP method shortcuts', () => {
    it('should make GET request', async () => {
      const client = new HttpClient();

      await client.get('/test');

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
        },
      });
    });

    it('should make POST request with body', async () => {
      const client = new HttpClient();
      const data = { name: 'test' };

      await client.post('/test', data);

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
        },
      });
    });

    it('should make POST request without body', async () => {
      const client = new HttpClient();

      await client.post('/test');

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'POST',
        body: undefined,
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
        },
      });
    });

    it('should make PUT request with body', async () => {
      const client = new HttpClient();
      const data = { name: 'test' };

      await client.put('/test', data);

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
        },
      });
    });

    it('should make DELETE request', async () => {
      const client = new HttpClient();

      await client.delete('/test');

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
        },
      });
    });

    it('should pass additional options to HTTP methods', async () => {
      const client = new HttpClient();

      await client.get('/test', { credentials: 'include' });

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': 'test-version',
        },
      });
    });
  });

  describe('default export httpClient', () => {
    it('should be configured with correct base URL', async () => {
      await httpClient.get('/users');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://127.0.0.1:9000/api/v1/users',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Version': 'test-version',
          },
        },
      );
    });
  });
});
