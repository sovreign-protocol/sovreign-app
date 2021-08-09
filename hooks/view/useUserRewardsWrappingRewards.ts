import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useWrappingRewards from "../contracts/useWrappingRewards";

function getUserRewardsWrappingRewards(contract: Contract) {
  return async (_: string, userAddress: string) => {
    const lastEpochHarvested: BigNumber =
      await contract.userLastEpochIdHarvested();

    const epoch: BigNumber = await contract.getCurrentEpoch();

    const epochsToHarvest = epoch.sub(lastEpochHarvested).toNumber();

    const getRewardsForEpoch: BigNumber = await contract.getRewardsForEpoch();

    const epochRewardsArray = await Promise.all(
      [...new Array(epochsToHarvest)].map(async (_, index) => {
        const epochToCheck = index + 1;

        const epochStake: BigNumber = await contract.getEpochStake(
          userAddress,
          epochToCheck
        );

        const poolSize: BigNumber = await contract.getPoolSize(epochToCheck);

        return getRewardsForEpoch.mul(epochStake).div(poolSize);
      })
    );

    return epochRewardsArray.reduce((prev, cur) => prev.add(cur));
  };
}

export default function useUserRewardsWrappingRewards(userAddress: string) {
  const contract = useWrappingRewards();

  const shouldFetch = !!contract && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["UserRewardsWrappingRewards", userAddress] : null,
    getUserRewardsWrappingRewards(contract)
  );
}

function getUserRewardsForWrappingRewardsCurrentEpoch(contract: Contract) {
  return async (_: string, userAddress: string) => {
    const lastEpochHarvested: BigNumber =
      await contract.userLastEpochIdHarvested();

    const currentEpoch: BigNumber = await contract.getCurrentEpoch();

    if (lastEpochHarvested.eq(currentEpoch)) {
      return BigNumber.from(0);
    }

    const epochToCheck = currentEpoch.toNumber() - 1;

    if (epochToCheck === 0) {
      return BigNumber.from(0);
    }

    if (lastEpochHarvested.toNumber() === epochToCheck) {
      return BigNumber.from(0);
    }

    const getRewardsForEpoch: BigNumber = await contract.getRewardsForEpoch();

    const epochStake: BigNumber = await contract.getEpochStake(
      userAddress,
      epochToCheck
    );

    const poolSize: BigNumber = await contract.getPoolSize(epochToCheck);

    return getRewardsForEpoch.mul(epochStake).div(poolSize);
  };
}

export function useUserRewardsWrappingRewardsForCurrentEpoch(
  userAddress: string
) {
  const contract = useWrappingRewards();

  const shouldFetch = !!contract && typeof userAddress === "string";

  return useSWR(
    shouldFetch
      ? ["UserRewardsWrappingRewardsForCurrentEpoch", userAddress]
      : null,
    getUserRewardsForWrappingRewardsCurrentEpoch(contract)
  );
}
