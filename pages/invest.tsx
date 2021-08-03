import useWeb3Store from "@/hooks/useWeb3Store";
import type { TransactionResponse } from "@ethersproject/providers";
import { FormEvent } from "react";
import usePoolRouter from "@/hooks/contracts/usePoolRouter";
import useERC20 from "@/hooks/contracts/useERC20";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { CONTRACT_ADDRESSES, MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import useInput from "@/hooks/useInput";
import { useTokenAllowanceForPoolRouter } from "@/hooks/view/useTokenAllowance";
import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import { useMemo } from "react";

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
    if (!!depositTokenAllowance && depositTokenSelect.hasValue) {
      return depositTokenAllowance.lt(parseUnits(depositTokenSelect.value));
    }

    return;
  }, [
    depositTokenAllowance,
    depositTokenSelect.hasValue,
    depositTokenSelect.value,
  ]);

  return (
    <div>
      <section>
        <h1>Invest</h1>
      </section>

      <section>
        <div className="flex">
          <div className="flex-1">
            <div>
              <h2>Deposit</h2>

              <form onSubmit={tokenDeposit} method="POST" className="space-y-4">
                <div>
                  <label className="block" htmlFor="token">
                    Select a token
                  </label>

                  <select
                    name="token"
                    id="token"
                    required
                    {...depositTokenSelect.eventBind}
                  >
                    <option value="">Select a token</option>
                    {poolTokens?.map((token) => (
                      <option key={token.address} value={token.address}>
                        {token.name}
                      </option>
                    ))}
                  </select>
                </div>

                {depositTokenSelect.hasValue && depositTokenBalance && (
                  <div>
                    <p>
                      <span>Balance:</span>{" "}
                      <span>{formatUnits(depositTokenBalance)}</span>
                    </p>
                  </div>
                )}

                <div>
                  <label className="block" htmlFor="amount">
                    Enter amount of token
                  </label>

                  <input
                    autoComplete="off"
                    autoCorrect="off"
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

                <div>
                  <p>Advanced</p>

                  <div>
                    <label className="block" htmlFor="slippage">
                      Slippage Percent
                    </label>

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
                      spellCheck="false"
                      type="number"
                    />

                    <span>%</span>
                  </div>
                </div>

                {depositTokenNeedsApproval && (
                  <div>
                    <p>Needs Token Approval</p>

                    <button onClick={approveDepositToken} type="button">
                      Approve Sovreign To Spend Your Token
                    </button>
                  </div>
                )}

                <button type="submit" disabled={depositTokenNeedsApproval}>
                  Deposit
                </button>
              </form>
            </div>
          </div>
          <div className="flex-1">
            <h2>Withdraw</h2>

            <form onSubmit={tokenWithdraw} className="space-y-4">
              <div>
                <label className="block" htmlFor="withdraw-token">
                  Select a token to receive back
                </label>

                <select
                  name="withdraw-token"
                  id="withdraw-token"
                  required
                  {...withdrawTokenSelect.eventBind}
                >
                  <option value="">Select a token</option>
                  {poolTokens?.map((token) => (
                    <option key={token.address} value={token.address}>
                      {token.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block" htmlFor="withdraw-amount">
                  Enter amount of token to receive
                </label>

                <input
                  autoComplete="off"
                  autoCorrect="off"
                  id="withdraw-amount"
                  inputMode="decimal"
                  maxLength={79}
                  minLength={1}
                  name="withdraw-amount"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0.0"
                  required
                  spellCheck="false"
                  type="text"
                  {...withdrawAmountInput.eventBind}
                />
              </div>

              {sovNeedsApproval && (
                <div>
                  <p>Needs SOV Approval</p>

                  <button onClick={approveSOV} type="button">
                    Approve Sovreign To Spend Your SOV
                  </button>
                </div>
              )}

              <button type="submit" disabled={sovNeedsApproval}>
                Withdraw
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InvestPage;
