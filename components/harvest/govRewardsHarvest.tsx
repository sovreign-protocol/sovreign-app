import useGovRewards from "@/hooks/contracts/useGovRewards";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import useUserRewardsGovRewards, {
  useUserRewardsGovRewardsForCurrentEpoch,
} from "@/hooks/view/useUserRewardsGovRewards";
import type { TransactionResponse } from "@ethersproject/providers";
import classNames from "classnames";
import { FormEvent } from "react";

export default function GovRewardsHarvest() {
  const account = useWeb3Store((state) => state.account);

  const { data: userRewards, mutate: userRewardsMutate } =
    useUserRewardsGovRewards(account);

  const {
    data: userRewardsForCurrentEpoch,
    mutate: userRewardsForCurrentEpochMutate,
  } = useUserRewardsGovRewardsForCurrentEpoch(account);

  const fmUserRewards = useFormattedBigNumber(userRewards);

  const govRewards = useGovRewards();

  async function harvestREIGN(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const tx: TransactionResponse = await govRewards.massHarvest();

      await tx.wait();

      userRewardsMutate();
      userRewardsForCurrentEpochMutate();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
      <form className="space-y-4" onSubmit={harvestREIGN}>
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">Governance Rewards</h2>
        </div>

        <div className="flex justify-between items-end">
          <p className="leading-none">Potential Earnings</p>

          <p className="text-2xl leading-none font-semibold">
            {`${fmUserRewards} REIGN`}
          </p>
        </div>

        <div className="h-px w-full bg-primary-300" />

        <div className="space-y-2">
          <button
            type="submit"
            className={classNames(
              "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
              userRewardsForCurrentEpoch &&
                !userRewardsForCurrentEpoch?.isZero()
                ? "bg-white text-primary"
                : "bg-primary-300"
            )}
            disabled={
              !userRewardsForCurrentEpoch ||
              userRewardsForCurrentEpoch?.isZero()
            }
          >
            Harvest Rewards
          </button>
        </div>
      </form>
    </div>
  );
}