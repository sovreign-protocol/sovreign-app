import { TOKEN_ADDRESSES } from "@/constants";
import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import usePoolRouter from "../contracts/usePoolRouter";
import useWeb3Store from "../useWeb3Store";
import useTokenBalance from "./useTokenBalance";

function getMaxWithdraw(poolRouter: Contract) {
  return async (_: string, sovBalance: BigNumber, tokenOut: string) => {
    const tokenAmountOut: BigNumber = await poolRouter.getTokenAmountOutSingle(
      tokenOut,
      sovBalance,
      1
    );

    return tokenAmountOut;
  };
}

export default function useMaxWithdraw(tokenOut: string) {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const { data: sovBalance } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.SOV[chainId]
  );

  const contract = usePoolRouter();

  const shouldFetch =
    !!contract && !!sovBalance && typeof tokenOut === "string";

  return useSWR(
    shouldFetch ? ["MaxWithdraw", sovBalance, tokenOut] : null,
    getMaxWithdraw(contract)
  );
}
