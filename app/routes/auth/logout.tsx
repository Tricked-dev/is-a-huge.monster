import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { auth } from "~/auth.server";

export let loader: LoaderFunction = () => redirect("/login");

export let action: ActionFunction = ({ request }) => {
  return auth.logout(request, { redirectTo: "/login" });
};

