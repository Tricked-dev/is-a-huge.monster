import type { ActionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { auth } from "~/auth.server";
import { getJsonKey, subdomain } from "~/util";

const CNAME_REGEX = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/i;
const A_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
const AAA_REGEX = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

export async function action({ context, request }: ActionArgs) {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();
  const type = formData.get("type");
  const _subdomain = formData.get("subdomain");
  const value = formData.get("value");
  const proxied = formData.get("proxied");
  //verify the data
  let res = subdomain.safeParse({
    type,
    value,
    subdomain: _subdomain,
    proxied: proxied == "on",
  });

  if (!res.success) {
    return json({
      error: "Invalid data",
    });
  }

  const monster = context.MONSTER as KVNamespace;
  // let info = await getJsonKey(monster, `${user.id}:info`, {});
  let subdomains = await getJsonKey(monster, `${user.id}:subdomains`, {
    subdomains: [],
  });

  if (subdomains.subdomains.length > 2) {
    return json({
      error: "You can only have 3 subdomains",
    });
  } else {
    try {
      const claims = ((await monster.get("claimed")) ?? "").split(",");
      if (!claims.includes(res.data.subdomain)) {
        if (res.data.type === "CNAME") {
          if (!CNAME_REGEX.test(res.data.value)) {
            return json({
              error: "Invalid CNAME record",
            });
          }
          //validate the cname
          const domain = res.data.value;
          const parts = domain.split(".");

          if (parts.length < 2) {
            return json({
              error: "Invalid CNAME record",
            });
          }
          for (const part of parts) {
            if (part.length > 63) {
              return json({
                error: "Invalid CNAME record",
              });
            }
          }
        } else if (res.data.type === "A") {
          if (!A_REGEX.test(res.data.value)) {
            for (const part of res.data.value.split(".")) {
              if (parseInt(part) > 255) {
                return json({
                  error: "Invalid A record",
                });
              }
            }
            if (res.data.value == "127.0.0.1") {
              return json({
                error: "Invalid A record",
              });
            }

            return json({
              error: "Invalid A record",
            });
          }
        } else if (res.data.type === "AAA") {
          if (!AAA_REGEX.test(res.data.value)) {
            return json({
              error: "Invalid AAA record",
            });
          }
        } else {
          return json({
            error: "(unreachable) Invalid type",
          });
        }

        await monster.put("claimed", [...claims, res.data.subdomain].join(","));

        await monster.put(
          `${user.id}:subdomains`,
          JSON.stringify({
            subdomains: [...subdomains.subdomains, res.data],
          })
        );
      } else {
        return json({
          error: "Subdomain already claimed",
        });
      }
    } catch (e) {
      return json({
        error: "Something went wrong",
      });
    }
  }

  return json({ success: true });
}

type Result = { error?: string; success?: true };

export default function NewNotePage() {
  const actionData = useActionData<Result>();
  const titleRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.error) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post">
      <div className="my-4">
        <h3 className="text-lg">Create new subdomain</h3>
        {actionData?.error && (
          <p className="text-red-600 bg-white">{actionData.error}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <select
            className="select select-primary select-sm"
            name="type"
            defaultValue="CNAME"
          >
            <option value="CNAME">CNAME</option>
            <option value="A">A</option>
            <option value="AAA">AAA</option>
          </select>
        </div>
        <div>
          <input
            className="input input-sm input-primary w-full"
            name="subdomain"
            placeholder="Subdomain to use"
          ></input>
        </div>
        <div>
          <input
            className="input input-sm input-primary w-full"
            name="value"
            placeholder="Value"
          ></input>
        </div>
        <div>
          <label></label>
        </div>
        <div className="">
          <label className="cursor-pointer">
            <input
              className="toggle toggle-sm toggle-primary"
              defaultChecked
              type="checkbox"
              name="proxied"
            />
            <span className="w-full ml-2">Proxy</span>
          </label>
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
      </div>
    </Form>
  );
}

