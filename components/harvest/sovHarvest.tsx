import useWeb3Store from "@/hooks/useWeb3Store";
import { useEpochStartWrappingRewards } from "@/hooks/view/useEpochStart";
import { useUserRewardsWrappingRewards } from "@/hooks/view/useUserRewards";
import getTimeUntilNextEpoch from "@/utils/getTimeUntilNextEpoch";

export default function SOVHarvest() {
  const account = useWeb3Store((state) => state.account);

  const { data: epochStart } = useEpochStartWrappingRewards();

  const { data: userRewards } = useUserRewardsWrappingRewards(account);

  return (
    <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">Harvest SOV</h2>
        </div>

        <p>Next epoch in {getTimeUntilNextEpoch(epochStart)}</p>

        <p>{userRewards?.toString() ?? "Error Fetching Rewards"}</p>
      </div>
    </div>
  );
}
