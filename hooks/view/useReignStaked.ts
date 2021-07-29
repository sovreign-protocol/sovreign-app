import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useReignFacet from "../contracts/useReignFacet";

const getReignStaked = (contract: Contract) => async () => {
  const value: BigNumber = await contract.reignStaked();

  return value;
};

export default function useReignStaked() {
  const contract = useReignFacet();

  const shouldFetch = !!contract;

  return useSWR(shouldFetch ? ["ReignStaked"] : null, getReignStaked(contract));
}
