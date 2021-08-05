import SOVHarvest from "@/components/harvest/sovHarvest";
import REIGNHarvest from "@/components/harvest/reignHarvest";

function HarvestPage() {
  return (
    <section className="pt-8 md:pt-16">
      <div className="px-5 max-w-4xl mx-auto">
        <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
          <div className="flex-1">
            <SOVHarvest />
          </div>

          <div className="flex-1">
            <REIGNHarvest />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HarvestPage;
