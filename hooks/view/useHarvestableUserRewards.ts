import LPRewards_ABI from "@/contracts/LPRewards.json";
import type { LPRewards } from "@/contracts/types";
import { BigNumber } from "@ethersproject/bignumber";
import useSWR from "swr";
import useContract from "../useContract";

function getHarvestableUserRewards(contract: LPRewards) {
  return async () => {
    const lastEpochIdHarvested = await contract.userLastEpochIdHarvested();

    const currentEpoch = await contract.getCurrentEpoch();

    const getTotalRewards = async () => {
      let _total = BigNumber.from(0);

      for (
        let index = lastEpochIdHarvested.toNumber();
        index < currentEpoch.toNumber();
        index++
      ) {
        const userRewardsForEpoch = await contract.getUserRewardsForEpoch(
          index
        );

        _total.add(userRewardsForEpoch);
      }

      return _total;
    };

    return getTotalRewards();
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
