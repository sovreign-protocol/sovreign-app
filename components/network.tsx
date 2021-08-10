import { ChainInfo, CHAIN_INFO, SupportedChainId } from "@/constants";
import useWeb3Store from "@/hooks/useWeb3Store";
import { useMemo } from "react";

export default function NetworkIndicator() {
  const chainId = useWeb3Store((state) => state.chainId);

  const info: ChainInfo = useMemo(() => {
    return CHAIN_INFO[chainId];
  }, [chainId]);

  if (
    typeof chainId === "undefined" ||
    chainId === SupportedChainId.MAINNET ||
    !info
  ) {
    return null;
  }

  return (
    <div className="fixed transform -translate-x-1/2 left-1/2 bottom-4 sm:relative sm:transform-none sm:bottom-auto sm:left-auto px-6 sm:px-4 py-3 bg-primary-400 ring-1 ring-inset ring-network-rinkeby text-network-rinkeby text-sm rounded-full sm:rounded-md z-50 sm:z-auto">
      {info.label}
    </div>
  );
}
