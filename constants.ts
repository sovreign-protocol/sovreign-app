export const __DEV__ = process.env.NODE_ENV !== "production";

export const INFURA_ID = "TODO";

type Networks = 1 | 4;

type ContractNames = "PoolRouter" | "WrappingRewards" | "SOV_ERC20";

type TokenNames = "SOV";

export const CONTRACT_ADDRESSES: Record<
  ContractNames,
  Record<Networks, string>
> = {
  PoolRouter: {
    1: "TODO",
    4: "0x5a6C7629dB81BEf850a9d181A50F1a35CaEFbc9b",
  },
  SOV_ERC20: {
    1: "TODO",
    4: "0x2cfde3d46b0e075a5a2f06f5f276853b95098171",
  },
  WrappingRewards: {
    1: "TODO",
    4: "TODO",
  },
};

export const TOKEN_ADDRESSES: Record<TokenNames, Record<Networks, string>> = {
  SOV: {
    1: "TODO",
    4: "0x2cfde3d46b0e075a5a2f06f5f276853b95098171",
  },
};

export const TOKEN_NAMES_BY_ADDRESS: Record<string, string> = {
  "0xad36b2c064cc743daca00a134efc845dfd073f3c": "DAI",
  "0x354f3750d24c294c511027bd0ecb66047338f887": "USDC",
  "0xcfed3caef5870cf7a95ce6d9ec86b2570db238bc": "WBTC",
};

export const MaxUint256 = Number.MAX_SAFE_INTEGER;
