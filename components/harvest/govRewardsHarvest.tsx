import useGovRewards from "@/hooks/contracts/useGovRewards";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import useGovRewardsAPY from "@/hooks/view/useGovRewardsAPY";
import useUserRewardsLPRewards from "@/hooks/view/useUserRewardsLPRewards";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import Button from "../button";
import { TransactionToast } from "../customToast";

export default function GovRewardsHarvest() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const govRewards = useGovRewards();
  const { data: apy } = useGovRewardsAPY();

  const { data, mutate } = useUserRewardsLPRewards(
    account,
    govRewards?.address
  );

  const fmRewards = useFormattedBigNumber(data);

  async function harvestGovRewards(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse = await govRewards.massHarvest();

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
      <form className="space-y-4" onSubmit={harvestGovRewards}>
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">Governance Rewards</h2>
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
