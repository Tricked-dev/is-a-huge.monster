import { z } from "zod";
export async function getJsonKey(kv: KVNamespace, key: string, def: any) {
  let data = await kv.get(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return def;
  }
}

export const subdomain = z.object({
  type: z.enum(["A", "AAA", "CNAME"]),
  subdomain: z.string().regex(/^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/),
  value: z.string(),
  proxied: z.boolean().default(true),
}).strict();

export type Subdomain = z.infer<typeof subdomain>;
