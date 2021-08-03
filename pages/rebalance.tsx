import { CONTRACT_ADDRESSES, MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import useReignFacet from "@/hooks/contracts/useReignFacet";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useReignStaked from "@/hooks/view/useReignStaked";
import { useTokenAllowanceForReignFacet } from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import getFutureTimestamp from "@/utils/getFutureTimestamp";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { useMemo } from "react";

function RebalancePage() {
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

  const lockupPeriod = useInput("90");

  const multiplier = useMemo(() => {
    return ((Number(lockupPeriod.value) / (365 * 2)) * 0.5 + 1).toFixed(2);
  }, [lockupPeriod.value]);

  async function lockReign() {
    const days = Number(lockupPeriod.value);

    if (days > 365 * 2) {
      throw new Error("Max Lockup Time Is 2 Years (730 Days)");
    }

    const futureTimestamp = getFutureTimestamp(days);

    const transaction: TransactionResponse = await reignFacet.lock(
      BigNumber.from(futureTimestamp)
    );

    await transaction.wait();
  }

  const withdrawInput = useInput();

  async function withdrawReign() {
    try {
      const tx: TransactionResponse = await reignFacet.withdraw(
        parseUnits(withdrawInput.value)
      );

      await tx.wait();

      reignStakedMutate();

      reignBalanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

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

  const reignToken = useERC20(TOKEN_ADDRESSES.REIGN[chainId]);

  const { data: reignAllowance, mutate: reignAllowanceMutate } =
    useTokenAllowanceForReignFacet(TOKEN_ADDRESSES.REIGN[chainId], account);

  const reignNeedsApproval =
    !!reignAllowance && depositInput.hasValue
      ? reignAllowance.lt(parseUnits(depositInput.value))
      : undefined;

  async function approveReign() {
    try {
      const tx: TransactionResponse = await reignToken.approve(
        CONTRACT_ADDRESSES.ReignFacet[chainId],
        MaxUint256
      );

      await tx.wait();

      reignAllowanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <section>
        <h1>Mix</h1>
      </section>

      <section>
        <div className="flex">
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="font-semibold">Deposit</h2>

              <p>{`${formattedReignBalance} REIGN Balance`}</p>

              <div>
                <label className="block" htmlFor="stake-deposit">
                  REIGN To Deposit
                </label>

                <input
                  autoComplete="off"
                  autoCorrect="off"
                  id="stake-deposit"
                  inputMode="decimal"
                  maxLength={79}
                  minLength={1}
                  name="stake-deposit"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0.0"
                  required
                  spellCheck="false"
                  type="text"
                  {...depositInput.eventBind}
                />
              </div>

              {reignNeedsApproval && (
                <button onClick={approveReign}>
                  Approve Sovreign To Spend Your REIGN
                </button>
              )}

              <button disabled={reignNeedsApproval} onClick={depositReign}>
                Deposit
              </button>
            </div>

            <div>
              <h2 className="font-semibold">Withdraw</h2>

              <p>{`${formattedReignStaked} REIGN Staked`}</p>

              <div>
                <label className="block" htmlFor="stake-withdraw">
                  REIGN To Withdraw
                </label>

                <input
                  autoComplete="off"
                  autoCorrect="off"
                  id="stake-withdraw"
                  inputMode="decimal"
                  maxLength={79}
                  minLength={1}
                  name="stake-withdraw"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0.0"
                  required
                  spellCheck="false"
                  type="text"
                  {...withdrawInput.eventBind}
                />
              </div>

              <button onClick={withdrawReign}>Withdraw</button>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-semibold">Lockup</h2>

            <div className="flex">
              <input
                id="lockupPeriod-range"
                max={365 * 2}
                min={1}
                name="lockupPeriod-range"
                step={1}
                type="range"
                {...lockupPeriod.eventBind}
              />

              <div>
                <input
                  id="lockupPeriod"
                  max={365 * 2}
                  min={1}
                  name="lockupPeriod"
                  step={1}
                  type="number"
                  {...lockupPeriod.eventBind}
                />

                <span>Days</span>
              </div>
            </div>

            <p>Multiplier: {multiplier}x</p>

            <button onClick={lockReign}>Lock Up Stake</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RebalancePage;
