import type { ActionArgs, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { auth } from "~/auth.server";
import type { DiscordUser } from "~/auth.server";
import { getJsonKey, type Subdomain } from "~/util";

export let loader: LoaderFunction = async ({ context, request }) => {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const monster = context.MONSTER as KVNamespace;
  // let info = await getJsonKey(monster, `${user.id}:info`, {});
  let subdomains = await getJsonKey(monster, `${user.id}:subdomains`, {
    subdomains: [],
  });

  return json({
    user,
    subdomains: subdomains.subdomains,
  });
};

export async function action({ context, request }: ActionArgs) {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const monster = context.MONSTER as KVNamespace;

  const formData = await request.formData();
  const name = formData.get("name");
  if (!name) {
    return json({
      error: "Invalid data",
    });
  }
  let subdomains = await getJsonKey(monster, `${user.id}:subdomains`, {
    subdomains: [],
  });
  const found: Subdomain = subdomains.subdomains.find(
    (subdomain: Subdomain) => subdomain.value === name
  );
  if (!found) {
    return json({
      error: "Invalid data",
    });
  }
  subdomains.subdomains = subdomains.subdomains.filter(
    (subdomain: Subdomain) => subdomain.value !== name
  );

  const claims = ((await monster.get("claimed")) ?? "")
    .split(",")
    .filter((claim) => claim !== found.subdomain);
  await monster.put("claimed", [...claims].join(","));

  await monster.put(
    `${user.id}:subdomains`,
    JSON.stringify({
      ...subdomains,
      subdomains: subdomains.subdomains,
    })
  );
  return json({ success: true });
}

type LoaderData = {
  user: DiscordUser;
  info: any;
  subdomains: Subdomain[];
};

export default function DashboardPage() {
  const { user, subdomains } = useLoaderData<LoaderData>();
  return (
    <div className="max-w-[70rem] w-full mx-auto bg-base-300 p-4 rounded-sm mt-4 ">
      <h1 className="text-center text-2xl">Dashboard</h1>
      <h2 className="text-center text-xl">
        Welcome {user.displayName}#{user.discriminator}
      </h2>
      <div>
        <h3 className="text-center text-lg">Subdomains</h3>
        <p>
          <strong>
            Subdomains are updated once every 30 minutes to prevent spam
          </strong>
        </p>
        <div>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Subdomain</th>
                <th>To</th>
                <th>Type</th>
                <th>Proxied</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subdomains.map((subdomain) => (
                <tr key={subdomain.value}>
                  <td>{subdomain.subdomain}</td>
                  <td>{subdomain.value}</td>
                  <td>{subdomain.type}</td>
                  <td>{subdomain.proxied ? "Yes" : "No"}</td>
                  <td>
                    <Form action="/dashboard" method="post">
                      <input
                        type="hidden"
                        name="name"
                        value={subdomain.value}
                      />
                      <button type="submit">X</button>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link className="link link-accent link-hover" to="new">
          Create new subdomain
        </Link>
        <Outlet />

        <div className="flex gap-2 mt-4">
          <Form action="/auth/logout" method="post">
            <button className="btn btn-outline btn-warning btn-sm">
              Logout
            </button>
          </Form>
          <Link className="btn btn-outline btn-info btn-sm" to="/">
            Main
          </Link>
        </div>
      </div>
    </div>
  );
}
