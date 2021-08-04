import useReignFacet from "@/hooks/contracts/useReignFacet";
import useInput from "@/hooks/useInput";
import getFutureTimestamp from "@/utils/getFutureTimestamp";
import { BigNumber } from "@ethersproject/bignumber";
import type { TransactionResponse } from "@ethersproject/providers";
import classNames from "classnames";
import { FormEvent, useMemo } from "react";

export default function Lock() {
  const lockupPeriod = useInput();

  const reignFacet = useReignFacet();

  async function lockReign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

  const multiplier = useMemo(() => {
    return ((Number(lockupPeriod.value) / (365 * 2)) * 0.5 + 1).toFixed(2);
  }, [lockupPeriod.value]);

  return (
    <div className="bg-primary-400 rounded-xl p-4 focus:outline-none ring-1 ring-inset ring-white ring-opacity-10 focus:ring-opacity-20">
      <form onSubmit={lockReign}>
        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="font-medium leading-5">Lock Stake</h2>
          </div>

          {/* Add Back Range Slider */}
          {/* <div>
            <input
              id="lockupPeriod-range"
              max={365 * 2}
              min={1}
              name="lockupPeriod-range"
              step={1}
              type="range"
              className="w-full"
              {...lockupPeriod.eventBind}
            />
          </div> */}

          <div className="flex space-x-2">
            <div className="flex divide-x">
              <button
                onClick={() => lockupPeriod.setValue("60")}
                type="button"
                className="py-2 px-3 border-primary-300 rounded-l-md whitespace-nowrap bg-primary flex focus:outline-none focus:ring-4"
              >
                60 Days
              </button>

              <button
                onClick={() => lockupPeriod.setValue("180")}
                type="button"
                className="py-2 px-3 border-primary-300 whitespace-nowrap bg-primary flex focus:outline-none focus:ring-4"
              >
                180 Days
              </button>

              <button
                onClick={() => lockupPeriod.setValue("365")}
                type="button"
                className="py-2 px-3 border-primary-300 rounded-r-md whitespace-nowrap bg-primary flex focus:outline-none focus:ring-4"
              >
                365 Days
              </button>
            </div>

            <div className="flex-1 py-2 pr-4 pl-3 rounded-md whitespace-nowrap bg-primary flex focus-within:ring-4">
              <input
                autoComplete="off"
                autoCorrect="off"
                className="hide-number-input-arrows text-right appearance-none bg-transparent flex-1 focus:outline-none mr-1 text-white"
                id="lockupPeriod"
                max={365 * 2 - 1}
                min={1}
                name="lockupPeriod"
                placeholder="1"
                step={1}
                type="number"
                {...lockupPeriod.eventBind}
              />

              <span className="font-medium">Days</span>
            </div>
          </div>

          <div>
            <div className="h-4" />

            <div className="flex justify-between items-end">
              <p className="leading-none">Rewards Multiplier</p>

              <p className="text-2xl leading-none font-semibold">{`${multiplier}x`}</p>
            </div>
          </div>

          <div className="h-px w-full bg-primary-300" />

          <div className="space-y-4">
            <button
              className={classNames(
                "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
                lockupPeriod.hasValue
                  ? "bg-white text-primary"
                  : "bg-primary-300"
              )}
              type="submit"
              disabled={!lockupPeriod.hasValue}
            >
              {lockupPeriod.hasValue ? "Lock Up Reign" : "Enter Number Of Days"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}