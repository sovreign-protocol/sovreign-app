import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { Account } from "./web3";

function NavigationItem({ text, href }: { text: string; href: string }) {
  const { asPath } = useRouter();

  const cachedClassNames = classNames(
    "flex items-center justify-center py-[7px] border w-24 text-center rounded-md leading-5",
    asPath === href
      ? "bg-white bg-opacity-10 border-white border-opacity-10"
      : "border-transparent"
  );

  return (
    <Link href={href}>
      <a className={cachedClassNames}>{text}</a>
    </Link>
  );
}

export default function Navigation() {
  return (
    <nav className="px-8 py-4">
      <ul className="flex items-center justify-between">
        <li className="flex-1">
          <span
            className="text-2xl font-light tracking-wide leading-none cursor-default select-none"
            role="img"
            aria-label="Sovreign"
          >
            Sovreign
          </span>
        </li>

        <li className="flex-1 flex justify-center">
          <ul className="inline-flex justify-center rounded-lg bg-white bg-opacity-5">
            <li>
              <NavigationItem href="/invest" text="Invest" />
            </li>
            <li>
              <NavigationItem href="/mix" text="Mix" />
            </li>
          </ul>
        </li>

        <li className="flex-1">
          <Account />
        </li>
      </ul>
    </nav>
  );
}
