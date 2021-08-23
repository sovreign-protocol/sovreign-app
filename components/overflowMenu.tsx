import { SUSHI_SWAP_LINKS } from "@/constants/tokens";
import { Menu } from "@headlessui/react";
import cn from "classnames";
import Link from "next/link";
import { Menu as MenuIcon, MoreHorizontal } from "react-feather";

function NextLink(props) {
  let { href, children, ...rest } = props;

  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
}

const menuItemClassNames =
  "flex rounded items-center w-full p-2 text-sm focus:outline-none";

export default function OverflowMenu() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex space-x-2 w-full px-3 py-3 bg-primary-400 ring-1 ring-inset ring-white ring-opacity-10 text-sm rounded-xl focus:outline-none focus-visible:ring-opacity-20 hover:ring-opacity-20">
        <MoreHorizontal size={20} />
      </Menu.Button>

      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-primary-400 ring-1 ring-inset ring-white ring-opacity-10 rounded-lg focus:outline-none p-1 z-50">
        <Menu.Item>
          {({ active }) => (
            <a
              href={SUSHI_SWAP_LINKS.SOV}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(menuItemClassNames, active && "bg-white/[0.10]")}
            >
              Buy SOV on SushiSwap
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href={SUSHI_SWAP_LINKS.REIGN}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(menuItemClassNames, active && "bg-white/[0.10]")}
            >
              Buy REIGN on SushiSwap
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <NextLink
              href="/faqs"
              className={cn(menuItemClassNames, active && "bg-white/[0.10]")}
            >
              FAQs
            </NextLink>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="https://sovreign.org"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(menuItemClassNames, active && "bg-white/[0.10]")}
            >
              About
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="https://github.com/sovreign-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(menuItemClassNames, active && "bg-white/[0.10]")}
            >
              Developers
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="https://discord.gg/pBRqDmMEDu"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(menuItemClassNames, active && "bg-white/[0.10]")}
            >
              Discord
            </a>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
