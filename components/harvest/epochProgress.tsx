import useTimer from "@/hooks/useTimer";
import useEpochDates from "@/hooks/view/useEpochDates";
import Panel from "../panel";

export default function EpochProgress() {
  const { data: epochDates } = useEpochDates();

  const timer = useTimer(epochDates?.endDate * 1000);

  return (
    <Panel>
      <div className="mb-4">
        <p className="font-medium leading-5 mb-1">Time until next epoch</p>

        <p className="text-sm text-gray-300">
          Harvestable Rewards are calculated at the end of each epoch
        </p>
      </div>

      <p className="text-4xl leading-none font-semibold h-9 mb-4">
        {epochDates && timer ? (
          <>
            <span className="mr-px">{String(timer.dd)}</span>
            <span className="text-xl font-medium pr-3">d</span>
            <span className="mr-px">{String(timer.hh)}</span>
            <span className="text-xl font-medium pr-3">h</span>
            <span className="mr-px">{String(timer.mm)}</span>
            <span className="text-xl font-medium pr-3">m</span>
            <span className="mr-px">{String(timer.ss)}</span>
            <span className="text-xl font-medium">s</span>
          </>
        ) : null}
      </p>

      <div
        aria-label={`${epochDates?.relative} until next epoch`}
        aria-valuenow={parseFloat(epochDates?.progress.toFixed(2))}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${epochDates?.progress.toFixed(2)}%`}
        role="progressbar"
        className="w-full"
      >
        <div className="h-3 bg-primary rounded overflow-hidden">
          <div
            className="h-3 bg-indigo-500"
            style={{
              width: epochDates ? `${epochDates.progress.toFixed(2)}%` : "0%",
            }}
          />
        </div>
      </div>
    </Panel>
  );
}

export function EpochProgressShort() {
  const { data: epochDates } = useEpochDates();

  const timer = useTimer(epochDates?.endDate * 1000);

  return (
    <Panel className="flex-1">
      <p className="font-medium leading-5 mb-4">Time until next epoch</p>

      <div className="h-12">
        <p className="text-2xl leading-none font-semibold h-6 mb-3">
          {epochDates && timer ? (
            <>
              <span className="mr-px">{String(timer.dd)}</span>
              <span className="text-xl font-medium pr-3">d</span>
              <span className="mr-px">{String(timer.hh)}</span>
              <span className="text-xl font-medium pr-3">h</span>
              <span className="mr-px">{String(timer.mm)}</span>
              <span className="text-xl font-medium pr-3">m</span>
              <span className="mr-px">{String(timer.ss)}</span>
              <span className="text-xl font-medium">s</span>
            </>
          ) : null}
        </p>

        <div
          aria-label={`${epochDates?.relative} until next epoch`}
          aria-valuenow={parseFloat(epochDates?.progress.toFixed(2))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${epochDates?.progress.toFixed(2)}%`}
          role="progressbar"
          className="w-full"
        >
          <div className="h-3 bg-primary rounded overflow-hidden">
            <div
              className="h-3 bg-indigo-500"
              style={{
                width: epochDates ? `${epochDates.progress.toFixed(2)}%` : "0%",
              }}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
