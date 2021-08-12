import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { parseUnits } from "@ethersproject/units";
import useSWR from "swr";
import usePoolRouter from "../contracts/usePoolRouter";

function getSovAmountOut(contract: Contract) {
  return async (_: string, depositAmount: string, depositToken: string) => {
    const getSovAmountOutSingle: BigNumber =
      await contract.getSovAmountOutSingle(
        depositToken,
        parseUnits(depositAmount),
        1
      );

    console.log(getSovAmountOutSingle.toString());

    return getSovAmountOutSingle;
  };
}

export default function useGetSovAmountOut(
  depositToken: string,
  depositAmount: string
) {
  const contract = usePoolRouter();

  const shouldFetch =
    !!contract &&
    typeof depositAmount === "string" &&
    typeof depositToken === "string";

  return useSWR(
    shouldFetch ? ["GetSovAmountOut", depositAmount, depositToken] : null,
    getSovAmountOut(contract),
    {
      shouldRetryOnError: false,
    }
  );
}
