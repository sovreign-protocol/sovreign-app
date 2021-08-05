import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import useGovRewards from "../contracts/useGovRewards";
import useWrappingRewards from "../contracts/useWrappingRewards";

const getUserRewards =
  (contract: Contract) => async (_: string, userAddress: string) => {
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

        console.log("epochStake", formatUnits(epochStake));

        const poolSize: BigNumber = await contract.getPoolSize(epochToCheck);

        console.log("poolSize", formatUnits(poolSize));

        console.log("getRewardsForEpoch", formatUnits(getRewardsForEpoch));

        return getRewardsForEpoch.mul(epochStake).div(poolSize);
      })
    );

    return epochRewardsArray.reduce((prev, cur) => prev.add(cur));
  };

export function useUserRewardsGovRewards(userAddress: string) {
  const contract = useGovRewards();

  const shouldFetch = !!contract && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["UserRewardsGovRewards", userAddress] : null,
    getUserRewards(contract)
  );
}

export function useUserRewardsWrappingRewards(userAddress: string) {
  const contract = useWrappingRewards();

  const shouldFetch = !!contract && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["UserRewardsWrappingRewards", userAddress] : null,
    getUserRewards(contract)
  );
}
