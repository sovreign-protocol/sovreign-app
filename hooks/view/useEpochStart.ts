import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useGovRewards from "../contracts/useGovRewards";
import useWrappingRewards from "../contracts/useWrappingRewards";
import type { BigNumber } from "@ethersproject/bignumber";

function getEpochStart(contract: Contract) {
  return async (_: string) => {
    const epochStart: BigNumber = await contract.epochStart();

    return epochStart.toNumber();
  };
}

export function useEpochStartGovRewards() {
  const contract = useGovRewards();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["EpochStartGovRewards"] : null,
    getEpochStart(contract)
  );
}

export function useEpochStartWrappingRewards() {
  const contract = useWrappingRewards();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["EpochStartWrappingRewards"] : null,
    getEpochStart(contract)
  );
}
