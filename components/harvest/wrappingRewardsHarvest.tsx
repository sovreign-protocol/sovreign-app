import useWrappingRewards from "@/hooks/contracts/useWrappingRewards";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import useIsBoosted from "@/hooks/view/useIsBoosted";
import useUserRewardsLPRewards from "@/hooks/view/useUserRewardsLPRewards";
import useWrappingRewardsAPY from "@/hooks/view/useWrappingRewardsAPY";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import Link from "next/link";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import Button from "../button";
import { TransactionToast } from "../customToast";

export default function WrappingRewardsHarvest() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const wrappingRewards = useWrappingRewards();
  const { data: apy } = useWrappingRewardsAPY();

  const { data: isBoosted } = useIsBoosted(account);

  const { data, mutate } = useUserRewardsLPRewards(
    account,
    wrappingRewards?.address
  );

  const fmRewards = useFormattedBigNumber(data);

  async function harvestWrappingRewards(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse =
        await wrappingRewards.massHarvest();

      toast.loading(
        <TransactionToast
          message={`Harvest ${fmRewards} REIGN`}
          chainId={chainId}
          hash={transaction.hash}
        />,
        { id: _id }
      );

      await transaction.wait();

      toast.success(
        <TransactionToast
          message={`Harvest ${fmRewards} REIGN`}
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
    <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
      <form onSubmit={harvestWrappingRewards} className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">Deposit Rewards</h2>

          {typeof isBoosted === "boolean" &&
            (true ? (
              <p className="font-medium leading-5 text-gray-300">{`+3%`}</p>
            ) : (
              <Link href="/rebalance">
                <a className="font-medium leading-5 text-indigo-500 hover:underline">
                  {`Get +3% For Voting`}
                </a>
              </Link>
            ))}
        </div>

        <div className="flex justify-between items-end">
          <p className="leading-none">APY</p>

          <p className="leading-none">{`${apy?.toFixed(2) ?? 0}%`}</p>
        </div>

        <div className="flex justify-between items-end">
          <p className="leading-none">Potential Earnings</p>

          <p className="text-2xl leading-none font-semibold">
            {`${fmRewards} REIGN`}
          </p>
        </div>

        <div className="h-px w-full bg-primary-300" />

        <div className="space-y-2">
          <Button type="submit" disabled={!data || data?.isZero()}>
            {data && !data?.isZero()
              ? "Harvest Rewards"
              : "Rewards claimable next epoch"}
          </Button>
        </div>
      </form>
    </div>
  );
}
