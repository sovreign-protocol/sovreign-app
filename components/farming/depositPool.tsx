import Button, { MaxButton } from "@/components/button";
import NumericalInput from "@/components/numericalInput";
import { TokenPair } from "@/components/tokenSelect";
import {
  FarmingPool,
  LP_SYMBOL,
  MaxUint256,
  MIN_INPUT_VALUE,
} from "@/constants";
import useStaking from "@/hooks/contracts/useStaking";
import { useTokenContract } from "@/hooks/useContract";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useStakingBalanceLocked from "@/hooks/view/useStakingBalanceLocked";
import useTokenAllowance from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import type { FormEvent } from "react";
import { useMemo } from "react";
import { ExternalLink } from "react-feather";
import toast from "react-hot-toast";

export default function DepositPool({ pool }: { pool: FarmingPool }) {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const staking = useStaking();

  const depositInput = useInput();

  const poolTokenContract = useTokenContract(pool?.address?.[chainId]);

  const { data: poolTokenBalance, mutate: poolTokenBalanceMutate } =
    useTokenBalance(account, pool?.address?.[chainId]);

  const { data: poolTokenAllowance, mutate: poolTokenAllowanceMutate } =
    useTokenAllowance(pool?.address?.[chainId], account, staking?.address);

  const { mutate: poolTokenBalanceLockedMutate } = useStakingBalanceLocked(
    account,
    pool?.address?.[chainId]
  );

  const poolTokenNeedsApproval = useMemo(() => {
    if (!!poolTokenAllowance && depositInput.hasValue) {
      return poolTokenAllowance.isZero();
    }

    return;
  }, [poolTokenAllowance, depositInput.hasValue]);

  const fmPoolTokenBalance = useFormattedBigNumber(poolTokenBalance);

  async function approvePoolToken() {
    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse = await poolTokenContract.approve(
        staking?.address,
        MaxUint256
      );

      toast.loading(`Approve ${LP_SYMBOL?.[chainId]}`, { id: _id });

      await transaction.wait();

      toast.success(`Approve ${LP_SYMBOL?.[chainId]}`, { id: _id });

      poolTokenAllowanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  async function depositPoolToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      if (Number(depositInput.value) <= MIN_INPUT_VALUE) {
        throw new Error(
          `Minium Deposit: ${MIN_INPUT_VALUE} ${LP_SYMBOL?.[chainId]}`
        );
      }

      const depositAmount = parseUnits(depositInput.value);

      const transaction: TransactionResponse = await staking.deposit(
        pool?.address?.[chainId],
        depositAmount
      );

      toast.loading(`Deposit ${depositInput.value} ${LP_SYMBOL?.[chainId]}`, {
        id: _id,
      });

      await transaction.wait();

      toast.success(`Deposit ${depositInput.value} ${LP_SYMBOL?.[chainId]}`, {
        id: _id,
      });

      poolTokenBalanceMutate();
      poolTokenBalanceLockedMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  const depositInputIsMax =
    poolTokenBalance && depositInput.value === formatUnits(poolTokenBalance);
  const setDepositMax = () => {
    depositInput.setValue(formatUnits(poolTokenBalance));
  };

  return (
    <form onSubmit={depositPoolToken} method="POST">
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">
            Deposit {pool?.name?.[chainId]}
          </h2>

          {!!pool && (
            <a
              href={pool.link?.[chainId]}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-5 w-5 rounded focus:outline-none focus:ring-4"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>

        <div>
          <div className="flex space-x-4 mb-2">
            <TokenPair pairs={pool?.pairs} symbol={LP_SYMBOL?.[chainId]} />

            <div className="flex-1">
              <label className="sr-only" htmlFor="deposit">
                {`Enter amount of ${LP_SYMBOL?.[chainId]} to deposit`}
              </label>

              <NumericalInput
                id="deposit"
                name="deposit"
                required
                {...depositInput.valueBind}
              />
            </div>
          </div>

          <p className="text-sm text-gray-300 h-5">
            {poolTokenBalance && fmPoolTokenBalance ? (
              <>
                <span>{`Balance: ${fmPoolTokenBalance} ${LP_SYMBOL?.[chainId]}`}</span>{" "}
                {!depositInputIsMax && <MaxButton onClick={setDepositMax} />}
              </>
            ) : null}
          </p>
        </div>

        <div className="space-y-4">
          {poolTokenNeedsApproval && (
            <Button onClick={approvePoolToken}>
              {`Approve Sovreign To Spend Your ${LP_SYMBOL?.[chainId]}`}
            </Button>
          )}

          <Button
            disabled={
              !(depositInput.hasValue && !!pool) || poolTokenNeedsApproval
            }
            type="submit"
          >
            {depositInput.hasValue && !!pool ? "Deposit" : "Enter an amount"}
          </Button>
        </div>
      </div>
    </form>
  );
}
