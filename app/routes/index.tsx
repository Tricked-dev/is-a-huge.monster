import config from "../config";

export default function Index() {
  return (
    <div className="bg-base-300 max-w-[70rem] w-full mx-auto p-4 rounded-sm mt-4 text-center">
      <h1 className="text-2xl font-bold">
        WELCOME TO {config.SITE_NAME} FREEE SUBDOMAINS!
      </h1>
      <a href="/login" className="mx-2 link link-primary link-hover text-xl">
        Login
      </a>
      <a href="/pptos" className="mx-2 link link-primary link-hover text-xl">
        Privacy & TOS
      </a>
      <p>
        If you need something that is not a CNAME, A, or AAAA record, you can dm
        tricked#3777 on possibly receive another type of record
      </p>
    </div>
  );
}

