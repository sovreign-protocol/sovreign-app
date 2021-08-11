import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import NetworkIndicator from "./network";
import { Account } from "./web3";

function NavigationItem({ text, href }: { text: string; href: string }) {
  const { asPath } = useRouter();

  const cachedClassNames = classNames(
    "font-medium leading-5 flex items-center justify-center py-2 px-2 text-center leading-5 focus:outline-none rounded",
    asPath === href ? "text-white " : "text-gray-500"
  );

  return (
    <Link href={href}>
      <a className={cachedClassNames}>{text}</a>
    </Link>
  );
}

export default function Navigation() {
  return (
    <nav className="px-5 md:px-8 py-4">
      <ul className="flex items-center justify-between">
        <li className="md:flex-1 flex-shrink-0">
          <div className="hidden md:block">
            <span
              className="inline-block text-2xl font-light tracking-wide leading-none cursor-default select-none"
              role="img"
              aria-label="Sovreign"
            >
              Sovreign
            </span>
          </div>

          <div className="block md:hidden">
            <img
              className="w-10 h-10"
              src="/logo.png"
              alt="Sovreing"
              loading="eager"
            />
          </div>
        </li>

        <li className="flex-1 flex justify-center">
          <ul className="inline-flex justify-center space-x-2 md:space-x-4">
            <li>
              <NavigationItem href="/invest" text="Invest" />
            </li>
            <li>
              <NavigationItem href="/rebalance" text="Rebalance" />
            </li>
            <li>
              <NavigationItem href="/stake" text="Stake" />
            </li>
            <li>
              <NavigationItem href="/vote" text="Vote" />
            </li>
            <li>
              <NavigationItem href="/harvest" text="Harvest" />
            </li>
          </ul>
        </li>

        <li className="flex-1 flex justify-end md:space-x-4">
          <NetworkIndicator />
          <Account />
        </li>
      </ul>
    </nav>
  );
}
