import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useWrappingRewards from "../contracts/useWrappingRewards";

const getUserRewards =
  (contract: Contract) => async (_: string, address: string) => {
    const lastEpochHarvested: BigNumber =
      await contract.userLastEpochIdHarvested();

    const epoch: BigNumber = await contract.getCurrentEpoch();

    const epochsToHarvest = epoch.sub(lastEpochHarvested).toNumber();

    const getRewardsForEpoch: BigNumber = await contract.getRewardsForEpoch();

    const epochRewardsArray = await Promise.all(
      [...new Array(epochsToHarvest)].map(async (_, index) => {
        const epochToCheck = index + 1;

        const epochStake: BigNumber = await contract.getEpochStake(
          address,
          epochToCheck
        );

        const poolSize: BigNumber = await contract.getPoolSize(epochToCheck);

        return getRewardsForEpoch.mul(epochStake).div(poolSize);
      })
    );

    return epochRewardsArray.reduce((prev, cur) => prev.add(cur));
  };

export default function useUserRewards(address: string) {
  const contract = useWrappingRewards();

  const shouldFetch = !!contract && typeof address === "string";

  return useSWR(
    shouldFetch ? ["UserRewards", address] : null,
    getUserRewards(contract)
  );
}