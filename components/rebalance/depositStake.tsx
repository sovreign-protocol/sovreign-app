import { CONTRACT_ADDRESSES, MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import useReignFacet from "@/hooks/contracts/useReignFacet";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useReignStaked from "@/hooks/view/useReignStaked";
import { useTokenAllowanceForReignFacet } from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import classNames from "classnames";
import { useMemo } from "react";

export default function DepositStake() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const reignFacet = useReignFacet();

  const { data: reignBalance, mutate: reignBalanceMutate } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.REIGN[chainId]
  );

  const { data: reignStaked, mutate: reignStakedMutate } = useReignStaked();

  const formattedReignBalance = useFormattedBigNumber(reignBalance);

  const formattedReignStaked = useFormattedBigNumber(reignStaked);

  const depositInput = useInput();

  async function depositReign() {
    try {
      const tx: TransactionResponse = await reignFacet.deposit(
        parseUnits(depositInput.value)
      );

      await tx.wait();

      reignStakedMutate();

      reignBalanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  const reignContract = useERC20(TOKEN_ADDRESSES.REIGN[chainId]);

  const { data: reignAllowance, mutate: reignAllowanceMutate } =
    useTokenAllowanceForReignFacet(TOKEN_ADDRESSES.REIGN[chainId], account);

  async function approveReign() {
    try {
      const tx: TransactionResponse = await reignContract.approve(
        CONTRACT_ADDRESSES.ReignFacet[chainId],
        MaxUint256
      );

      await tx.wait();

      reignAllowanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  const reignNeedsApproval = useMemo(() => {
    if (!!reignAllowance && depositInput.hasValue) {
      return reignAllowance.lt(parseUnits(depositInput.value));
    }

    return;
  }, [reignAllowance, depositInput.hasValue, depositInput.value]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div>
          <div className="mb-2">
            <div
              className={classNames(
                "relative inline-flex py-2 pl-2 pr-3 text-left rounded-xl cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 items-center space-x-2 bg-primary"
              )}
            >
              <div className="h-6 w-6 rounded-full bg-white" />

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
            className="w-full appearance-none bg-transparent text-right text-2xl font-normal h-10 focus:outline-none font-mono"
            inputMode="decimal"
            maxLength={79}
            minLength={1}
            id="stake-deposit"
            name="stake-deposit"
            required
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            spellCheck="false"
            type="text"
            {...depositInput.eventBind}
          />
        </div>
      </div>

      <div className="space-y-2">
        {reignNeedsApproval && (
          <button
            className={classNames(
              "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
              "bg-white text-primary"
            )}
            onClick={approveReign}
          >
            Approve Sovreign To Spend Your REIGN
          </button>
        )}

        <button
          className={classNames(
            "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
            depositInput.hasValue && !reignNeedsApproval
              ? "bg-white text-primary"
              : "bg-primary-300"
          )}
          disabled={!depositInput.hasValue || reignNeedsApproval}
          onClick={depositReign}
        >
          {depositInput.hasValue ? "Deposit" : "Enter an amount"}
        </button>
      </div>
    </div>
  );
}
