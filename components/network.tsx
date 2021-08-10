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
    <div className="px-4 py-3 bg-primary-400 ring-1 ring-inset ring-network-rinkeby text-network-rinkeby text-sm rounded-md">
      {info.label}
    </div>
  );
}
