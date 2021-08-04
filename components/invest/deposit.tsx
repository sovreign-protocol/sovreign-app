import { CONTRACT_ADDRESSES, MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import usePoolRouter from "@/hooks/contracts/usePoolRouter";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import { useTokenAllowanceForPoolRouter } from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import hasValue from "@/utils/hasValue";
import { BigNumber } from "@ethersproject/bignumber";
import type { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import { Popover } from "@headlessui/react";
import classNames from "classnames";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Settings } from "react-feather";
import TokenSelect, { Token } from "../tokenSelect";

export default function Deposit() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const poolRouter = usePoolRouter();

  const { data: poolTokens } = useGetPoolTokens();

  const { mutate: sovBalanceMutate } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.SOV[chainId]
  );

  const [depositToken, depositTokenSet] = useState<Token>();

  const depositTokenContract = useERC20(depositToken?.address);

  const { data: depositTokenBalance, mutate: depositTokenBalanceMutate } =
    useTokenBalance(account, depositToken?.address);
  const { data: depositTokenAllowance, mutate: depositTokenAllowanceMutate } =
    useTokenAllowanceForPoolRouter(depositToken?.address, account);

  const depositAmountInput = useInput();

  async function getMinPoolAmountOut(
    tokenAddress: string,
    amountToDeposit: BigNumber,
    slippage: string = "1"
  ) {
    const poolAmountOut: BigNumber = await poolRouter.getSovAmountOutSingle(
      tokenAddress,
      amountToDeposit,
      slippage
    );

    return poolAmountOut.mul(100 - Number(slippage)).div(100);
  }

  async function tokenDeposit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = event.target as typeof event.target & {
      "deposit-amount": { value: string };
      "liquidation-fee": { value: string };
      slippage: { value: string };
    };

    try {
      const depositAmount = parseUnits(values["deposit-amount"].value);

      const liquidationFee = hasValue(values["liquidation-fee"]?.value)
        ? BigNumber.from(Number(values["liquidation-fee"].value) * 10000)
        : BigNumber.from(1 * 10000);

      const minPoolAmountOut = await getMinPoolAmountOut(
        depositToken.address,
        depositAmount,
        values.slippage?.value
      );

      const tx: TransactionResponse = await poolRouter.deposit(
        depositToken.address,
        depositAmount,
        minPoolAmountOut,
        liquidationFee
      );

      await tx.wait();

      await sovBalanceMutate();

      await depositTokenBalanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function approveDepositToken() {
    try {
      const tx: TransactionResponse = await depositTokenContract.approve(
        CONTRACT_ADDRESSES.PoolRouter[chainId],
        MaxUint256
      );

      await tx.wait();

      await depositTokenAllowanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  const depositTokenNeedsApproval = useMemo(() => {
    if (!!depositTokenAllowance && depositAmountInput.hasValue) {
      return depositTokenAllowance.lt(parseUnits(depositAmountInput.value));
    }

    return;
  }, [
    depositTokenAllowance,
    depositAmountInput.hasValue,
    depositAmountInput.value,
  ]);

  const formattedDepositBalance = useFormattedBigNumber(depositTokenBalance);

  return (
    <form className="space-y-4" onSubmit={tokenDeposit}>
      <div className="flex justify-between">
        <h2 className="font-medium leading-5">Deposit</h2>

        <Popover className="relative">
          <Popover.Button className="block h-5 w-5 focus:outline-none text-gray-300 hover:text-opacity-80">
            <Settings size={20} />
          </Popover.Button>

          <Popover.Panel className="absolute z-10 w-64 px-4 mt-3 sm:px-0 right-0">
            <div className="relative bg-primary-300 p-4 rounded-lg ring-1 ring-inset ring-white ring-opacity-20">
              <div className="space-y-4">
                <p className="leading-none">Advanced</p>

                <div>
                  <label
                    className="block text-sm mb-2 text-gray-300"
                    htmlFor="slippage"
                  >
                    Slippage tolerance
                  </label>

                  <div className="px-3 py-1 rounded-md bg-primary flex">
                    <input
                      autoComplete="off"
                      autoCorrect="off"
                      inputMode="numeric"
                      id="slippage"
                      name="slippage"
                      min={0}
                      max={99}
                      step={1}
                      placeholder="1"
                      className="hide-number-input-arrows w-full text-right appearance-none bg-transparent focus:outline-none mr-0.5 text-white"
                      spellCheck="false"
                      type="number"
                    />

                    <span>%</span>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm mb-2 text-gray-300"
                    htmlFor="liquidation-fee"
                  >
                    Liquidation fee
                  </label>

                  <div className="px-3 py-1 rounded-md bg-primary flex">
                    <input
                      autoComplete="off"
                      autoCorrect="off"
                      inputMode="numeric"
                      id="liquidation-fee"
                      name="liquidation-fee"
                      placeholder="1"
                      step={0.1}
                      max={10}
                      min={0}
                      className="hide-number-input-arrows w-full text-right appearance-none bg-transparent focus:outline-none mr-0.5 text-white"
                      spellCheck="false"
                      type="number"
                    />

                    <span>%</span>
                  </div>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      </div>

      <div className="flex space-x-4">
        <div>
          <div className="mb-2">
            <TokenSelect
              value={depositToken}
              onChange={depositTokenSet}
              tokens={poolTokens}
            />
          </div>

          <p className="text-sm text-gray-300 h-5">
            {!!depositToken &&
            depositTokenBalance &&
            formattedDepositBalance ? (
              <span>{`Balance: ${formattedDepositBalance} ${depositToken.symbol}`}</span>
            ) : null}
          </p>
        </div>

        <div className="flex-1">
          <label className="sr-only" htmlFor="deposit-amount">
            Enter amount of token
          </label>

          <input
            autoComplete="off"
            autoCorrect="off"
            className="w-full appearance-none bg-transparent text-right text-2xl font-normal h-10 focus:outline-none font-mono"
            inputMode="decimal"
            maxLength={79}
            minLength={1}
            name="deposit-amount"
            required
            id="deposit-amount"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            spellCheck="false"
            type="text"
            {...depositAmountInput.eventBind}
          />
        </div>
      </div>

      <div className="space-y-4">
        {depositTokenNeedsApproval && (
          <button onClick={approveDepositToken} type="button">
            {`Approve Sovreign To Spend Your ${depositToken.symbol}`}
          </button>
        )}

        <button
          className={classNames(
            "p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4",
            (depositAmountInput.hasValue && !!depositToken) ||
              depositTokenNeedsApproval
              ? "bg-white text-primary"
              : "bg-primary-300"
          )}
          type="submit"
          disabled={
            !(depositAmountInput.hasValue && !!depositToken) ||
            depositTokenNeedsApproval
          }
        >
          {depositAmountInput.hasValue && !!depositToken
            ? "Deposit"
            : "Enter an amount"}
        </button>
      </div>
    </form>
  );
}
