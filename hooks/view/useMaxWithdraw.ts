import { MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { formatUnits, parseUnits } from "@ethersproject/units";
import useSWR from "swr";
import usePoolRouter from "../contracts/usePoolRouter";
import useWeb3Store from "../useWeb3Store";
import useTokenBalance from "./useTokenBalance";

function getMaxWithdraw(poolRouter: Contract) {
  return async (_: string, sovBalance: BigNumber, tokenOut: string) => {
    const ANY_GIVEN_AMOUNT = parseUnits("1000");

    const sovAmountInSingle: BigNumber = await poolRouter.getSovAmountInSingle(
      tokenOut,
      ANY_GIVEN_AMOUNT,
      MaxUint256
    );

    console.log("ANY_GIVEN_AMOUNT", ANY_GIVEN_AMOUNT.toString());

    console.log("sovAmountInSingle", sovAmountInSingle.toString());

    const tokenSovExchangeRate = ANY_GIVEN_AMOUNT.div(sovAmountInSingle);

    console.log("tokenSovExchangeRate", tokenSovExchangeRate.toString());

    const maxWithdraw = sovBalance.mul(tokenSovExchangeRate);

    console.log("maxWithdraw", maxWithdraw.toString());

    return maxWithdraw;
  };
}

export default function useMaxWithdraw(tokenOut: string) {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const { data: sov } = useTokenBalance(account, TOKEN_ADDRESSES.SOV[chainId]);

  const contract = usePoolRouter();

  const shouldFetch = !!contract && !!sov && typeof tokenOut === "string";

  return useSWR(
    shouldFetch ? ["MaxWithdraw", sov, tokenOut] : null,
    getMaxWithdraw(contract)
  );
}
