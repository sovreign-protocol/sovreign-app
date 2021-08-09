import useContinuousTokenAllocation from "@/hooks/view/useContinuousTokenAllocation";
import classNames from "classnames";

const TOKEN_COLORS = ["bg-green-500", "bg-blue-500", "bg-purple-500"];

export default function ContinuousTokenAllocation() {
  const { data: continuousTokenAllocation } = useContinuousTokenAllocation();

  const totalAllocation =
    continuousTokenAllocation &&
    continuousTokenAllocation
      .map((token) => token.allocation)
      .reduce((prev, cur) => cur + prev);

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium leading-5 mb-2">Continuous Allocation</p>

        <p className="text-sm">Epoch ends in 2 days</p>
      </div>

      <div className="h-12 rounded w-full bg-primary flex relative overflow-hidden">
        {continuousTokenAllocation?.map((token, tokenIndex) => (
          <div
            key={token.address}
            className={classNames(
              "h-12 flex items-center pl-4",
              TOKEN_COLORS[tokenIndex]
            )}
            style={{
              width: `${(token.allocation / totalAllocation) * 100}%`,
            }}
          >
            <span className="font-bold">{token.symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
