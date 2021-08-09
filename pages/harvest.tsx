import WrappingRewardsHarvest from "@/components/harvest/wrappingRewardsHarvest";
import GovRewardsHarvest from "@/components/harvest/govRewardsHarvest";
import { useEpochDatesGovRewards } from "@/hooks/view/useEpochDates";

function HarvestPage() {
  const { data: epochDates } = useEpochDatesGovRewards();

  return (
    <section className="pt-8 md:pt-16 pb-8">
      <div className="px-5 max-w-4xl mx-auto">
        <div className="mb-4">
          <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
            <p className="font-medium leading-5 mb-4">Time until next epoch</p>

            <p className="text-2xl leading-none font-semibold mb-4">
              {epochDates?.relative}
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
                  style={{ width: `${epochDates?.progress.toFixed(2)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
          <div className="flex-1">
            <WrappingRewardsHarvest />
          </div>

          <div className="flex-1">
            <GovRewardsHarvest />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HarvestPage;
