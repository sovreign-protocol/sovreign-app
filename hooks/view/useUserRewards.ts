import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useWrappingRewards from "../contracts/useWrappingRewards";

const getUserRewards =
  (contract: Contract) => async (_: string, address: string) => {
    const epoch: BigNumber = await contract.getCurrentEpoch();

    const epochStake: BigNumber = await contract.getEpochStake(address, epoch);

    const poolSize: BigNumber = await contract.getPoolSize(epoch);

    const getRewardsForEpoch: BigNumber = await contract.getRewardsForEpoch();

    return getRewardsForEpoch.mul(epochStake.div(poolSize));
  };

export default function useUserRewards(address: string) {
  const contract = useWrappingRewards();

  const shouldFetch = !!contract && typeof address === "string";

  return useSWR(
    shouldFetch ? ["UserRewards", address] : null,
    getUserRewards(contract)
  );
}
