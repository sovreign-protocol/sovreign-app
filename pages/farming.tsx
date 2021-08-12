import NumericalInput from "@/components/numericalInput";
import { MaxUint256, TOKEN_ADDRESSES } from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useTokenAllowance from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import { Listbox, Tab } from "@headlessui/react";
import classNames from "classnames";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { ChevronDown } from "react-feather";
import toast from "react-hot-toast";

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
  symbol: string;
};

const POOLS: Pool[] = [
  {
    address: "0x",
    name: "REIGN/ETH SLP",
    symbol: "REIGN_ETH",
  },
  {
    address: "0x",
    name: "SOV/USDC SLP",
    symbol: "SOV_USDC",
  },
];

function FarmingPage() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const depositInput = useInput();
  const withdrawInput = useInput();

  const [pool, poolSet] = useState<Pool>();

  const SPENDER_ADDRESS = "TODO";

  const poolTokenContract = useERC20(
    TOKEN_ADDRESSES?.[pool?.symbol]?.[chainId]
  );

  console.log(poolTokenContract);

  const { data: poolTokenBalance } = useTokenBalance(
    account,
    TOKEN_ADDRESSES[pool?.symbol]?.[chainId]
  );

  const { data: poolTokenAllowance, mutate: poolTokenAllowanceMutate } =
    useTokenAllowance(
      TOKEN_ADDRESSES[pool?.symbol]?.[chainId],
      account,
      SPENDER_ADDRESS
    );

  const poolTokenNeedsApproval = useMemo(() => {
    if (!!poolTokenAllowance && depositInput.hasValue) {
      return poolTokenAllowance.lt(parseUnits(depositInput.value));
    }

    return;
  }, [poolTokenAllowance, depositInput.hasValue, depositInput.value]);

  const fmPoolTokenBalance = useFormattedBigNumber(poolTokenBalance);

  async function approvePoolToken() {
    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse = await poolTokenContract.approve(
        SPENDER_ADDRESS,
        MaxUint256
      );

      toast.loading(`Approve ${pool.symbol}`, { id: _id });

      await transaction.wait();

      toast.success(`Approve ${pool.symbol}`, { id: _id });

      poolTokenAllowanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  async function depositPoolToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  async function withdrawPoolToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

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
                <form onSubmit={depositPoolToken} method="POST">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h2 className="font-medium leading-5">
                        Deposit {pool?.symbol}
                      </h2>
                    </div>

                    <div className="flex space-x-4">
                      <div>
                        <div className="mb-2">
                          <div
                            className={classNames(
                              "relative inline-flex py-2 pl-2 pr-3 text-left rounded-xl cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 items-center space-x-2 bg-primary"
                            )}
                          >
                            <img
                              alt={"REIGN"}
                              className="rounded-full"
                              height={24}
                              src={`/tokens/REIGN.png`}
                              width={24}
                            />

                            <span className="block truncate font-medium">
                              {pool?.symbol}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 h-5">
                          {true ? (
                            <span>{`Balance: ${fmPoolTokenBalance} ${pool?.symbol}`}</span>
                          ) : null}
                        </p>
                      </div>

                      <div className="flex-1">
                        <label className="sr-only" htmlFor="deposit">
                          Enter amount of {pool?.symbol} to deposit
                        </label>

                        <NumericalInput
                          id="deposit"
                          name="deposit"
                          required
                          {...depositInput.valueBind}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {poolTokenNeedsApproval && (
                        <button
                          type="button"
                          className="p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4 bg-white text-primary"
                          onClick={approvePoolToken}
                        >
                          {`Approve Sovreign To Spend Your ${pool.symbol}`}
                        </button>
                      )}

                      <button
                        className={classNames(
                          "p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4",
                          depositInput.hasValue &&
                            !!pool &&
                            !poolTokenNeedsApproval
                            ? "bg-white text-primary"
                            : "bg-primary-300"
                        )}
                        disabled={
                          !(depositInput.hasValue && !!pool) ||
                          poolTokenNeedsApproval
                        }
                        type="submit"
                      >
                        {depositInput.hasValue && !!pool
                          ? "Deposit"
                          : "Enter an amount"}
                      </button>
                    </div>
                  </div>
                </form>
              </Tab.Panel>

              <Tab.Panel key={TAB_KEYS.WITHDRAW} className={tabPanelClassNames}>
                <form onSubmit={withdrawPoolToken} method="POST">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h2 className="font-medium leading-5">
                        Withdraw {pool?.symbol}
                      </h2>
                    </div>

                    <div className="flex space-x-4">
                      <div>
                        <div className="mb-2">
                          <div
                            className={classNames(
                              "relative inline-flex py-2 pl-2 pr-3 text-left rounded-xl cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 items-center space-x-2 bg-primary"
                            )}
                          >
                            <img
                              alt={"REIGN"}
                              className="rounded-full"
                              height={24}
                              src={`/tokens/REIGN.png`}
                              width={24}
                            />

                            <span className="block truncate font-medium">
                              {pool?.symbol}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 h-5">
                          {true ? (
                            <span>{`Available: ${0.0} ${pool?.symbol}`}</span>
                          ) : null}
                        </p>
                      </div>

                      <div className="flex-1">
                        <label className="sr-only" htmlFor="withdraw">
                          Enter amount of {pool?.symbol} to withdraw
                        </label>

                        <NumericalInput
                          id="withdraw"
                          name="withdraw"
                          required
                          {...withdrawInput.valueBind}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        className={classNames(
                          "p-4 w-full rounded-md text-lg font-medium leading-5 focus:outline-none focus:ring-4",
                          false ? "bg-white text-primary" : "bg-primary-300"
                        )}
                        disabled={true}
                        type="submit"
                      >
                        {false ? "Withdraw" : "Enter an amount"}
                      </button>
                    </div>
                  </div>
                </form>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  );
}

export default FarmingPage;
