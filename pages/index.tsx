import { Account } from "@/components/web3";
import { CONTRACT_ADDRESSES, MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import usePoolRouter from "@/hooks/contracts/usePoolRouter";
import useReignFacet from "@/hooks/contracts/useReignFacet";
import useWrappingRewards from "@/hooks/contracts/useWrappingRewards";
import useBlockNumber from "@/hooks/useBlockNumber";
import { useEagerConnect } from "@/hooks/useEagerConnect";
import useWeb3Store from "@/hooks/useWeb3Store";
import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import useReignStaked from "@/hooks/view/useReignStaked";
import {
  useTokenAllowanceForPoolRouter,
  useTokenAllowanceForReignFacet,
} from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import useUserLockedUntil from "@/hooks/view/useUserLockedUntil";
import useUserRewards from "@/hooks/view/useUserRewards";
import { injected } from "@/lib/connectors/metamask";
import getFutureTimestamp from "@/utils/getFutureTimestamp";
import { BigNumber } from "@ethersproject/bignumber";
import type { TransactionResponse } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";

function Home() {
  useEagerConnect();

  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  async function connect() {
    try {
      await injected.activate();
    } catch (error) {
      console.error(error);
    }
  }

  const { data: poolTokens } = useGetPoolTokens();
  const { data: blockNumber } = useBlockNumber();

  const { data: userRewards, mutate: userRewardsMutate } =
    useUserRewards(account);

  const poolRouter = usePoolRouter();

  const reignFacet = useReignFacet();

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

  const [tokenAddress, tokenAddressSet] = useState<string>("");
  const tokenAddressOnChange = (event: ChangeEvent<HTMLSelectElement>) =>
    tokenAddressSet(event.currentTarget.value);

  const [depositAmount, depositAmountSet] = useState<string>("");
  const depositAmountOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    depositAmountSet(event.currentTarget.value);

  const [stakeDepositAmount, stakeDepositAmountSet] = useState<string>("");
  const stakeDepositAmountOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    stakeDepositAmountSet(event.currentTarget.value);

  const [stakeWithdrawAmount, stakeWithdrawAmountSet] = useState<string>("");
  const stakeWithdrawAmountOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    stakeWithdrawAmountSet(event.currentTarget.value);

  const [withdrawAmount, withdrawAmountSet] = useState<string>("");
  const withdrawAmountOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    withdrawAmountSet(event.currentTarget.value);

  const [lockupInDays, lockupInDaysSet] = useState<string>("30");
  const lockupInDaysOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    lockupInDaysSet(event.currentTarget.value);

  const { data: tokenBalance, mutate: tokenBalanceMutate } = useTokenBalance(
    account,
    tokenAddress
  );

  const { data: sovTokenBalance, mutate: sovTokenBalanceMutate } =
    useTokenBalance(account, TOKEN_ADDRESSES.SOV[chainId]);

  const { data: tokenAllowance, mutate: tokenAllowanceMutate } =
    useTokenAllowanceForPoolRouter(tokenAddress, account);

  const { data: stakedReign, mutate: stakedReignMutate } = useReignStaked();

  const { data: reignTokenAllowance, mutate: reignTokenAllowanceMutate } =
    useTokenAllowanceForReignFacet(TOKEN_ADDRESSES.REIGN[chainId], account);

  const { data: sovTokenAllowance, mutate: sovTokenAllowanceMutate } =
    useTokenAllowanceForPoolRouter(TOKEN_ADDRESSES.SOV[chainId], account);

  const { data: userLocked, mutate: userLockedUntilMutate } =
    useUserLockedUntil();

  const sovNeedsApproval =
    !!sovTokenAllowance && !!withdrawAmount
      ? sovTokenAllowance.lt(parseUnits(withdrawAmount))
      : undefined;

  const needsApproval =
    !!tokenAllowance && !!depositAmount
      ? tokenAllowance.lt(parseUnits(depositAmount))
      : undefined;

  const reignNeedsApproval =
    !!reignTokenAllowance && !!stakeDepositAmount
      ? reignTokenAllowance.lt(parseUnits(stakeDepositAmount))
      : undefined;

  const erc20Contract = useERC20(tokenAddress);

  const sovERC20Contract = useERC20(TOKEN_ADDRESSES.SOV[chainId]);

  const reignERC20Contract = useERC20(TOKEN_ADDRESSES.REIGN[chainId]);

  async function depositOnSubmit(event: FormEvent<HTMLFormElement>) {
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

      await sovTokenBalanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function withdrawOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = event.target as typeof event.target & {
      "withdraw-token": { value: string };
      "withdraw-amount": { value: string };
    };

    try {
      const tokenOut = values["withdraw-token"].value;

      const minAmountOut = parseUnits(values["withdraw-amount"].value);

      const poolAmountIn = await getPoolAmountIn(tokenOut, minAmountOut);

      if (poolAmountIn.gt(sovTokenBalance)) {
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

      await tokenBalanceMutate();

      await sovTokenBalanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function depositStake() {
    try {
      const tx: TransactionResponse = await reignFacet.deposit(
        parseUnits(stakeDepositAmount)
      );

      await tx.wait();

      stakedReignMutate();

      reignTokenBalanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function withdrawStake() {
    try {
      const tx: TransactionResponse = await reignFacet.withdraw(
        parseUnits(stakeWithdrawAmount)
      );

      await tx.wait();

      stakedReignMutate();

      reignTokenBalanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function approveReign() {
    try {
      const tx: TransactionResponse = await reignERC20Contract.approve(
        CONTRACT_ADDRESSES.ReignFacet[chainId],
        MaxUint256
      );

      await tx.wait();

      await reignTokenAllowanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function approve() {
    try {
      const tx: TransactionResponse = await erc20Contract.approve(
        CONTRACT_ADDRESSES.PoolRouter[chainId],
        MaxUint256
      );

      await tx.wait();

      await tokenAllowanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function approveSOV() {
    try {
      const tx: TransactionResponse = await sovERC20Contract.approve(
        CONTRACT_ADDRESSES.PoolRouter[chainId],
        MaxUint256
      );

      await tx.wait();

      await sovTokenAllowanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function lockupStake() {
    try {
      if (Number(lockupInDays) > 365 * 2) {
        throw new Error("Max Lockup Time Is 2 Years (730 Days)");
      }

      const futureTimestamp = getFutureTimestamp(Number(lockupInDays));

      const tx: TransactionResponse = await reignFacet.lock(
        BigNumber.from(futureTimestamp)
      );

      await tx.wait();

      await userLockedUntilMutate();
    } catch (error) {
      console.error(error);
    }
  }

  const wrappingRewards = useWrappingRewards();

  const { data: reignTokenBalance, mutate: reignTokenBalanceMutate } =
    useTokenBalance(account, TOKEN_ADDRESSES.REIGN[chainId]);

  async function harvest() {
    try {
      const tx: TransactionResponse = await wrappingRewards.massHarvest();

      await tx.wait();

      await userRewardsMutate();
      await reignTokenBalanceMutate();
    } catch (error) {}
  }

  return (
    <div className="p-5">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="mb-8">
        {account && (
          <div className="flex">
            <Account />
          </div>
        )}

        <div>
          {account ? (
            <ul>
              <li>
                <p>Block Number</p>
                <p>{blockNumber}</p>
              </li>

              <li>
                <p>REIGN Balance</p>
                <p>{formatUnits(reignTokenBalance ?? 0)}</p>

                <div>
                  <h4>Deposit Stake</h4>

                  <div>
                    <label className="block" htmlFor="reign-amount">
                      Enter amount of REIGN token to deposit
                    </label>

                    <input
                      autoComplete="off"
                      autoCorrect="off"
                      inputMode="decimal"
                      maxLength={79}
                      minLength={1}
                      name="reign-amount"
                      required
                      id="reign-amount"
                      value={stakeDepositAmount}
                      onChange={stakeDepositAmountOnChange}
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      placeholder="0.0"
                      spellCheck="false"
                      type="text"
                    />
                  </div>

                  {reignNeedsApproval && (
                    <button onClick={approveReign}>
                      Approve Sovreign To Spend Your REIGN
                    </button>
                  )}

                  <button disabled={reignNeedsApproval} onClick={depositStake}>
                    Deposit Stake
                  </button>
                </div>
              </li>
              <li>
                <p>REIGN Staked</p>
                <p>{formatUnits(stakedReign ?? 0)}</p>

                <div>
                  <h4>Withdraw Stake</h4>

                  <div>
                    <label className="block" htmlFor="reign-withdraw-amount">
                      Enter amount of REIGN token to withdraw
                    </label>

                    <input
                      autoComplete="off"
                      autoCorrect="off"
                      inputMode="decimal"
                      maxLength={79}
                      minLength={1}
                      name="reign-withdraw-amount"
                      required
                      id="reign-withdraw-amount"
                      value={stakeWithdrawAmount}
                      onChange={stakeWithdrawAmountOnChange}
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      placeholder="0.0"
                      spellCheck="false"
                      type="text"
                    />
                  </div>

                  <button
                    disabled={userLocked?.isLocked || stakedReign?.isZero()}
                    onClick={withdrawStake}
                  >
                    Withdraw Stake
                  </button>
                </div>

                <div>
                  <p>Lock Up Stake</p>

                  <input
                    name="lockup-range"
                    id="lockup-range"
                    type="range"
                    min={1}
                    max={365 * 2}
                    value={lockupInDays}
                    onChange={lockupInDaysOnChange}
                    step={1}
                  />

                  <input
                    type="number"
                    value={lockupInDays}
                    min={1}
                    max={365 * 2}
                    name="lockup"
                    id="lockup"
                    step={1}
                    onChange={lockupInDaysOnChange}
                  />

                  <p>
                    Multiplier:{" "}
                    {((Number(lockupInDays) / 730) * 0.5 + 1).toFixed(2)}x
                  </p>

                  <button onClick={lockupStake}>Lock Up</button>
                </div>
              </li>
              <li>
                <p>User Rewards</p>
                <p>{formatUnits(userRewards ?? 0)}</p>

                {userRewards?.gt(0) && (
                  <button onClick={harvest}>Harvest</button>
                )}
              </li>
            </ul>
          ) : (
            <button onClick={connect}>Connect Wallet</button>
          )}
        </div>
      </nav>

      <main>
        <div>
          <h2 className="mb-4 text-lg font-bold">Deposit</h2>

          <form onSubmit={depositOnSubmit} method="POST" className="space-y-4">
            <div>
              <label className="block" htmlFor="token">
                Select a token
              </label>

              <select
                value={tokenAddress}
                onChange={tokenAddressOnChange}
                name="token"
                id="token"
                required
              >
                <option value="">Select a token</option>
                {poolTokens?.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.name}
                  </option>
                ))}
              </select>
            </div>

            {tokenAddress && tokenBalance && (
              <div>
                <p>
                  <span>Balance:</span> <span>{formatUnits(tokenBalance)}</span>
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
                value={depositAmount}
                onChange={depositAmountOnChange}
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="0.0"
                spellCheck="false"
                type="text"
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

            {needsApproval && (
              <div>
                <p>Needs Token Approval</p>

                <button onClick={approve} type="button">
                  Approve Sovreign To Spend Your Token
                </button>
              </div>
            )}

            <button type="submit" disabled={needsApproval}>
              Deposit
            </button>
          </form>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold">Withdraw</h2>

          <form onSubmit={withdrawOnSubmit} method="POST" className="space-y-4">
            <div>
              <label className="block" htmlFor="withdraw-token">
                Select a token to receive back
              </label>

              <select
                value={tokenAddress}
                onChange={tokenAddressOnChange}
                name="withdraw-token"
                id="withdraw-token"
                required
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
                inputMode="decimal"
                maxLength={79}
                minLength={1}
                name="withdraw-amount"
                required
                id="withdraw-amount"
                value={withdrawAmount}
                onChange={withdrawAmountOnChange}
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="0.0"
                spellCheck="false"
                type="text"
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
      </main>
    </div>
  );
}

export default Home;
