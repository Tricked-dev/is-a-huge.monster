// app/session.server.ts
import { createCookieSessionStorage } from "@remix-run/cloudflare";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [JWT_SECRET],
    secure: MODE === "prod",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
