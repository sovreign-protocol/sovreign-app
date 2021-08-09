import useBasketBalancer from "@/hooks/contracts/useBasketBalancer";
import useContinuousTokenAllocation from "@/hooks/view/useContinuousTokenAllocation";
import useHasVotedInEpoch from "@/hooks/view/useHasVotedInEpoch";
import useMaxDelta from "@/hooks/view/useMaxDelta";
import useTokenAllocation from "@/hooks/view/useTokenAllocation";
import { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import classNames from "classnames";
import { FormEvent, useEffect, useState } from "react";
import { Minus, Plus } from "react-feather";

export default function AllocationAdjustment() {
  const basketBalancer = useBasketBalancer();

  const { data: hasVotedInEpoch, mutate: hasVotedInEpochMutate } =
    useHasVotedInEpoch();

  const { data: delta } = useMaxDelta();

  const { data: tokenAllocation } = useTokenAllocation();

  const { mutate: continuousTokenAllocationMutate } =
    useContinuousTokenAllocation();

  const totalAllocation =
    tokenAllocation &&
    tokenAllocation
      .map((token) => token.allocation)
      .reduce((prev, cur) => cur + prev);

  const [inputObject, inputObjectSet] = useState<Record<string, number>>();

  const total =
    inputObject && Object.values(inputObject).reduce((prev, cur) => prev + cur);

  useEffect(() => {
    if (typeof tokenAllocation === "undefined") {
      return;
    }

    inputObjectSet(
      Object.fromEntries(
        tokenAllocation.map((el) => [el.address, el.allocation])
      )
    );
  }, [tokenAllocation]);

  const canUpdate = total === totalAllocation;

  async function updateAllocationVote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const tx: TransactionResponse = await basketBalancer.updateAllocationVote(
        Object.keys(inputObject),
        Object.values(inputObject).map((el) => parseUnits(el.toString()))
      );

      await tx.wait();

      hasVotedInEpochMutate();
      continuousTokenAllocationMutate();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form method="POST" onSubmit={updateAllocationVote} className="flex-1">
      <div className="mb-4">
        <h2 className="font-medium leading-5">Adjust Token Allocation</h2>
      </div>

      <div className="mb-4">
        <ul className="space-y-4">
          {inputObject &&
            tokenAllocation &&
            tokenAllocation?.map((token) => {
              return (
                <li key={token.address}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <img
                          alt={token.symbol}
                          className="rounded-full bg-primary"
                          decoding="async"
                          height={20}
                          loading="lazy"
                          src={`https://raw.githubusercontent.com/Synthetixio/synthetix-assets/v2.0.10/synths/${token.symbol}.svg`}
                          width={20}
                        />

                        <p className="text-xl font-semibold leading-none">
                          {token.symbol}
                        </p>
                      </div>

                      <p className="text-sm text-gray-300">{`Current Allocation: ${token.allocation}`}</p>
                    </div>

                    <div className="flex divide-x">
                      <button
                        type="button"
                        className="flex-1 p-2 border-primary-300 rounded-l-md whitespace-nowrap bg-primary flex focus:outline-none focus:ring-4"
                        onClick={() =>
                          inputObjectSet((prev) => {
                            const prevValue = prev[token.address];

                            if (prevValue >= token.allocation + delta) {
                              return prev;
                            }

                            return {
                              ...prev,
                              [token.address]: prevValue + 0.5,
                            };
                          })
                        }
                      >
                        <Plus size={20} />
                      </button>

                      <div className="p-2 w-16 border-primary-300 whitespace-nowrap bg-primary flex items-center justify-center leading-5 focus-within:ring-4">
                        <input
                          autoComplete="off"
                          autoCorrect="off"
                          inputMode="decimal"
                          max={token.allocation + delta}
                          min={token.allocation - delta}
                          required
                          step={0.01}
                          value={inputObject[token.address]}
                          onChange={(event) =>
                            inputObjectSet((prev) => ({
                              ...prev,
                              [token.address]: event.target.valueAsNumber,
                            }))
                          }
                          className="hide-number-input-arrows w-full text-center appearance-none bg-transparent focus:outline-none mr-0.5 text-white"
                          spellCheck="false"
                          type="number"
                        />
                      </div>

                      <button
                        type="button"
                        className="flex-1 p-2 border-primary-300 rounded-r-md whitespace-nowrap bg-primary flex focus:outline-none focus:ring-4"
                        onClick={() =>
                          inputObjectSet((prev) => {
                            const prevValue = prev[token.address];

                            if (prevValue <= token.allocation - delta) {
                              return prev;
                            }

                            return {
                              ...prev,
                              [token.address]: prevValue - 0.5,
                            };
                          })
                        }
                      >
                        <Minus size={20} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}

          <li>
            <div className="flex justify-between items-end">
              <p className="leading-none  font-semibold">Total Allocation</p>

              <div className="leading-none">
                {totalAllocation ? total : "..."}
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <button
          type="submit"
          className={classNames(
            "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
            canUpdate && !hasVotedInEpoch
              ? "bg-white text-primary"
              : "bg-primary-300"
          )}
          disabled={!canUpdate || hasVotedInEpoch}
        >
          {hasVotedInEpoch
            ? "Vote already cast"
            : canUpdate
            ? "Cast vote"
            : `Total allocation must equal ${totalAllocation}`}
        </button>
      </div>
    </form>
  );
}
