import useHasVotedInEpoch from "@/hooks/view/useHasVotedInEpoch";
import useMaxDelta from "@/hooks/view/useMaxDelta";
import useTokenAllocation from "@/hooks/view/useTokenAllocation";
import classNames from "classnames";
import { useEffect, useState } from "react";
import VotingPower from "./votingPower";

export default function AllocationAdjustment() {
  const { data: tokenAllocation } = useTokenAllocation();

  const totalAllocation =
    tokenAllocation &&
    tokenAllocation
      .map((token) => token.allocation)
      .reduce((prev, cur) => cur + prev);

  const [inputObject, inputObjectSet] = useState<Record<number, number>>();

  useEffect(() => {
    if (typeof tokenAllocation === "undefined") {
      return;
    }

    inputObjectSet({
      ...tokenAllocation.map((el) =>
        parseFloat(((el.allocation / totalAllocation) * 100).toFixed(2))
      ),
    });
  }, [tokenAllocation]);

  const { data: hasVotedInEpoch } = useHasVotedInEpoch();

  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <VotingPower />
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <ul className="space-y-4">
              {tokenAllocation?.map((token, tokenIndex) => (
                <TokenAdjust
                  key={tokenIndex}
                  token={token}
                  totalAllocation={totalAllocation}
                />
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className={classNames(
                "px-4 py-2 w-full rounded-md font-medium focus:outline-none focus:ring-4",
                !hasVotedInEpoch ? "bg-white text-primary" : "bg-primary-300"
              )}
              disabled={hasVotedInEpoch}
            >
              Cast Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenAdjust({ token, totalAllocation }) {
  {
    const [value, valueSet] = useState<number>(token.allocation);

    const { data: delta } = useMaxDelta();

    return (
      <li>
        <div className="flex justify-between mb-2">
          <p>{token.symbol}</p>
        </div>

        <div className="flex justify-between mb-2">
          <p>
            Current: <span>{value}</span>
          </p>

          <button
            onClick={() =>
              valueSet((prev) => {
                if (prev >= token.allocation + delta) return prev;

                return prev + 0.5;
              })
            }
            className="h-8 w-12 bg-primary"
          >
            +
          </button>

          <button
            onClick={() =>
              valueSet((prev) => {
                if (prev <= token.allocation - delta) return prev;

                return prev - 0.5;
              })
            }
            className="h-8 w-12 bg-primary"
          >
            -
          </button>

          {/* <p>
            New: <span>{inputObject?.[tokenIndex]}</span>
          </p> */}
        </div>

        {/* <div className="flex">
          <input
            value={inputObject?.[tokenIndex]}
            onChange={handleOnChange}
            className="flex-1"
            type="range"
            min={0}
            max={100}
          />
        </div> */}
      </li>
    );
  }
}
