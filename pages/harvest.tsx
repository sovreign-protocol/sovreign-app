import WrappingRewardsHarvest from "@/components/harvest/wrappingRewardsHarvest";
import GovRewardsHarvest from "@/components/harvest/govRewardsHarvest";

function HarvestPage() {
  return (
    <section className="pt-8 md:pt-16">
      <div className="px-5 max-w-4xl mx-auto">
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
