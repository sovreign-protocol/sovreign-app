import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import NetworkIndicator from "./network";
import { Account } from "./web3";

function NavigationItem({ text, href }: { text: string; href: string }) {
  const { asPath } = useRouter();

  const cachedClassNames = classNames(
    "font-medium leading-5 flex items-center justify-center py-2 px-2 text-center leading-5 focus:outline-none focus:text-gray-300 rounded transition-colors",
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
        <li className="flex-shrink-0">
          <Link href="/invest">
            <a className="flex items-center md:space-x-2 focus:outline-none focus:text-gray-300 hover:text-gray-300 transition-colors">
              <img
                className="w-10 h-10"
                src="/logo.png"
                alt="Sovreign"
                loading="eager"
              />

              <div className="hidden md:block">
                <span
                  className="inline-block text-2xl font-light tracking-wide leading-none select-none"
                  role="img"
                  aria-label="Sovreign"
                >
                  Sovreign
                </span>
              </div>
            </a>
          </Link>
        </li>

        <li className="flex-1">
          <ul className="md:ml-4 flex space-x-2 md:space-x-4">
            <li>
              <NavigationItem href="/invest" text="Invest" />
            </li>
            <li>
              <NavigationItem href="/stake" text="Stake" />
            </li>
            <li>
              <NavigationItem href="/rebalance" text="Rebalance" />
            </li>
            <li>
              <NavigationItem href="/farming" text="Farming" />
            </li>
            <li>
              <NavigationItem href="/harvest" text="Harvest" />
            </li>
            <li>
              <NavigationItem href="/vote" text="Vote" />
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
