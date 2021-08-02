import { MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { parseUnits } from "@ethersproject/units";
import useSWR from "swr";
import usePoolRouter from "../contracts/usePoolRouter";
import useWeb3Store from "../useWeb3Store";
import useTokenBalance from "./useTokenBalance";

function getMaxWithdraw(poolRouter: Contract) {
  return async (_: string, sovBalance: BigNumber, tokenOut: string) => {
    const ANY_GIVEN_AMOUNT = parseUnits("1");

    const poolAmountIn: BigNumber = await poolRouter.getSovAmountInSingle(
      tokenOut,
      ANY_GIVEN_AMOUNT,
      MaxUint256
    );

    const tokenSovExchangeRate = ANY_GIVEN_AMOUNT.div(poolAmountIn);

    const maxWithdraw = sovBalance.mul(tokenSovExchangeRate);

    return maxWithdraw;
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
