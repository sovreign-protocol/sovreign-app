import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useLPRewards from "../contracts/useLPRewards";

function getUserRewardsLPRewards(contract: Contract) {
  return async () => {
    const lastEpochIdHarvested: BigNumber =
      await contract.userLastEpochIdHarvested();

    console.log("lastEpochIdHarvested", lastEpochIdHarvested.toNumber());

    const currentEpoch: BigNumber = await contract.getCurrentEpoch();

    console.log("currentEpoch", currentEpoch.toNumber());

    const getTotalRewards = async () => {
      let _total = BigNumber.from(0);

      for (
        let index = lastEpochIdHarvested.toNumber();
        index < currentEpoch.toNumber();
        index++
      ) {
        const userRewardsForEpoch: BigNumber =
          await contract.getUserRewardsForEpoch(index);

        console.log(
          "userRewardsForEpoch:",
          index,
          "(",
          userRewardsForEpoch.toNumber(),
          ")"
        );

        _total.add(userRewardsForEpoch);
      }

      return _total;
    };

    return getTotalRewards();
  };
}

export default function useUserRewardsLPRewards(
  userAddress: string,
  contractAddress: string
) {
  const contract = useLPRewards(contractAddress);

  const shouldFetch = !!contract && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["UserRewardsLPRewards", userAddress, contractAddress] : null,
    getUserRewardsLPRewards(contract)
  );
}
