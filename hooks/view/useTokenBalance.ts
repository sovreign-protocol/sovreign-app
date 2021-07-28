import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useERC20 from "../contracts/useERC20";
import useKeepSWRDataLiveAsBlocksArrive from "../useKeepSWRDataLiveAsBlocksArrive";

const getTokenBalance =
  (contract: Contract) => async (_: string, address: string) => {
    const value: BigNumber = await contract.balanceOf(address);

    return value;
  };

export default function useTokenBalance(address: string, tokenAddress: string) {
  const contract = useERC20(tokenAddress);

  const shouldFetch =
    !!contract &&
    typeof address === "string" &&
    typeof tokenAddress === "string";

  const result = useSWR(
    shouldFetch ? ["TokenBalance", address, tokenAddress] : null,
    getTokenBalance(contract)
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
