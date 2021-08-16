import useWrappingRewards from "@/hooks/contracts/useWrappingRewards";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import useIsBoosted from "@/hooks/view/useIsBoosted";
import useUserRewards from "@/hooks/view/useUserRewards";
import useWrappingRewardsAPY from "@/hooks/useWrappingRewardsAPY";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
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

  const { data: rewards, mutate } = useUserRewards(
    account,
    wrappingRewards?.address
  );

  const formattedRewards = useFormattedBigNumber(rewards);

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
      rewards={rewards}
      slot={
        typeof isBoosted === "boolean" &&
        (true ? (
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
