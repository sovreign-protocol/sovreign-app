import { TOKEN_ASSETS } from "@/constants/tokens";
import { useCallback, useState } from "react";
import useWeb3Store from "./useWeb3Store";

export default function useAddTokenToMetaMask(): {
  addToken: () => void;
  success: boolean | undefined;
} {
  const chainId = useWeb3Store((state) => state.chainId);
  const library = useWeb3Store((state) => state.library);

  const [success, setSuccess] = useState<boolean | undefined>();

  const addToken = useCallback(async () => {
    try {
      if (library && library.provider.isMetaMask && library.provider.request) {
        const REIGN = TOKEN_ASSETS.REIGN[chainId];

        const SOV = TOKEN_ASSETS.SOV[chainId];

        await library.provider.request({
          method: "wallet_watchAsset",
          params: {
            //@ts-ignore
            type: "ERC20",
            options: {
              address: REIGN.address,
              symbol: REIGN.symbol,
              decimals: REIGN.decimals,
            },
          },
        });

        await library.provider.request({
          method: "wallet_watchAsset",
          params: {
            //@ts-ignore
            type: "ERC20",
            options: {
              address: SOV.address,
              symbol: SOV.symbol,
              decimals: SOV.decimals,
            },
          },
        });

        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error(error);

      setSuccess(false);
    }
  }, [library, chainId]);

  return {
    addToken,
    success,
  };
}
