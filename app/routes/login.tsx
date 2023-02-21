import type { LoaderFunction } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { auth } from "~/auth.server";

export let loader: LoaderFunction = async ({ context, request }) => {
  return await auth.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
};

export default function Login() {
  return (
    <Form
      action="/auth/discord"
      method="post"
      className="bg-base-300 max-w-[70rem] w-full mx-auto p-4 rounded-sm mt-4 text-center"
    >
      <p className="text-xl font-bold">Login with Discord oath2</p>
      <button className="btn btn-primary btn-out my-2">
        Login with Discord
      </button>
      <p className="max-w-xl mx-auto">
        Is this a good login page? idk im just gonna put more text here so it
        doesnt feel that empty thank you for reading this does the page feel
        more nice right?
      </p>
      <a href={"/"} className="link link-secondary link-hover">
        {"<- back to main page"}
      </a>
    </Form>
  );
}

