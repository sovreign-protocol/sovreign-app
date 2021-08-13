import Button, { MaxButton } from "@/components/button";
import NumericalInput from "@/components/numericalInput";
import { TokenPair } from "@/components/tokenSelect";
import { FarmingPool, LP_SYMBOL, MIN_INPUT_VALUE } from "@/constants";
import useStaking from "@/hooks/contracts/useStaking";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useStakingBalanceLocked from "@/hooks/view/useStakingBalanceLocked";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import type { FormEvent } from "react";
import { ExternalLink } from "react-feather";
import toast from "react-hot-toast";

export default function WithdrawPool({ pool }: { pool: FarmingPool }) {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const staking = useStaking();

  const withdrawInput = useInput();

  const { mutate: poolTokenBalanceMutate } = useTokenBalance(
    account,
    pool?.address?.[chainId]
  );

  const { data: poolTokenBalanceLocked, mutate: poolTokenBalanceLockedMutate } =
    useStakingBalanceLocked(account, pool?.address?.[chainId]);

  const fmPoolTokenBalanceLocked = useFormattedBigNumber(
    poolTokenBalanceLocked
  );

  async function withdrawPoolToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      if (Number(withdrawInput.value) <= MIN_INPUT_VALUE) {
        throw new Error(
          `Minium Withdraw: ${MIN_INPUT_VALUE} ${LP_SYMBOL?.[chainId]}`
        );
      }

      const withdrawAmount = parseUnits(withdrawInput.value);

      const transaction: TransactionResponse = await staking.withdraw(
        pool?.address?.[chainId],
        withdrawAmount
      );

      toast.loading(`Withdraw ${withdrawInput.value} ${LP_SYMBOL?.[chainId]}`, {
        id: _id,
      });

      await transaction.wait();

      toast.success(`Withdraw ${withdrawInput.value} ${LP_SYMBOL?.[chainId]}`, {
        id: _id,
      });

      poolTokenBalanceMutate();
      poolTokenBalanceLockedMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  const withdrawInputIsMax =
    poolTokenBalanceLocked &&
    withdrawInput.value === formatUnits(poolTokenBalanceLocked);
  const setWithdrawMax = () => {
    withdrawInput.setValue(formatUnits(poolTokenBalanceLocked));
  };

  return (
    <form onSubmit={withdrawPoolToken} method="POST">
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-medium leading-5">
            Withdraw {pool?.name?.[chainId]}
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
              <label className="sr-only" htmlFor="withdraw">
                {`Enter amount of ${LP_SYMBOL?.[chainId]} to withdraw`}
              </label>

              <NumericalInput
                id="withdraw"
                name="withdraw"
                required
                {...withdrawInput.valueBind}
              />
            </div>
          </div>

          <p className="text-sm text-gray-300 h-5">
            {poolTokenBalanceLocked && fmPoolTokenBalanceLocked ? (
              <>
                <span>{`Available: ${fmPoolTokenBalanceLocked} ${LP_SYMBOL?.[chainId]}`}</span>{" "}
                {!withdrawInputIsMax && <MaxButton onClick={setWithdrawMax} />}
              </>
            ) : null}
          </p>
        </div>

        <div className="space-y-4">
          <Button disabled={!(withdrawInput.hasValue && !!pool)} type="submit">
            {withdrawInput.hasValue && !!pool ? "Withdraw" : "Enter an amount"}
          </Button>
        </div>
      </div>
    </form>
  );
}
