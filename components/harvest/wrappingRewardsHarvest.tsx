import { useWrappingRewards } from "@/hooks/useContract";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import useWrappingRewardsAPY from "@/hooks/useWrappingRewardsAPY";
import useHarvestableUserRewards from "@/hooks/view/useHarvestableUserRewards";
import useIsBoosted from "@/hooks/view/useIsBoosted";
import useWrappingRewardsExpectedRewards from "@/hooks/wrappingRewards";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import { commify } from "@ethersproject/units";
import Link from "next/link";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { TransactionToast } from "../customToast";
import HarvestRewardsCard from "./harvestRewardsCard";

export default function WrappingRewardsHarvest() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const wrappingRewards = useWrappingRewards();

  const { data: apy } = useWrappingRewardsAPY();

  const { data: isBoosted } = useIsBoosted(account);

  const { data: rewards, mutate } = useHarvestableUserRewards(
    account,
    wrappingRewards?.address
  );

  const { data: expectedRewards } = useWrappingRewardsExpectedRewards(account);

  const formattedRewards = useFormattedBigNumber(rewards);

  const formattedExpectedRewards = expectedRewards
    ? commify(Number(expectedRewards).toFixed(2))
    : Number(0).toFixed(2);

  async function harvestWrappingRewards(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse =
        await wrappingRewards.massHarvest();

      toast.loading(
        <TransactionToast
          message={`Harvest ${formattedRewards} REIGN`}
          chainId={chainId}
          hash={transaction.hash}
        />,
        { id: _id }
      );

      await transaction.wait();

      toast.success(
        <TransactionToast
          message={`Harvest ${formattedRewards} REIGN`}
          chainId={chainId}
          hash={transaction.hash}
        />,
        { id: _id }
      );

      mutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  return (
    <HarvestRewardsCard
      apy={apy}
      formattedRewards={formattedRewards}
      onSubmit={harvestWrappingRewards}
      formattedExpectedRewards={formattedExpectedRewards}
      rewards={rewards}
      slot={
        typeof isBoosted === "boolean" &&
        (isBoosted ? (
          <p className="font-semibold leading-5 text-indigo-500">{`+3%`}</p>
        ) : (
          <Link href="/rebalance">
            <a className="font-semibold leading-5 text-indigo-500 hover:underline">
              {`Get +3% For Voting`}
            </a>
          </Link>
        ))
      }
      title="Deposit Rewards"
    />
  );
}
