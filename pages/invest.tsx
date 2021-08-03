import { CONTRACT_ADDRESSES, MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import usePoolRouter from "@/hooks/contracts/usePoolRouter";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import { useTokenAllowanceForPoolRouter } from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import { BigNumber } from "@ethersproject/bignumber";
import type { TransactionResponse } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { Popover, Tab } from "@headlessui/react";
import { FormEvent, useMemo } from "react";
import { Settings } from "react-feather";
import classNames from "classnames";

function InvestPage() {
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

  const depositTokenSelect = useInput();

  const depositTokenContract = useERC20(depositTokenSelect.value);

  const { data: depositTokenBalance, mutate: depositTokenBalanceMutate } =
    useTokenBalance(account, depositTokenSelect.value);
  const { data: depositTokenAllowance, mutate: depositTokenAllowanceMutate } =
    useTokenAllowanceForPoolRouter(depositTokenSelect.value, account);

  const depositAmountInput = useInput();

  const withdrawTokenSelect = useInput();

  const withdrawAmountInput = useInput();

  async function getMinPoolAmountOut(
    tokenAddress: string,
    amountToDeposit: string,
    slippage: string
  ) {
    const poolAmountOut: BigNumber = await poolRouter.getSovAmountOutSingle(
      tokenAddress,
      parseUnits(amountToDeposit),
      slippage ? slippage : 1
    );

    return poolAmountOut.mul(100 - Number(slippage)).div(100);
  }

  async function getPoolAmountIn(tokenOut: string, tokenAmountOut: BigNumber) {
    const poolAmountIn: BigNumber = await poolRouter.getSovAmountInSingle(
      tokenOut,
      tokenAmountOut,
      MaxUint256
    );

    return poolAmountIn;
  }

  async function tokenDeposit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = event.target as typeof event.target & {
      token: { value: string };
      amount: { value: string };
      slippage: { value: string };
    };

    try {
      const minPoolAmountOut = await getMinPoolAmountOut(
        values.token.value,
        values.amount.value,
        values.slippage.value
      );

      const tx: TransactionResponse = await poolRouter.deposit(
        values.token.value,
        parseUnits(values.amount.value),
        minPoolAmountOut,
        BigNumber.from(10000)
      );

      await tx.wait();

      await sovBalanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function tokenWithdraw(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = event.target as typeof event.target & {
      "withdraw-token": { value: string };
      "withdraw-amount": { value: string };
    };

    try {
      const tokenOut = values["withdraw-token"].value;

      const minAmountOut = parseUnits(values["withdraw-amount"].value);

      const poolAmountIn = await getPoolAmountIn(tokenOut, minAmountOut);

      if (poolAmountIn.gt(sovBalance)) {
        throw new Error("You Don't Have Enough SOV To Make This Withdrawal");
      }

      const tx: TransactionResponse = await poolRouter.withdraw(
        tokenOut,
        poolAmountIn,
        /**
         * Account for 1% slippage
         */
        minAmountOut.mul(99).div(100)
      );

      await tx.wait();

      await depositTokenBalanceMutate();

      await sovBalanceMutate();
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

  async function approveSOV() {
    try {
      const tx: TransactionResponse = await sovContract.approve(
        CONTRACT_ADDRESSES.PoolRouter[chainId],
        MaxUint256
      );

      await tx.wait();

      await sovAllowanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  const sovNeedsApproval = useMemo(() => {
    if (!!sovAllowance && withdrawAmountInput.hasValue) {
      return sovAllowance.lt(parseUnits(withdrawAmountInput.value));
    }

    return;
  }, [sovAllowance, withdrawAmountInput.hasValue, withdrawAmountInput.value]);

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

  const tabPanelClassNames = classNames(
    "bg-white bg-opacity-[15%] rounded-xl p-3",
    "focus:outline-none ring-1 ring-inset ring-white ring-opacity-10 focus:ring-opacity-20"
  );

  return (
    <div>
      <section className="pt-16">
        <div className="max-w-xl mx-auto">
          <Tab.Group>
            <Tab.List className="flex p-1 space-x-1 bg-white/[0.05] rounded-xl">
              <Tab
                key={"Deposit"}
                className={({ selected }) =>
                  classNames(
                    "w-full py-2.5 text-sm leading-5 font-medium text-gray-300 rounded-lg",
                    "focus:outline-none focus:ring-4",
                    selected
                      ? "bg-white shadow text-primary"
                      : "hover:bg-white/[0.10] hover:text-white"
                  )
                }
              >
                {"Deposit"}
              </Tab>

              <Tab
                key={"Withdraw"}
                className={({ selected }) =>
                  classNames(
                    "w-full py-2.5 text-sm leading-5 font-medium text-gray-300 rounded-lg",
                    "focus:outline-none focus:ring-4",
                    selected
                      ? "bg-white shadow text-primary"
                      : "hover:bg-white/[0.10] hover:text-white"
                  )
                }
              >
                {"Withdraw"}
              </Tab>
            </Tab.List>

            <Tab.Panels className="mt-2">
              <Tab.Panel key={"Deposit"} className={tabPanelClassNames}>
                <form onSubmit={tokenDeposit}>
                  <div className="flex justify-between mb-4">
                    <h2 className="font-medium leading-5">Deposit</h2>

                    <Popover className="relative">
                      <Popover.Button className="block h-5 w-5 focus:outline-none text-gray-300 hover:opacity-80">
                        <Settings size={20} />
                      </Popover.Button>

                      <Popover.Panel className="absolute z-10 w-64 px-4 mt-3 sm:px-0 right-0">
                        <div className="relative bg-primary p-4 rounded-lg ring-1 ring-inset ring-white ring-opacity-20">
                          <div>
                            <p className="leading-none mb-4">Advanced</p>

                            <label
                              className="block text-sm mb-2 text-gray-300"
                              htmlFor="slippage"
                            >
                              Slippage tolerance
                            </label>

                            <div className="px-3 py-1 rounded-md bg-white bg-opacity-10 ring-1 ring-inset ring-white ring-opacity-10 flex">
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
                                className="w-full text-right appearance-none bg-transparent focus:outline-none mr-0.5 text-white"
                                spellCheck="false"
                                type="number"
                              />

                              <span>%</span>
                            </div>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Popover>
                  </div>

                  <div className="flex space-x-4 mb-4">
                    <div>
                      <div className="mb-2">
                        <label className="sr-only" htmlFor="deposit-token">
                          Select a token
                        </label>

                        <select
                          className="appearance-none bg-primary px-4 py-2 rounded-xl focus:outline-none focus:ring-4"
                          name="deposit-token"
                          id="deposit-token"
                          required
                          {...depositTokenSelect.eventBind}
                        >
                          <option value="" disabled>
                            Select a token
                          </option>
                          {poolTokens?.map((token) => (
                            <option key={token.address} value={token.address}>
                              {token.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {depositTokenSelect.hasValue &&
                        depositTokenBalance &&
                        formattedDepositBalance && (
                          <p className="text-sm text-gray-300">
                            <span>Balance:</span>{" "}
                            <span>{formattedDepositBalance}</span>{" "}
                            <span>{"SYMBOL"}</span>
                          </p>
                        )}
                    </div>

                    <div className="flex-1">
                      <label className="sr-only" htmlFor="amount">
                        Enter amount of token
                      </label>

                      <input
                        autoComplete="off"
                        autoCorrect="off"
                        className="w-full appearance-none bg-transparent text-right text-2xl font-normal h-10 focus:outline-none"
                        inputMode="decimal"
                        maxLength={79}
                        minLength={1}
                        name="amount"
                        required
                        id="amount"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        placeholder="0.0"
                        spellCheck="false"
                        type="text"
                        {...depositAmountInput.eventBind}
                      />
                    </div>
                  </div>

                  {depositTokenNeedsApproval && (
                    <button onClick={approveDepositToken} type="button">
                      Approve Sovreign To Spend Your SYMBOL
                    </button>
                  )}

                  <button
                    className={classNames(
                      "p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4",
                      depositAmountInput.hasValue && depositTokenSelect.hasValue
                        ? "bg-white text-primary"
                        : "bg-white bg-opacity-10"
                    )}
                    type="submit"
                    disabled={depositTokenNeedsApproval}
                  >
                    {depositAmountInput.hasValue && depositTokenSelect.hasValue
                      ? "Deposit"
                      : "Enter an amount"}
                  </button>
                </form>
              </Tab.Panel>

              <Tab.Panel key={"Withdraw"} className={tabPanelClassNames}>
                <form onSubmit={tokenWithdraw}>
                  <div className="flex justify-between mb-4">
                    <h2 className="font-medium leading-5">Withdraw</h2>
                  </div>

                  <div className="flex space-x-4 mb-4">
                    <div>
                      <div className="mb-2">
                        <label className="sr-only" htmlFor="withdraw-token">
                          Select a token to receive back
                        </label>

                        <select
                          className="appearance-none bg-primary px-4 py-2 rounded-xl focus:outline-none focus:ring-4"
                          name="withdraw-token"
                          id="withdraw-token"
                          required
                          {...withdrawTokenSelect.eventBind}
                        >
                          <option value="" disabled>
                            Select a token
                          </option>
                          {poolTokens?.map((token) => (
                            <option key={token.address} value={token.address}>
                              {token.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="sr-only" htmlFor="withdraw-amount">
                        Enter amount of token to receive
                      </label>

                      <input
                        autoComplete="off"
                        autoCorrect="off"
                        className="w-full appearance-none bg-transparent text-right text-2xl font-normal h-10 focus:outline-none"
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

                  {sovNeedsApproval && (
                    <button
                      className="p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4 bg-white text-primary"
                      onClick={approveSOV}
                      type="button"
                    >
                      Approve Sovreign To Spend Your SOV
                    </button>
                  )}

                  <button
                    className={classNames(
                      "p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4",
                      withdrawAmountInput.hasValue &&
                        withdrawTokenSelect.hasValue
                        ? "bg-white text-primary"
                        : "bg-white bg-opacity-10"
                    )}
                    type="submit"
                    disabled={sovNeedsApproval}
                  >
                    {withdrawAmountInput.hasValue &&
                    withdrawTokenSelect.hasValue
                      ? "Withdraw"
                      : "Enter an amount"}
                  </button>
                </form>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </div>
  );
}

export default InvestPage;
