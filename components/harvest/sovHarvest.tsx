import useWrappingRewards from "@/hooks/contracts/useWrappingRewards";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import { useEpochStartWrappingRewards } from "@/hooks/view/useEpochStart";
import { useUserRewardsWrappingRewards } from "@/hooks/view/useUserRewards";
import getTimeUntilNextEpoch from "@/utils/getTimeUntilNextEpoch";
import type { TransactionResponse } from "@ethersproject/providers";
import classNames from "classnames";

export default function SOVHarvest() {
  const account = useWeb3Store((state) => state.account);

  const { data: epochStart } = useEpochStartWrappingRewards();

  const { data: userRewards } = useUserRewardsWrappingRewards(account);

  const fmUserRewards = useFormattedBigNumber(userRewards);

  const wrappingRewards = useWrappingRewards();

  async function harvestSOV() {
    try {
      const tx: TransactionResponse = await wrappingRewards.massHarvest();

      await tx.wait();
    } catch (error) {}
  }

  return (
    <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
      <form onSubmit={harvestSOV} className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">Harvest SOV</h2>
        </div>

        <p>Next epoch in {getTimeUntilNextEpoch(epochStart)}</p>

        <h2 className="font-medium leading-5">Available Rewards</h2>

        <p className="text-2xl leading-none font-semibold">
          {`${fmUserRewards} SOV` ?? "Error Fetching Rewards"}
        </p>

        <div className="h-px w-full bg-primary-300" />

        <div className="space-y-2">
          <button
            type="submit"
            className={classNames(
              "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
              !userRewards?.isZero()
                ? "bg-white text-primary"
                : "bg-primary-300"
            )}
            disabled={userRewards?.isZero()}
          >
            Harvest Rewards
          </button>
        </div>
      </form>
    </div>
  );
}
