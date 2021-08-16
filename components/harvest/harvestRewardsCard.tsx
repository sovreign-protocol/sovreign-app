import type { BigNumber } from "@ethersproject/bignumber";
import type { FormEvent } from "react";
import Button from "../button";

type HarvestRewardsCardProps = {
  apy: number;
  formattedExpectedRewards?: string;
  formattedRewards: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  rewards: BigNumber;
  slot?: any;
  title: string;
};

export default function HarvestRewardsCard({
  apy,
  formattedExpectedRewards,
  formattedRewards,
  onSubmit,
  rewards,
  slot,
  title,
}: HarvestRewardsCardProps) {
  return (
    <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">{title}</h2>

          {slot ?? null}
        </div>

        <div className="flex justify-between items-end">
          <p className="leading-none">APY</p>

          <p className="leading-none">{`${apy ? apy.toFixed(2) : 0}%`}</p>
        </div>

        {formattedExpectedRewards && (
          <div className="flex justify-between items-end">
            <p className="leading-none">Expected Earnings</p>

            <p className="leading-none">
              {`${formattedExpectedRewards} REIGN`}
            </p>
          </div>
        )}

        <div className="flex justify-between items-end">
          <p className="leading-none">Harvestable Earnings</p>

          <p className="text-2xl leading-none font-semibold">
            {`${formattedRewards} REIGN`}
          </p>
        </div>

        <div className="h-px w-full bg-primary-300" />

        <div className="space-y-2">
          <Button type="submit" disabled={!rewards || rewards?.isZero()}>
            {!!rewards && !rewards?.isZero()
              ? "Harvest Rewards"
              : "Rewards claimable next epoch"}
          </Button>
        </div>
      </form>
    </div>
  );
}
