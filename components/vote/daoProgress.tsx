import useVotingPower from "@/hooks/view/useVotingPower";
import { commify, formatUnits } from "@ethersproject/units";
import { useMemo } from "react";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";

const THRESHOLD = 4_000_000;

export default function DAOProgress() {
  const { data: votingPower } = useVotingPower();

  const progress = useMemo(() => {
    if (typeof votingPower === "undefined") {
      return 0;
    }

    const totalStaked = parseFloat(formatUnits(votingPower.total));

    const percentage = (totalStaked / THRESHOLD) * 100;

    if (percentage > 100) {
      return 100;
    }

    return percentage;
  }, [votingPower]);

  const fmTotal = useFormattedBigNumber(votingPower?.total, 0);

  return (
    <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
      <div className="space-y-4">
        <div>
          <p className="font-medium leading-5 mb-1">DAO Progress</p>

          <p className="text-sm text-gray-300">until the DAO is activated</p>
        </div>

        <p className="text-4xl leading-none font-semibold h-9">
          {fmTotal}{" "}
          <span className="text-xl leading-none text-gray-500">/</span>{" "}
          <span className="text-xl leading-none">{commify(THRESHOLD)}</span>
        </p>

        <div
          aria-label={`${progress.toFixed(
            2
          )}% complete with funding of the DAO`}
          aria-valuenow={parseFloat(progress.toFixed(2))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${progress.toFixed(2)}%`}
          role="progressbar"
          className="w-full"
        >
          <div className="h-3 bg-primary rounded overflow-hidden">
            <div
              className="h-3 bg-indigo-500"
              style={{
                width: `${progress.toFixed(2)}%`,
              }}
            />
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
