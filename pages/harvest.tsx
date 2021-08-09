import EpochProgress from "@/components/harvest/epochProgress";
import GovRewardsHarvest from "@/components/harvest/govRewardsHarvest";
import WrappingRewardsHarvest from "@/components/harvest/wrappingRewardsHarvest";

function HarvestPage() {
  return (
    <section className="pt-8 md:pt-16 pb-8">
      <div className="px-5 max-w-4xl mx-auto">
        <div className="mb-4">
          <EpochProgress />
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
