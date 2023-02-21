import {} from "@remix-run/cloudflare";

const v = <T>(dev: T, prod: T) => {
  const d = MODE === "dev";
  return d ? dev : prod;
};

export default {
  SITE_NAME: "is-a-huge.monster",
  SITE_URL: v("http://localhost:8788", "https://is-a-huge.monster"),
  SITE_DESCRIPTION: "A cool subdomain service",
};
