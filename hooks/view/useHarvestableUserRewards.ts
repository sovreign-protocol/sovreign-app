import LPRewards_ABI from "@/contracts/LPRewards.json";
import type { LPRewards } from "@/contracts/types";
import { BigNumber } from "@ethersproject/bignumber";
import useSWR from "swr";
import useContract from "../useContract";

function getHarvestableUserRewards(contract: LPRewards) {
  return async () => {
    const lastEpochIdHarvested = await contract.userLastEpochIdHarvested();

    const currentEpoch = await contract.getCurrentEpoch();

    if (lastEpochIdHarvested.toNumber() === currentEpoch.toNumber()) {
      return BigNumber.from(0);
    }

    const promises = await Promise.all(
      new Array(currentEpoch.toNumber() - 1).fill("").map(async (_, index) => {
        const userRewardsForEpoch = await contract.getUserRewardsForEpoch(
          index + 1
        );

        return userRewardsForEpoch;
      })
    );

    return promises.reduce((prev, curr) => prev.add(curr));
  };
}

export default function useHarvestableUserRewards(
  userAddress: string,
  contractAddress: string
) {
  const contract = useContract<LPRewards>(contractAddress, LPRewards_ABI);

  const shouldFetch = !!contract && typeof userAddress === "string";

  return useSWR(
    shouldFetch
      ? ["HarvestableUserRewards", userAddress, contractAddress]
      : null,
    getHarvestableUserRewards(contract),
    {
      shouldRetryOnError: false,
    }
  );
}
