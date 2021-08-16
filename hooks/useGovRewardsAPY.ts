import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import useGovRewards from "./contracts/useGovRewards";

function getGovRewardsAPY(contract: Contract) {
  return async () => {
    const totalStake: BigNumber = await contract.getPoolSizeAtTs(Date.now());

    const rewardsForEpoch: BigNumber = await contract.getRewardsForEpoch();

    const totalRewards = rewardsForEpoch.mul(52);

    const apy =
      (parseFloat(formatUnits(totalStake)) /
        parseFloat(formatUnits(totalRewards))) *
      100;

    return apy;
  };
}

export default function useGovRewardsAPY() {
  const contract = useGovRewards();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["GovRewardsAPY"] : null,
    getGovRewardsAPY(contract)
  );
}
