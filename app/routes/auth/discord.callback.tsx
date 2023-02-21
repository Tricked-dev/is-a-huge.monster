import type { LoaderFunction } from "@remix-run/cloudflare";
import { auth } from "~/auth.server";

export let loader: LoaderFunction = ({ request }) => {
  return auth.authenticate("discord", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};

