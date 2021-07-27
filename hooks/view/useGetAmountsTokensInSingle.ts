import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import usePoolRouter from "../contracts/usePoolRouter";

const getAmountsTokensInSingle =
  (contract: Contract) =>
  async (
    _: string,
    tokenIn: string,
    amountTokenIn: number,
    minPoolAmountOut: number
  ) => {
    const value: BigNumber = await contract.getAmountsTokensInSingle(
      tokenIn,
      amountTokenIn,
      minPoolAmountOut
    );

    return value;
  };

export default function useGetAmountsTokensInSingle(
  tokenAddress: string,
  amountTokenIn: number,
  minPoolAmountOut: number
) {
  const contract = usePoolRouter();

  const shouldFetch = !!contract && typeof tokenAddress === "string";

  return useSWR(
    shouldFetch
      ? ["TokenExchangeRate", tokenAddress, amountTokenIn, minPoolAmountOut]
      : null,
    getAmountsTokensInSingle(contract)
  );
}
