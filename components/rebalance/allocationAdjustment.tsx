import useTokenAllocation from "@/hooks/view/useTokenAllocation";
import { useEffect } from "react";
import { useState } from "react";
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

    inputObjectSet({ ...tokenAllocation.map((el) => el.allocation) });
  }, [tokenAllocation]);

  console.log(inputObject);

  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <VotingPower />
        </div>
        <div className="flex-1">
          <ul className="space-y-4">
            {tokenAllocation?.map((token, tokenIndex) => {
              const currentAllocation =
                (token.allocation / totalAllocation) * 100;

              return (
                <li key={tokenIndex}>
                  <div className="flex justify-between mb-2">
                    <p>{token.symbol}</p>
                  </div>

                  <div>
                    <div className="flex space-x-4">
                      <p>
                        Current: <span>{currentAllocation.toFixed(2)}</span>
                      </p>

                      <input
                        defaultValue={currentAllocation.toFixed(2)}
                        value={inputObject?.[tokenIndex]}
                        onChange={(e) => {
                          inputObjectSet((prev) => {
                            const keysToUpdate = Object.keys(prev).filter(
                              (key) => key !== token.symbol
                            );

                            const oldValueOfInput =
                              prev?.[token.symbol] ??
                              currentAllocation.toFixed(2);

                            const differenceBetweenOldAndNewValue =
                              Number(oldValueOfInput) - e.target.valueAsNumber;

                            const updatedObject = {
                              [token.symbol]: e.target.valueAsNumber,
                              [keysToUpdate[0]]:
                                differenceBetweenOldAndNewValue,
                              [keysToUpdate[1]]:
                                differenceBetweenOldAndNewValue,
                            };

                            return updatedObject;
                          });
                        }}
                        className="flex-1"
                        type="range"
                        min={0}
                        max={100}
                      />

                      <p>
                        New: <span>{inputObject?.[tokenIndex]}</span>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
