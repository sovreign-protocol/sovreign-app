import useLPRewards from "@/hooks/contracts/useLPRewards";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import useUserRewardsLPRewards from "@/hooks/view/useUserRewardsLPRewards";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import classNames from "classnames";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { TransactionToast } from "../customToast";

type Props = {
  title: string;
  contractAddress: string;
};

export default function LPRewardsHarvest({ contractAddress, title }: Props) {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const lpRewards = useLPRewards(contractAddress);

  const { data, mutate } = useUserRewardsLPRewards(account, contractAddress);

  const fmRewards = useFormattedBigNumber(data);

  async function harvest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse = await lpRewards.massHarvest();

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
      <form className="space-y-4" onSubmit={harvest}>
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">{title}</h2>
        </div>

        <div className="flex justify-between items-end">
          <p className="leading-none">Potential Earnings</p>

          <p className="text-2xl leading-none font-semibold">
            {`${fmRewards} REIGN`}
          </p>
        </div>

        <div className="h-px w-full bg-primary-300" />

        <div className="space-y-2">
          <button
            type="submit"
            className={classNames(
              "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
              data && !data?.isZero()
                ? "bg-white text-primary"
                : "bg-primary-300"
            )}
            disabled={!data || data?.isZero()}
          >
            {data && !data?.isZero()
              ? "Harvest Rewards"
              : "Rewards claimable next Epoch"}
          </button>
        </div>
      </form>
    </div>
  );
}
