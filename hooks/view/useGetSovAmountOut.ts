import type { PoolRouter } from "@/contracts/types";
import { parseUnits } from "@ethersproject/units";
import useSWR from "swr";
import { usePoolRouter } from "../useContract";

function getSovAmountOut(contract: PoolRouter) {
  return async (_: string, depositAmount: string, depositToken: string) => {
    const getSovAmountOutSingle = await contract.getSovAmountOutSingle(
      depositToken,
      parseUnits(depositAmount),
      1
    );

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
