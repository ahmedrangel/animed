import type { CfProperties, Request, ExecutionContext } from "@cloudflare/workers-types";

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: {
        DB: D1Database;
        BLOB: R2Bucket;
        CDN: R2Bucket;
      };
      context: ExecutionContext;
    };
  }
}
