import useWeb3Store from "@/hooks/useWeb3Store";
import { useEpochStartGovRewards } from "@/hooks/view/useEpochStart";
import { useUserRewardsGovRewards } from "@/hooks/view/useUserRewards";
import getTimeUntilNextEpoch from "@/utils/getTimeUntilNextEpoch";

export default function REIGNHarvest() {
  const account = useWeb3Store((state) => state.account);

  const { data: epochStart } = useEpochStartGovRewards();

  const { data: userRewards } = useUserRewardsGovRewards(account);

  return (
    <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">Harvest REIGN</h2>
        </div>

        <p>Next epoch in {getTimeUntilNextEpoch(epochStart)}</p>

        <p>{userRewards?.toString() ?? "Error Fetching Rewards"}</p>
      </div>
    </div>
  );
}
