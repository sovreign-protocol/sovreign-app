import { Token, TokenNames, TOKEN_ASSETS } from "@/constants/tokens";
import { useCallback, useState } from "react";
import useWeb3Store from "./useWeb3Store";

export default function useAddTokenToMetaMask(currencyToAdd: TokenNames): {
  addToken: () => void;
  success: boolean | undefined;
} {
  const chainId = useWeb3Store((state) => state.chainId);
  const library = useWeb3Store((state) => state.library);

  const token: Token | undefined = TOKEN_ASSETS[currencyToAdd][chainId];

  const [success, setSuccess] = useState<boolean | undefined>();

  const addToken = useCallback(() => {
    if (
      library &&
      library.provider.isMetaMask &&
      library.provider.request &&
      token
    ) {
      library.provider
        .request({
          method: "wallet_watchAsset",
          params: {
            //@ts-ignore // need this for incorrect ethers provider type
            type: "ERC20",
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              // image: getTokenLogoURL(token.address),
            },
          },
        })
        .then((success) => {
          setSuccess(success);
        })
        .catch(() => setSuccess(false));
    } else {
      setSuccess(false);
    }
  }, [library, token]);

  return {
    addToken,
    success,
  };
}
