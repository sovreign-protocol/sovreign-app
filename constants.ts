export const __DEV__ = process.env.NODE_ENV !== "production";

export const INFURA_ID = "TODO";

type Networks = 1 | 4;

type ContractNames = "PoolRouter" | "SOV_ERC20";

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
};

export const TOKEN_ADDRESSES: Record<TokenNames, Record<Networks, string>> = {
  SOV: {
    1: "TODO",
    4: "0x2cfde3d46b0e075a5a2f06f5f276853b95098171",
  },
};
