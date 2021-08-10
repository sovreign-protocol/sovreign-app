import { TOKEN_ADDRESSES } from "@/constants";
import useReignFacet from "@/hooks/contracts/useReignFacet";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useReignStaked from "@/hooks/view/useReignStaked";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { TransactionToast } from "../customToast";

dayjs.extend(relativeTime);

export default function WithdrawStake() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const { data: reignBalance, mutate: reignBalanceMutate } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.REIGN[chainId]
  );

  const { data: reignStaked, mutate: reignStakedMutate } = useReignStaked();

  const reignFacet = useReignFacet();

  const withdrawInput = useInput();

  async function withdrawReign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      const amountToWithdraw = parseUnits(withdrawInput.value);

      const transaction: TransactionResponse = await reignFacet.withdraw(
        amountToWithdraw
      );

      toast.loading(
        <TransactionToast
          hash={transaction.hash}
          chainId={chainId}
          message={`Withdraw ${withdrawInput.value} REIGN`}
        />,
        { id: _id }
      );

      await transaction.wait();

      toast.success(
        <TransactionToast
          hash={transaction.hash}
          chainId={chainId}
          message={`Withdraw ${withdrawInput.value} REIGN`}
        />,
        { id: _id }
      );

      reignStakedMutate();
      reignBalanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  const formattedReignBalance = useFormattedBigNumber(reignBalance);

  const formattedReignStaked = useFormattedBigNumber(reignStaked);

  return (
    <form method="POST" onSubmit={withdrawReign} className="space-y-4">
      <div className="flex justify-between">
        <h2 className="font-medium leading-5">Withdraw Stake</h2>
      </div>

      <div className="flex space-x-4">
        <div>
          <div className="mb-2">
            <div
              className={classNames(
                "relative inline-flex py-2 pl-2 pr-3 text-left rounded-xl cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 items-center space-x-2 bg-primary"
              )}
            >
              <img
                alt={"REIGN"}
                className="rounded-full"
                height={24}
                src={`/tokens/REIGN.png`}
                width={24}
              />

              <span className="block truncate font-medium">{"REIGN"}</span>
            </div>
          </div>

          <p className="text-sm text-gray-300 h-5">
            {formattedReignStaked ? (
              <span>{`Staked: ${formattedReignStaked} REIGN`}</span>
            ) : null}
          </p>
        </div>

        <div className="flex-1">
          <label className="sr-only" htmlFor="stake-withdraw">
            Enter amount of REIGN to withdraw
          </label>

          <input
            autoComplete="off"
            autoCorrect="off"
            className="w-full appearance-none bg-transparent text-right text-2xl font-normal h-10 focus:outline-none font-mono hide-number-input-arrows"
            inputMode="decimal"
            maxLength={79}
            minLength={1}
            id="stake-withdraw"
            name="stake-withdraw"
            required
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            spellCheck="false"
            type="number"
            step={0.0001}
            {...withdrawInput.eventBind}
          />
        </div>
      </div>

      <div className="space-y-4">
        <button
          className={classNames(
            "p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4",
            withdrawInput.hasValue ? "bg-white text-primary" : "bg-primary-300"
          )}
          disabled={!withdrawInput.hasValue}
          type="submit"
        >
          {withdrawInput.hasValue ? "Withdraw" : "Enter an amount"}
        </button>
      </div>
    </form>
  );
}
