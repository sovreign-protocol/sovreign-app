export const __DEV__ = process.env.NODE_ENV !== "production";

export const INFURA_ID = "TODO";

type Networks = 1 | 4;

type ContractNames =
  | "BasketBalancer"
  | "PoolRouter"
  | "WrappingRewards"
  | "ReignFacet";

type TokenNames = "SOV" | "REIGN";

export const CONTRACT_ADDRESSES: Record<
  ContractNames,
  Record<Networks, string>
> = {
  BasketBalancer: {
    1: "TODO",
    4: "0xcab995251e50d310a4a924378c9ecde5032d75e0",
  },
  PoolRouter: {
    1: "TODO",
    4: "0xa7f2c3bfe3e9e51eab595c44cd3cd45a4e2ae2df",
  },
  WrappingRewards: {
    1: "TODO",
    4: "0x20CF7b7F003A32Fa7169ecEeB435ee1af5eE6ED1",
  },
  ReignFacet: {
    1: "TODO",
    4: "0xc31cb4f82f178ea0377492144035c48de119a4f8",
  },
};

export const TOKEN_ADDRESSES: Record<TokenNames, Record<Networks, string>> = {
  SOV: {
    1: "TODO",
    4: "0xfbebceb1fc57b05b2bd845d936ea23ae60861584",
  },
  REIGN: {
    1: "TODO",
    4: "0x08188FC7d8F552d1D8F8d2743404e9E728425AE1",
  },
};

export const TOKEN_NAMES_BY_ADDRESS: Record<string, string> = {
  "0x712863c3ad98ef4319133b8646d51383700cb37b": "sCHF",
  "0xf65c93902ecc4c7979e92ed2cca01421e8021f77": "sBTC",
  "0x3a85973fd194c9fb966882fee7b11481c38344fb": "sGLD",
};

export const MaxUint256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
