import LPRewards from "@/contracts/LPRewards.json";
import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useContract from "../useContract";

function getHarvestableUserRewards(contract: Contract) {
  return async () => {
    const lastEpochIdHarvested: BigNumber =
      await contract.userLastEpochIdHarvested();

    const currentEpoch: BigNumber = await contract.getCurrentEpoch();

    const getTotalRewards = async () => {
      let _total = BigNumber.from(0);

      for (
        let index = lastEpochIdHarvested.toNumber();
        index < currentEpoch.toNumber();
        index++
      ) {
        const userRewardsForEpoch: BigNumber =
          await contract.getUserRewardsForEpoch(index);

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
  const contract = useContract(contractAddress, LPRewards);

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
