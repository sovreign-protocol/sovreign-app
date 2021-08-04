import { TOKEN_ADDRESSES } from "@/constants";
import useReignFacet from "@/hooks/contracts/useReignFacet";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useReignStaked from "@/hooks/view/useReignStaked";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import useUserLockedUntil from "@/hooks/view/useUserLockedUntil";
import { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function WithdrawStake() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const { data: reignBalance, mutate: reignBalanceMutate } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.REIGN[chainId]
  );

  const { data: reignStaked, mutate: reignStakedMutate } = useReignStaked();

  const reignFacet = useReignFacet();

  const withdrawInput = useInput();

  async function withdrawReign() {
    try {
      const amountToWithdraw = parseUnits(withdrawInput.value);

      const tx: TransactionResponse = await reignFacet.withdraw(
        amountToWithdraw
      );

      await tx.wait();

      reignStakedMutate();

      reignBalanceMutate();
    } catch (error) {
      console.error(error);
    }
  }

  const formattedReignBalance = useFormattedBigNumber(reignBalance);

  const formattedReignStaked = useFormattedBigNumber(reignStaked);

  const { data: isStakeLocked } = useUserLockedUntil();

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-end">
          <p className="leading-none font-semibold">Staked Balance</p>

          <p className="leading-none">{`${formattedReignStaked} REIGN`}</p>
        </div>
      </div>

      <div className="h-px w-full bg-primary-300" />

      <div className="flex space-x-4">
        <div>
          <div className="mb-2">
            <div
              className={classNames(
                "relative inline-flex py-2 pl-2 pr-3 text-left rounded-xl cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 items-center space-x-2 bg-primary"
              )}
            >
              <img
                alt={"REIGN"}
                className="rounded-full"
                height={24}
                src={`/tokens/REIGN.png`}
                width={24}
              />

              <span className="block truncate font-medium">{"REIGN"}</span>
            </div>
          </div>

          <p className="text-sm text-gray-300 h-5">
            {formattedReignBalance ? (
              <span>{`Balance: ${formattedReignBalance} REIGN`}</span>
            ) : null}
          </p>
        </div>

        <div className="flex-1">
          <label className="sr-only" htmlFor="stake-withdraw">
            Enter amount of REIGN to withdraw
          </label>

          <input
            autoComplete="off"
            autoCorrect="off"
            className="w-full appearance-none bg-transparent text-right text-2xl font-normal h-10 focus:outline-none font-mono"
            inputMode="decimal"
            maxLength={79}
            minLength={1}
            id="stake-withdraw"
            name="stake-withdraw"
            required
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            spellCheck="false"
            type="text"
            {...withdrawInput.eventBind}
          />
        </div>
      </div>

      <button
        className={classNames(
          "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
          withdrawInput.hasValue ? "bg-white text-primary" : "bg-primary-300"
        )}
        disabled={!withdrawInput.hasValue && !isStakeLocked?.isLocked}
        onClick={withdrawReign}
      >
        {isStakeLocked?.isLocked
          ? `Withdraws disabled for ${dayjs(isStakeLocked.timestamp).fromNow()}`
          : withdrawInput.hasValue
          ? "Withdraw"
          : "Enter an amount"}
      </button>
    </div>
  );
}
