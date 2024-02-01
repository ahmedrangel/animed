export {};

declare global {
  interface Token {
    [key: string]: QueryValue;
  }
}
