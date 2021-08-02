import { TOKEN_ADDRESSES } from "@/constants";
import useWeb3Store from "@/hooks/useWeb3Store";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import { injected } from "@/lib/connectors/metamask";
import WalletConnectConnector from "@/lib/connectors/walletconnect";
import shortenAddress from "@/utils/shortenAddress";
import { formatUnits } from "@ethersproject/units";
import { Menu } from "@headlessui/react";
import cn from "classnames";
import { useMemo } from "react";
import { useCallback } from "react";
import Blockie from "./blockie";

const menuItemClassNames =
  "group flex rounded items-center w-full px-2 py-2 text-sm focus:outline-none";

export function Account() {
  const account = useWeb3Store((state) => state.account);
  const connector = useWeb3Store((state) => state.connector);
  const chainId = useWeb3Store((state) => state.chainId);
  const reset = useWeb3Store((state) => state.reset);

  const { data: sovBalance } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.SOV[chainId]
  );

  const formattedSOVBalance = useMemo(
    () => Number(formatUnits(sovBalance ?? 0)).toFixed(2),
    [sovBalance]
  );

  const disconnect = useCallback(() => {
    if (connector instanceof WalletConnectConnector) {
      connector.disconnect();
    }

    connector?.deactivate();

    reset();
  }, [connector, reset]);

  async function connect() {
    try {
      await injected.activate();
    } catch (error) {
      console.error(error);
    }
  }

  if (account)
    return (
      <Menu as="div" className="relative">
        <div className="bg-gray-200 rounded-lg flex items-center">
          {sovBalance && (
            <div className="flex-shrink-0 px-3 text-sm">
              {`${formattedSOVBalance} SOV`}
            </div>
          )}

          <Menu.Button className="inline-flex space-x-2 w-full px-4 py-[11px] border border-gray-200 text-sm bg-gray-400 rounded-md focus:outline-none focus-visible:ring-4">
            <Blockie address={account} />

            <span>{shortenAddress(account)}</span>
          </Menu.Button>
        </div>

        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-gray-400 rounded-md  focus:outline-none px-1 py-1 z-50">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={disconnect}
                className={cn(menuItemClassNames, active && "bg-gray-200")}
              >
                Log out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    );

  return <button onClick={connect}>Connect Wallet</button>;
}
