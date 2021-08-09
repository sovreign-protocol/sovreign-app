import useTimer from "@/hooks/useTimer";
import useEpochDates from "@/hooks/view/useEpochDates";

export default function EpochProgress() {
  const { data: epochDates } = useEpochDates();

  const timer = useTimer(epochDates?.endDate * 1000);

  return (
    <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
      <p className="font-medium leading-5 mb-4">Time until Next Epoch</p>

      <p className="text-4xl leading-none font-semibold h-9 mb-4">
        {epochDates && timer ? (
          <>
            <span className="mr-px">{timer.dd}</span>
            <span className="text-xl font-medium pr-3">d</span>
            <span className="mr-px">{timer.hh}</span>
            <span className="text-xl font-medium pr-3">h</span>
            <span className="mr-px">{timer.mm}</span>
            <span className="text-xl font-medium pr-3">m</span>
            <span className="mr-px">{timer.ss}</span>
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
            className="h-3 bg-green-500"
            style={{
              width: epochDates ? `${epochDates.progress.toFixed(2)}%` : "0%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
