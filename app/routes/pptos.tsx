export default function Index() {
  return (
    <div className="bg-base-300 max-w-[70rem] w-full mx-auto p-4 rounded-sm mt-4">
      <a href={"/"} className="link link-secondary link-hover">
        {"<- back to main page"}
      </a>
      <h2 className="text-xl font-bold leading-8 text-primary">
        Privacy Policy
      </h2>
      <ul>
        <li>
          <h3 className="text-lg font-semibold leading-5 text-primary">
            What information do we collect?
          </h3>
          <p>
            We collect your discord id to be able to connect the subdomains to
            you
          </p>
        </li>
        <li>
          <h3 className="text-lg font-semibold leading-5 text-primary">
            When you create a subdomain
          </h3>
          <p>
            A alert will be send notifying us of the subdomain content and type
            the purpose of this is to detect abuse, We do not share the
            subdomains you created with anyone
          </p>
        </li>
      </ul>
      <h2 className="text-xl font-bold leading-8 text-primary">
        Terms of Service
      </h2>
      <ul>
        <li>
          <h3 className="text-lg font-semibold leading-5 text-primary">
            What is allowed?
          </h3>
          <p>
            You are allowed to use the subdomains for any personal projects, or
            for cool redicts and stuff
          </p>
        </li>
        <li>
          <h3 className="text-lg font-semibold leading-5 text-primary">
            What is not allowed?
          </h3>
          <p>
            You are not allowed to use the subdomains for any illegal, porn,
            gore or hate attacks
          </p>
        </li>
        <li>
          <h3 className="text-lg font-semibold leading-5 text-primary">
            What happens if you break the rules?
          </h3>
          <p>
            If you break the rules your subdomain will be removed and you will
            be banned from the service
          </p>
        </li>
      </ul>
    </div>
  );
}

