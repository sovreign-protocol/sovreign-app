import { Account } from "./web3";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <ul className="flex justify-between">
        <li>
          <div>
            <span role="img" aria-label="Sovreign">
              Sovreign
            </span>
          </div>
        </li>
        <li>
          <ul>
            <li>
              <Link href="/invest">
                <a>Invest</a>
              </Link>
            </li>
            <li>
              <Link href="/mix">
                <a>Mix</a>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Account />
        </li>
      </ul>
    </nav>
  );
}
