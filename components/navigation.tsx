import { Account } from "./web3";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="p-4">
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
              <Link href="/invest">
                <a className="flex items-center justify-center py-[7px] border border-white border-opacity-10 w-24 text-center rounded-md leading-5 bg-white bg-opacity-10">
                  Invest
                </a>
              </Link>
            </li>
            <li>
              <Link href="/mix">
                <a className="flex items-center justify-center py-[7px] border border-transparent border-opacity-10 w-24 text-center rounded-md leading-5">
                  Mix
                </a>
              </Link>
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
