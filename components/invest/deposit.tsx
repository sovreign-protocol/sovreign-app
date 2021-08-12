import {
  CONTRACT_ADDRESSES,
  MaxUint256,
  POOL_ADDRESS,
  TOKEN_ADDRESSES,
} from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import usePoolRouter from "@/hooks/contracts/usePoolRouter";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import { useTokenAllowanceForPoolRouter } from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import hasValue from "@/utils/hasValue";
import { BigNumber } from "@ethersproject/bignumber";
import type { TransactionResponse } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { Popover } from "@headlessui/react";
import classNames from "classnames";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Settings } from "react-feather";
import toast from "react-hot-toast";
import { TransactionToast } from "../customToast";
import NumericalInput from "../numericalInput";
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

  async function tokenDeposit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    const values = event.target as typeof event.target & {
      depositAmount: { value: string };
      liquidationFee: { value: string };
      slippage: { value: string };
    };

    try {
      const depositAmount = parseUnits(values.depositAmount.value);

      const liquidationFee = hasValue(values.liquidationFee?.value)
        ? BigNumber.from(Number(values.liquidationFee.value) * 10000)
        : BigNumber.from(10 * 10000);

      const slippage = hasValue(values.slippage?.value)
        ? values.slippage.value
        : "1";

      const poolBalance: BigNumber = await depositTokenContract.balanceOf(
        POOL_ADDRESS[chainId]
      );

      const maxDeposit = poolBalance.div(2);

      if (depositAmount.gt(maxDeposit)) {
        const fmMaxDeposit = parseFloat(formatUnits(maxDeposit)).toFixed(2);

        throw new Error(
          `Maximum Deposit: ${fmMaxDeposit} ${depositToken.symbol}`
        );
      }

      const sovAmountOutSingle: BigNumber =
        await poolRouter.getSovAmountOutSingle(
          depositToken.address,
          depositAmount,
          slippage
        );

      const minPoolAmountOut = sovAmountOutSingle
        .mul(100 - Number(slippage))
        .div(100);

      const transaction: TransactionResponse = await poolRouter.deposit(
        depositToken.address,
        depositAmount,
        minPoolAmountOut,
        liquidationFee
      );

      toast.loading(
        <TransactionToast
          message={`Deposit ${values.depositAmount.value} ${depositToken.symbol}`}
          chainId={chainId}
          hash={transaction.hash}
        />,
        { id: _id }
      );

      await transaction.wait();

      toast.success(
        <TransactionToast
          message={`Deposit ${values.depositAmount.value} ${depositToken.symbol}`}
          chainId={chainId}
          hash={transaction.hash}
        />,
        { id: _id }
      );

      sovBalanceMutate();
      depositTokenBalanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  async function approveDepositToken() {
    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse =
        await depositTokenContract.approve(
          CONTRACT_ADDRESSES.PoolRouter[chainId],
          MaxUint256
        );

      toast.loading(`Approve ${depositToken.symbol}`, { id: _id });

      await transaction.wait();

      toast.success(`Approve ${depositToken.symbol}`, { id: _id });

      depositTokenAllowanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  return (
    <form className="space-y-4" onSubmit={tokenDeposit}>
      <div className="flex justify-between">
        <h2 className="font-medium leading-5">Deposit</h2>

        <Popover className="relative">
          <Popover.Button className="block h-5 w-5 focus:outline-none text-gray-300 hover:text-opacity-80">
            <Settings size={20} />
          </Popover.Button>

          <Popover.Panel
            className="absolute z-10 w-64 px-4 mt-3 sm:px-0 right-0"
            unmount={false}
          >
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

                  <div className="px-3 py-1 rounded-md bg-primary flex focus-within:ring-4">
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
                    htmlFor="liquidationFee"
                  >
                    Liquidation fee
                  </label>

                  <div className="px-3 py-1 rounded-md bg-primary flex focus-within:ring-4">
                    <input
                      autoComplete="off"
                      autoCorrect="off"
                      inputMode="numeric"
                      id="liquidationFee"
                      name="liquidationFee"
                      placeholder="10"
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
          <label className="sr-only" htmlFor="depositAmount">
            Enter amount of token
          </label>

          <NumericalInput
            name="depositAmount"
            id="depositAmount"
            required
            {...depositAmountInput.valueBind}
          />
        </div>
      </div>

      <div className="space-y-4">
        {depositTokenNeedsApproval && (
          <button
            className="p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4 bg-white text-primary"
            onClick={approveDepositToken}
            type="button"
          >
            {`Approve Sovreign To Spend Your ${depositToken.symbol}`}
          </button>
        )}

        <button
          className={classNames(
            "p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4",
            depositAmountInput.hasValue &&
              !!depositToken &&
              !depositTokenNeedsApproval
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
