import useTokenAllocation from "@/hooks/view/useTokenAllocation";
import classNames from "classnames";

const TOKEN_COLORS = ["bg-green-500", "bg-blue-500", "bg-purple-500"];

export default function TokenAllocation() {
  const { data: tokenAllocation } = useTokenAllocation();

  const totalAllocation =
    tokenAllocation &&
    tokenAllocation
      .map((token) => token.allocation)
      .reduce((prev, cur) => cur + prev);

  return (
    <div className="space-y-4">
      <p className="font-medium leading-5">Token Allocation</p>

      <div className="h-12 rounded w-full bg-primary flex relative overflow-hidden">
        {tokenAllocation?.map((token, tokenIndex) => {
          const percentage = `${(
            (token.allocation / totalAllocation) *
            100
          ).toFixed(2)}%`;

          return (
            <div
              key={token.address}
              className={classNames(
                "h-12 flex items-center justify-between px-4",
                TOKEN_COLORS[tokenIndex]
              )}
              style={{
                width: percentage,
              }}
            >
              <span className="font-bold">{token.symbol}</span>

              <span className="font-medium">{percentage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
