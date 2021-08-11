import { Listbox, Tab } from "@headlessui/react";
import classNames from "classnames";
import { useState } from "react";
import { ChevronDown } from "react-feather";

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

type Pool = {
  address: string;
  name: string;
};

const POOLS: Pool[] = [
  { address: "0x", name: "Uniswap REIGN/WETH" },
  { address: "0x", name: "Uniswap SOV/USDC" },
];

function FarmingPage() {
  const [pool, poolSet] = useState<Pool>();

  return (
    <section className="pt-8 md:pt-16 pb-8">
      <div className="px-5 max-w-lg mx-auto mb-4">
        <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10">
          <div className="p-2">
            <Listbox value={pool} onChange={poolSet}>
              <div className="relative">
                <Listbox.Button
                  className={classNames(
                    "relative py-2 pr-10 text-left rounded-lg cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 flex w-full items-center space-x-2",
                    pool ? "bg-primary pl-2" : "bg-white text-primary pl-4"
                  )}
                >
                  <span className="block truncate font-medium">
                    {pool ? pool.name : "Select a pool"}
                  </span>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={20} aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Listbox.Options className="absolute w-full max-h-60 mt-2 overflow-auto bg-primary-300 ring-1 ring-inset ring-white ring-opacity-20 rounded-lg focus:outline-none p-1">
                  {POOLS.map((_pool, _poolIndex) => (
                    <Listbox.Option
                      key={_poolIndex}
                      className={({ active }) =>
                        classNames(
                          "cursor-default select-none relative p-2 rounded-md text-white",
                          active ? "bg-white/[0.10]" : ""
                        )
                      }
                      value={_pool}
                      disabled={_pool === pool}
                    >
                      {({ selected }) => (
                        <div
                          className={classNames(
                            "flex justify-between",
                            selected ? "opacity-50" : ""
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={classNames(
                                selected ? "font-medium" : "font-normal",
                                "block truncate leading-5"
                              )}
                            >
                              {_pool.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
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
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                  cupiditate dolores delectus incidunt, doloremque laboriosam
                  ducimus tempore harum maiores sed pariatur dolorem commodi
                  quis labore est nesciunt placeat ut eos!
                </p>
              </Tab.Panel>

              <Tab.Panel key={TAB_KEYS.WITHDRAW} className={tabPanelClassNames}>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                  cupiditate dolores delectus incidunt, doloremque laboriosam
                  ducimus tempore harum maiores sed pariatur dolorem commodi
                  quis labore est nesciunt placeat ut eos!
                </p>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  );
}

export default FarmingPage;
