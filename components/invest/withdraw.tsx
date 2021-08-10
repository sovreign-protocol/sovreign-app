import { CONTRACT_ADDRESSES, MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import usePoolRouter from "@/hooks/contracts/usePoolRouter";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import { useTokenAllowanceForPoolRouter } from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import type { BigNumber } from "@ethersproject/bignumber";
import type { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import classNames from "classnames";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import TokenSelect, { Token } from "../tokenSelect";

export default function Withdraw() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const poolRouter = usePoolRouter();

  const { data: poolTokens } = useGetPoolTokens();

  const sovContract = useERC20(TOKEN_ADDRESSES.SOV[chainId]);

  const { data: sovBalance, mutate: sovBalanceMutate } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.SOV[chainId]
  );
  const { data: sovAllowance, mutate: sovAllowanceMutate } =
    useTokenAllowanceForPoolRouter(TOKEN_ADDRESSES.SOV[chainId], account);

  const [withdrawToken, withdrawTokenSet] = useState<Token>();

  const withdrawAmountInput = useInput();

  const sovNeedsApproval = useMemo(() => {
    if (!!sovAllowance && withdrawAmountInput.hasValue) {
      return sovAllowance.lt(parseUnits(withdrawAmountInput.value));
    }

    return;
  }, [sovAllowance, withdrawAmountInput.hasValue, withdrawAmountInput.value]);

  async function tokenWithdraw(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    const values = event.target as typeof event.target & {
      "withdraw-amount": { value: string };
    };

    try {
      const minAmountOut = parseUnits(values["withdraw-amount"].value);

      const poolAmountIn: BigNumber = await poolRouter.getSovAmountInSingle(
        withdrawToken.address,
        minAmountOut,
        MaxUint256
      );

      if (poolAmountIn.gt(sovBalance)) {
        throw new Error("You Don't Have Enough SOV To Make This Withdrawal");
      }

      const transaction: TransactionResponse = await poolRouter.withdraw(
        withdrawToken.address,
        poolAmountIn,
        /**
         * Account for 1% slippage
         */
        minAmountOut.mul(99).div(100)
      );

      toast.loading(
        `Withdraw ${values["withdraw-amount"].value} ${withdrawToken.symbol}`,
        { id: _id }
      );

      await transaction.wait();

      toast.success(
        `Withdraw ${values["withdraw-amount"].value} ${withdrawToken.symbol}`,
        { id: _id }
      );

      sovBalanceMutate();
    } catch (error) {
      console.error(error);

      if (error?.code === 4001) {
        toast.dismiss(_id);

        return;
      }

      toast.error(error.message, { id: _id });
    }
  }

  async function approveSOV() {
    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse = await sovContract.approve(
        CONTRACT_ADDRESSES.PoolRouter[chainId],
        MaxUint256
      );

      toast.loading(`Approve SOV`, { id: _id });

      await transaction.wait();

      toast.success(`Approve SOV`, { id: _id });

      sovAllowanceMutate();
    } catch (error) {
      console.error(error);

      if (error?.code === 4001) {
        toast.dismiss(_id);

        return;
      }

      toast.error(error.message, { id: _id });
    }
  }

  return (
    <form className="space-y-4" onSubmit={tokenWithdraw}>
      <div className="flex justify-between">
        <h2 className="font-medium leading-5">Withdraw</h2>
      </div>

      <div className="flex space-x-4">
        <div>
          <div className="mb-2">
            <TokenSelect
              value={withdrawToken}
              onChange={withdrawTokenSet}
              tokens={poolTokens}
            />
          </div>

          <div className="h-5" />
        </div>

        <div className="flex-1">
          <label className="sr-only" htmlFor="withdraw-amount">
            Enter amount of token to receive
          </label>

          <input
            autoComplete="off"
            autoCorrect="off"
            className="w-full appearance-none bg-transparent text-right text-2xl font-normal h-10 focus:outline-none font-mono"
            inputMode="decimal"
            maxLength={79}
            minLength={1}
            name="withdraw-amount"
            required
            id="withdraw-amount"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            spellCheck="false"
            type="text"
            {...withdrawAmountInput.eventBind}
          />
        </div>
      </div>

      <div className="space-y-4">
        {sovNeedsApproval && (
          <button
            className="p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4 bg-white text-primary"
            onClick={approveSOV}
            type="button"
          >
            {`Approve Sovreign To Spend Your SOV`}
          </button>
        )}

        <button
          className={classNames(
            "p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4",
            withdrawAmountInput.hasValue && !!withdrawToken && !sovNeedsApproval
              ? "bg-white text-primary"
              : "bg-primary-300"
          )}
          type="submit"
          disabled={
            !(withdrawAmountInput.hasValue && !!withdrawToken) ||
            sovNeedsApproval
          }
        >
          {withdrawAmountInput.hasValue && !!withdrawToken
            ? "Withdraw"
            : "Enter an amount"}
        </button>
      </div>
    </form>
  );
}
