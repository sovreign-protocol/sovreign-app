import {
  BALANCER_POOL_ADDRESS,
  CONTRACT_ADDRESSES,
} from "@/constants/contracts";
import {
  MaxUint256,
  MAX_SOV_MINTABLE,
  MIN_INPUT_VALUE,
} from "@/constants/numbers";
import { TOKEN_ADDRESSES } from "@/constants/tokens";
import useBestBuy from "@/hooks/useBestBuy";
import { usePoolRouter, useTokenContract } from "@/hooks/useContract";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useTotalSupply from "@/hooks/useTotalSupply";
import useWeb3Store from "@/hooks/useWeb3Store";
import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import useGetSovAmountOut from "@/hooks/view/useGetSovAmountOut";
import useTokenAllowance from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import { BigNumber } from "@ethersproject/bignumber";
import { commify, formatUnits, parseUnits } from "@ethersproject/units";
import { Popover } from "@headlessui/react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Settings } from "react-feather";
import toast from "react-hot-toast";
import Button, { BuyLink, MaxButton } from "../button";
import { TransactionToast } from "../customToast";
import NumericalInput from "../numericalInput";
import TokenSelect, { Token } from "../tokenSelect";

export default function Deposit() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const poolRouter = usePoolRouter();

  const { mutate: bestBuyMutate } = useBestBuy();

  const { data: poolTokens } = useGetPoolTokens();

  const { mutate: sovBalanceMutate } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.SOV[chainId]
  );

  const { data: totalSupply, mutate: totalSupplyMutate } = useTotalSupply(
    TOKEN_ADDRESSES.SOV[chainId]
  );

  const formattedTotalSupply = useFormattedBigNumber(totalSupply, 0);

  const [depositToken, depositTokenSet] = useState<Token>();

  const depositTokenContract = useTokenContract(depositToken?.address);

  const { data: depositTokenBalance, mutate: depositTokenBalanceMutate } =
    useTokenBalance(account, depositToken?.address);
  const { data: depositTokenAllowance, mutate: depositTokenAllowanceMutate } =
    useTokenAllowance(
      depositToken?.address,
      account,
      CONTRACT_ADDRESSES.PoolRouter[chainId]
    );

  const formattedDepositBalance = useFormattedBigNumber(depositTokenBalance, 4);

  const depositInput = useInput();
  const slippageInput = useInput();
  const liquidationFeeInput = useInput();

  const depositTokenNeedsApproval = useMemo(() => {
    if (!!depositTokenAllowance && depositInput.hasValue) {
      return depositTokenAllowance.isZero();
    }

    return;
  }, [depositTokenAllowance, depositInput.hasValue]);

  const { data: sovAmountOut } = useGetSovAmountOut(
    depositToken?.address,
    depositInput?.value
  );

  const formattedSovAmountOut = useFormattedBigNumber(sovAmountOut);

  async function tokenDeposit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      const depositAmount = depositInput.value;

      if (Number(depositAmount) <= MIN_INPUT_VALUE) {
        throw new Error(
          `Minium Deposit: ${MIN_INPUT_VALUE} ${depositToken.symbol}`
        );
      }

      const tokenAmountIn = parseUnits(depositAmount);

      const liquidationFeeBigNumber = liquidationFeeInput.hasValue
        ? BigNumber.from(Number(liquidationFeeInput.value) * 10000)
        : BigNumber.from(10 * 10000);

      const slippage = slippageInput.hasValue ? slippageInput.value : "1";

      const poolBalance: BigNumber = await depositTokenContract.balanceOf(
        BALANCER_POOL_ADDRESS[chainId]
      );

      const maxDeposit = poolBalance.div(3);

      if (tokenAmountIn.gt(maxDeposit)) {
        const fmMaxDeposit = parseFloat(formatUnits(maxDeposit)).toFixed(2);

        throw new Error(
          `Maximum Deposit: ${fmMaxDeposit} ${depositToken.symbol}`
        );
      }

      const sovAmountOutSingle: BigNumber =
        await poolRouter.getSovAmountOutSingle(
          depositToken.address,
          tokenAmountIn,
          slippage
        );

      const minPoolAmountOut = sovAmountOutSingle
        .mul(100 - Number(slippage))
        .div(100);

      const transaction = await poolRouter.deposit(
        depositToken.address,
        tokenAmountIn,
        minPoolAmountOut,
        liquidationFeeBigNumber
      );

      depositInput.clear();

      toast.loading(
        <TransactionToast
          message={`Deposit ${depositAmount} ${depositToken.symbol}`}
          chainId={chainId}
          hash={transaction.hash}
        />,
        { id: _id }
      );

      await transaction.wait();

      toast.success(
        <TransactionToast
          message={`Deposit ${depositAmount} ${depositToken.symbol}`}
          chainId={chainId}
          hash={transaction.hash}
        />,
        { id: _id }
      );

      sovBalanceMutate();
      depositTokenBalanceMutate();
      totalSupplyMutate();
      bestBuyMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  async function approveDepositToken() {
    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction = await depositTokenContract.approve(
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

  const inputIsMax =
    !!depositTokenBalance &&
    depositInput.value === formatUnits(depositTokenBalance);

  const setMax = () => {
    depositInput.setValue(formatUnits(depositTokenBalance));
  };

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
                      {...slippageInput.eventBind}
                    />

                    <span>%</span>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm mb-2 text-gray-300"
                    htmlFor="liquidationFee"
                  >
                    Liquidity Position Price
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
                      {...slippageInput.eventBind}
                    />

                    <span>%</span>
                  </div>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      </div>

      <div>
        <div className="flex space-x-4 mb-2">
          <TokenSelect
            value={depositToken}
            onChange={depositTokenSet}
            tokens={poolTokens}
            order="DESC"
          />

          <div className="flex-1">
            <label className="sr-only" htmlFor="depositAmount">
              Enter amount of token
            </label>

            <NumericalInput
              name="depositAmount"
              id="depositAmount"
              required
              {...depositInput.valueBind}
            />
          </div>
        </div>

        <p className="text-sm text-gray-300 h-5">
          {!!depositToken && depositTokenBalance && formattedDepositBalance ? (
            <>
              <span>{`Balance: ${formattedDepositBalance} ${depositToken.symbol}`}</span>{" "}
              {!inputIsMax && !depositTokenBalance.isZero() && (
                <MaxButton onClick={setMax} />
              )}
              {depositTokenBalance.isZero() && (
                <BuyLink tokenSymbol={depositToken.symbol} />
              )}
            </>
          ) : null}
        </p>
      </div>

      <div className="h-px w-full bg-primary-300" />

      <div className="flex justify-between">
        <p className="leading-none">SOV Received</p>

        <p className="leading-none">
          {formattedSovAmountOut === "0.00" ? `-` : formattedSovAmountOut}
        </p>
      </div>

      <div className="flex justify-between">
        <p className="leading-none">SOV Supply</p>

        <p className="leading-none">{`${formattedTotalSupply} / ${commify(
          MAX_SOV_MINTABLE
        )}`}</p>
      </div>

      <div className="space-y-4">
        {depositTokenNeedsApproval && (
          <Button onClick={approveDepositToken}>
            {`Approve Sovreign To Spend Your ${depositToken.symbol}`}
          </Button>
        )}

        <Button
          type="submit"
          disabled={
            !(depositInput.hasValue && !!depositToken) ||
            depositTokenNeedsApproval
          }
        >
          {depositInput.hasValue && !!depositToken
            ? `Deposit`
            : `Enter an amount`}
        </Button>
      </div>
    </form>
  );
}
