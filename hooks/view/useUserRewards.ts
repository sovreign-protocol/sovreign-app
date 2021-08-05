import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import useGovRewards from "../contracts/useGovRewards";
import useWrappingRewards from "../contracts/useWrappingRewards";

function getUserRewardsGovRewards(contract: Contract) {
  return async (_: string, userAddress: string) => {
    const lastEpochHarvested: BigNumber =
      await contract.userLastEpochIdHarvested();

    const epoch: BigNumber = await contract.getCurrentEpoch();

    const epochsToHarvest = epoch.sub(lastEpochHarvested).toNumber();

    const getRewardsForEpoch: BigNumber = await contract.getRewardsForEpoch();

    const epochStart: BigNumber = await contract.epochStart();

    const epochRewardsArray = await Promise.all(
      [...new Array(epochsToHarvest)].map(async (_, index) => {
        const epochToCheck = index + 1;

        const epochStake: BigNumber = await contract.getEpochStake(
          userAddress,
          epochToCheck
        );

        const epochTimestamp = epochStart.toNumber() + 604800 * epochToCheck;

        const poolSize: BigNumber = await contract.getPoolSize(epochTimestamp);

        return getRewardsForEpoch.mul(epochStake).div(poolSize);
      })
    );

    return epochRewardsArray.reduce((prev, cur) => prev.add(cur));
  };
}

export function useUserRewardsGovRewards(userAddress: string) {
  const contract = useGovRewards();

  const shouldFetch = !!contract && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["UserRewardsGovRewards", userAddress] : null,
    getUserRewardsGovRewards(contract)
  );
}

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

export function useUserRewardsWrappingRewards(userAddress: string) {
  const contract = useWrappingRewards();

  const shouldFetch = !!contract && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["UserRewardsWrappingRewards", userAddress] : null,
    getUserRewardsWrappingRewards(contract)
  );
}
