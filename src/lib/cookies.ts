export const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  // biome-ignore lint/suspicious/noDocumentCookie: used for client-side only settings
  document.cookie = `${name}=${value}; path=/; max-age=${expires.toUTCString()}`;
};

export const getCookie = (name: string) => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name));
  if (!cookie) {
    return null;
  }
  const parts = cookie.split('=');
  return parts[1];
};
