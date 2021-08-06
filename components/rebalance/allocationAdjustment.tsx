import useBasketBalancer from "@/hooks/contracts/useBasketBalancer";
import useContinuousTokenAllocation from "@/hooks/view/useContinuousTokenAllocation";
import useHasVotedInEpoch from "@/hooks/view/useHasVotedInEpoch";
import useMaxDelta from "@/hooks/view/useMaxDelta";
import useTokenAllocation from "@/hooks/view/useTokenAllocation";
import { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Minus, Plus } from "react-feather";
import VotingPower from "./votingPower";

export default function AllocationAdjustment() {
  const { data: tokenAllocation } = useTokenAllocation();

  const { mutate: continuousTokenAllocationMutate } =
    useContinuousTokenAllocation();

  const totalAllocation =
    tokenAllocation &&
    tokenAllocation
      .map((token) => token.allocation)
      .reduce((prev, cur) => cur + prev);

  const [inputObject, inputObjectSet] = useState<Record<string, number>>();

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

  console.log(inputObject);

  const { data: hasVotedInEpoch, mutate: hasVotedInEpochMutate } =
    useHasVotedInEpoch();

  const { data: delta } = useMaxDelta();

  const total =
    inputObject && Object.values(inputObject).reduce((prev, cur) => prev + cur);

  const canUpdate = total === totalAllocation;

  const basketBalancer = useBasketBalancer();

  async function castAdjustedVote() {
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
    <div>
      <div className="flex">
        <div className="flex-1">
          <VotingPower />
        </div>

        <div className="flex-1">
          <ul className="space-y-4 mb-4">
            {inputObject &&
              tokenAllocation &&
              tokenAllocation?.map((token) => (
                <li key={token.address}>
                  <div className="mb-2">
                    <p className="font-medium leading-5">{token.symbol}</p>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <p>
                        Current Allocation: <span>{token.allocation}</span>
                      </p>

                      <p>
                        New Allocation:{" "}
                        <span>{inputObject[token.address]}</span>
                      </p>
                    </div>

                    <div className="flex divide-x">
                      <button
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

                      <button
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
              ))}
          </ul>

          <div className="space-y-2">
            <button
              onClick={castAdjustedVote}
              className={classNames(
                "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
                canUpdate && !hasVotedInEpoch
                  ? "bg-white text-primary"
                  : "bg-primary-300"
              )}
              disabled={!canUpdate || hasVotedInEpoch}
            >
              Cast Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
