import Button, { MaxButton } from "@/components/button";
import NumericalInput from "@/components/numericalInput";
import { TokenPair } from "@/components/tokenSelect";
import { FarmingPool, FARMING_LP_SYMBOL } from "@/constants/farming";
import { MaxUint256, MIN_INPUT_VALUE } from "@/constants/numbers";
import { useStaking, useTokenContract } from "@/hooks/useContract";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useStakingBalanceLocked from "@/hooks/view/useStakingBalanceLocked";
import useTokenAllowance from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import { formatUnits, parseUnits } from "@ethersproject/units";
import type { FormEvent } from "react";
import { useMemo } from "react";
import { ExternalLink } from "react-feather";
import toast from "react-hot-toast";
import { TransactionToast } from "../customToast";

export default function DepositPool({ pool }: { pool: FarmingPool }) {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const staking = useStaking();

  const depositInput = useInput();

  const poolTokenContract = useTokenContract(pool?.address);

  const { data: poolTokenBalance, mutate: poolTokenBalanceMutate } =
    useTokenBalance(account, pool?.address);

  const { data: poolTokenAllowance, mutate: poolTokenAllowanceMutate } =
    useTokenAllowance(pool?.address, account, staking?.address);

  const { mutate: poolTokenBalanceLockedMutate } = useStakingBalanceLocked(
    account,
    pool?.address
  );

  const poolTokenNeedsApproval = useMemo(() => {
    if (!!poolTokenAllowance && depositInput.hasValue) {
      return poolTokenAllowance.isZero();
    }

    return;
  }, [poolTokenAllowance, depositInput.hasValue]);

  const fmPoolTokenBalance = useFormattedBigNumber(poolTokenBalance, 4);

  async function approvePoolToken() {
    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction = await poolTokenContract.approve(
        staking?.address,
        MaxUint256
      );

      toast.loading(`Approve ${FARMING_LP_SYMBOL[chainId]}`, { id: _id });

      await transaction.wait();

      toast.success(`Approve ${FARMING_LP_SYMBOL[chainId]}`, { id: _id });

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
          `Minium Deposit: ${MIN_INPUT_VALUE} ${FARMING_LP_SYMBOL[chainId]}`
        );
      }

      const depositAmount = parseUnits(depositInput.value);

      const transaction = await staking.deposit(pool?.address, depositAmount);

      depositInput.clear();

      toast.loading(
        <TransactionToast
          message={`Deposit ${depositInput.value} ${FARMING_LP_SYMBOL[chainId]}`}
          hash={transaction.hash}
          chainId={chainId}
        />,
        {
          id: _id,
        }
      );

      await transaction.wait();

      toast.success(
        <TransactionToast
          message={`Deposit ${depositInput.value} ${FARMING_LP_SYMBOL[chainId]}`}
          hash={transaction.hash}
          chainId={chainId}
        />,
        {
          id: _id,
        }
      );

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
          <h2 className="font-medium leading-5">Deposit {pool?.name}</h2>

          {!!pool && (
            <a
              href={pool.link}
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
            <TokenPair
              pairs={pool?.pairs}
              symbol={FARMING_LP_SYMBOL[chainId]}
            />

            <div className="flex-1">
              <label className="sr-only" htmlFor="deposit">
                {`Enter amount of ${FARMING_LP_SYMBOL[chainId]} to deposit`}
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
                <span>{`Balance: ${fmPoolTokenBalance} ${FARMING_LP_SYMBOL[chainId]}`}</span>{" "}
                {!depositInputIsMax && <MaxButton onClick={setDepositMax} />}
              </>
            ) : null}
          </p>
        </div>

        <div className="space-y-4">
          {poolTokenNeedsApproval && (
            <Button onClick={approvePoolToken}>
              {`Approve Sovreign To Spend Your ${FARMING_LP_SYMBOL[chainId]}`}
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
