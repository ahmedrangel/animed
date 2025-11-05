import { subtle } from "uncrypto";

export type { H3Event } from "h3";

const encoder = new TextEncoder();

export const hash = async (string: string, salt?: string) => {
  const data = encoder.encode(salt ? string + salt : string);
  const base64 = await subtle.digest("SHA-256", data).then(hash => Buffer.from(hash).toString("base64"));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};
