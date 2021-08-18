import DepositPool from "@/components/farming/depositPool";
import PoolSelect from "@/components/farming/poolSelect";
import WithdrawPool from "@/components/farming/withdrawPool";
import { FarmingPool } from "@/constants/farming";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { useState } from "react";

const TAB_KEYS = {
  DEPOSIT: "Deposit",
  WITHDRAW: "Withdraw",
};

const tabPanelClassNames = classNames("p-2 focus:outline-none");

const tabClassNames = ({ selected }: { selected: boolean }) =>
  classNames(
    "w-full py-2.5 text-sm leading-5 font-medium rounded-lg",
    "focus:outline-none focus:ring-4",
    selected
      ? "bg-white shadow text-primary"
      : "text-gray-300 hover:bg-primary-300 hover:text-white"
  );

function FarmingView() {
  const [pool, poolSet] = useState<FarmingPool>();

  return (
    <section className="pt-8 md:pt-16 pb-8">
      <div className="px-5 max-w-lg mx-auto mb-4">
        <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10">
          <div className="p-2">
            <PoolSelect value={pool} onChange={poolSet} />
          </div>

          <div className="h-px w-full bg-primary-300" />

          <Tab.Group>
            <Tab.List className="flex space-x-1 p-2">
              <Tab key={TAB_KEYS.DEPOSIT} className={tabClassNames}>
                {TAB_KEYS.DEPOSIT}
              </Tab>

              <Tab key={TAB_KEYS.WITHDRAW} className={tabClassNames}>
                {TAB_KEYS.WITHDRAW}
              </Tab>
            </Tab.List>

            <div className="h-px w-full bg-primary-300" />

            <Tab.Panels className="p-2">
              <Tab.Panel key={TAB_KEYS.DEPOSIT} className={tabPanelClassNames}>
                <DepositPool pool={pool} />
              </Tab.Panel>

              <Tab.Panel key={TAB_KEYS.WITHDRAW} className={tabPanelClassNames}>
                <WithdrawPool pool={pool} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  );
}

export default FarmingView;
