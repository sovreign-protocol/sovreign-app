import { CONTRACT_ADDRESSES, MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import useReignFacet from "@/hooks/contracts/useReignFacet";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useReignStaked from "@/hooks/view/useReignStaked";
import { useTokenAllowanceForReignFacet } from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import classNames from "classnames";
import type { FormEvent } from "react";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { TransactionToast } from "../customToast";

export default function DepositStake() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const reignFacet = useReignFacet();

  const { data: reignBalance, mutate: reignBalanceMutate } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.REIGN[chainId]
  );

  const { mutate: reignStakedMutate } = useReignStaked();

  const formattedReignBalance = useFormattedBigNumber(reignBalance);

  const depositInput = useInput();

  async function depositReign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse = await reignFacet.deposit(
        parseUnits(depositInput.value)
      );

      toast.loading(
        <TransactionToast
          hash={transaction.hash}
          chainId={chainId}
          message={`Deposit ${depositInput.value} REIGN`}
        />,
        { id: _id }
      );

      await transaction.wait();

      toast.success(
        <TransactionToast
          hash={transaction.hash}
          chainId={chainId}
          message={`Deposit ${depositInput.value} REIGN`}
        />,
        { id: _id }
      );

      reignStakedMutate();
      reignBalanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  const reignContract = useERC20(TOKEN_ADDRESSES.REIGN[chainId]);

  const { data: reignAllowance, mutate: reignAllowanceMutate } =
    useTokenAllowanceForReignFacet(TOKEN_ADDRESSES.REIGN[chainId], account);

  async function approveReign() {
    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse = await reignContract.approve(
        CONTRACT_ADDRESSES.ReignFacet[chainId],
        MaxUint256
      );

      toast.loading(`Approve REIGN`, { id: _id });

      await transaction.wait();

      toast.success(`Approve REIGN`, { id: _id });

      reignAllowanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  const reignNeedsApproval = useMemo(() => {
    if (!!reignAllowance && depositInput.hasValue) {
      return reignAllowance.lt(parseUnits(depositInput.value));
    }

    return;
  }, [reignAllowance, depositInput.hasValue, depositInput.value]);

  return (
    <form onSubmit={depositReign} method="POST" className="space-y-4">
      <div className="flex justify-between">
        <h2 className="font-medium leading-5">Deposit Stake</h2>
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
            {formattedReignBalance ? (
              <span>{`Balance: ${formattedReignBalance} REIGN`}</span>
            ) : null}
          </p>
        </div>

        <div className="flex-1">
          <label className="sr-only" htmlFor="stake-deposit">
            Enter amount of REIGN to deposit
          </label>

          <input
            autoComplete="off"
            autoCorrect="off"
            className="w-full appearance-none bg-transparent text-right text-2xl font-normal h-10 focus:outline-none font-mono hide-number-input-arrows"
            inputMode="decimal"
            maxLength={79}
            minLength={1}
            id="stake-deposit"
            name="stake-deposit"
            required
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            spellCheck="false"
            type="number"
            step={0.0001}
            {...depositInput.eventBind}
          />
        </div>
      </div>

      <div className="space-y-4">
        {reignNeedsApproval && (
          <button
            className="p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4 bg-white text-primary"
            onClick={approveReign}
          >
            Approve Sovreign To Spend Your REIGN
          </button>
        )}

        <button
          className={classNames(
            "p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4",
            depositInput.hasValue && !reignNeedsApproval
              ? "bg-white text-primary"
              : "bg-primary-300"
          )}
          disabled={!depositInput.hasValue || reignNeedsApproval}
          type="submit"
        >
          {depositInput.hasValue ? "Deposit" : "Enter an amount"}
        </button>
      </div>
    </form>
  );
}