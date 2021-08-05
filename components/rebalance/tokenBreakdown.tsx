import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import classNames from "classnames";
import { Divide } from "react-feather";

const TOKEN_COLORS = ["bg-green-500", "bg-blue-500", "bg-purple-500"];

export default function TokenBreakdown() {
  const { data: poolTokens } = useGetPoolTokens();

  return (
    <div className="space-y-4">
      <p className="font-medium leading-5">Token Distribution</p>

      <div className="h-12 rounded w-full bg-primary flex relative overflow-hidden">
        {poolTokens?.map((token, tokenIndex) => (
          <div
            key={token.address}
            className={classNames(
              "h-12 flex-1 flex items-center pl-4",
              TOKEN_COLORS[tokenIndex]
            )}
          >
            <span className="font-bold">{token.symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
