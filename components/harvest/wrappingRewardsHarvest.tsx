import useWrappingRewards from "@/hooks/contracts/useWrappingRewards";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import { useEpochDatesWrappingRewards } from "@/hooks/view/useEpochDates";
import useUserRewardsWrappingRewards, {
  useUserRewardsWrappingRewardsForCurrentEpoch,
} from "@/hooks/view/useUserRewardsWrappingRewards";
import type { TransactionResponse } from "@ethersproject/providers";
import classNames from "classnames";
import { FormEvent } from "react";

export default function WrappingRewardsHarvest() {
  const account = useWeb3Store((state) => state.account);

  const { data: epochDates } = useEpochDatesWrappingRewards();

  const { data: userRewards, mutate: userRewardsMutate } =
    useUserRewardsWrappingRewards(account);

  const {
    data: userRewardsForCurrentEpoch,
    mutate: userRewardsForCurrentEpochMutate,
  } = useUserRewardsWrappingRewardsForCurrentEpoch(account);

  const fmUserRewards = useFormattedBigNumber(userRewards);

  const wrappingRewards = useWrappingRewards();

  async function harvestSOV(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const tx: TransactionResponse = await wrappingRewards.massHarvest();

      await tx.wait();

      userRewardsMutate();
      userRewardsForCurrentEpochMutate();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
      <form onSubmit={harvestSOV} className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">Wrapping Rewards In REIGN</h2>
        </div>

        <div>
          <p className="font-medium leading-5 mb-4">Time until next epoch</p>

          <p className="text-2xl leading-none font-semibold mb-4">
            {epochDates?.relative}
          </p>

          <div
            aria-label={`${epochDates?.relative} until next epoch`}
            aria-valuenow={parseFloat(epochDates?.progress.toFixed(2))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${epochDates?.progress.toFixed(2)}%`}
            role="progressbar"
            className="w-full"
          >
            <div className="h-3 bg-primary rounded overflow-hidden">
              <div
                className="h-3 bg-green-500"
                style={{ width: `${epochDates?.progress.toFixed(2)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <p className="leading-none">Potential Rewards</p>

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
