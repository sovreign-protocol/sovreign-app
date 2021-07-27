import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useERC20 from "../contracts/useERC20";

const getTokenBalance =
  (contract: Contract) => async (_: string, address: string) => {
    const value: BigNumber = await contract.balanceOf(address);

    return value;
  };

export default function useTokenBalance(address: string) {
  const contract = useERC20();

  const shouldFetch = !!contract && typeof address === "string";

  return useSWR(
    shouldFetch ? ["TokenBalance", address] : null,
    getTokenBalance(contract)
  );
}
