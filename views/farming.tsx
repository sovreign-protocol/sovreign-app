import DepositPool from "@/components/farming/depositPool";
import PoolSelect from "@/components/farming/poolSelect";
import WithdrawPool from "@/components/farming/withdrawPool";
import Panel from "@/components/panel";
import { tabClassNames } from "@/components/tabs";
import { FarmingPool } from "@/constants/farming";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { useState } from "react";

const TAB_KEYS = {
  DEPOSIT: "Deposit",
  WITHDRAW: "Withdraw",
};

const tabPanelClassNames = classNames("p-2 focus:outline-none");

function FarmingView() {
  const [pool, poolSet] = useState<FarmingPool>();

  return (
    <section className="sm:pt-8 md:pt-16 pb-8 text-white">
      <div className="px-5 max-w-lg mx-auto mb-4">
        <Panel padding={false}>
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
        </Panel>
      </div>
    </section>
  );
}

export default FarmingView;
