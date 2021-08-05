export const __DEV__ = process.env.NODE_ENV !== "production";

export const INFURA_ID = "TODO";

type Networks = 1 | 4;

type ContractNames =
  | "BasketBalancer"
  | "PoolRouter"
  | "WrappingRewards"
  | "ReignFacet"
  | "GovRewards";

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
    4: "0x89e0da559126aa5ca804d4c7c30715522031b92b",
  },
  WrappingRewards: {
    1: "TODO",
    4: "0x855dD13AbAb0e891952Fd973634cefBb1c5AAbAC",
  },
  ReignFacet: {
    1: "TODO",
    4: "0xc31cb4f82f178ea0377492144035c48de119a4f8",
  },
  GovRewards: {
    1: "TODO",
    4: "0x923CA1b060577e8BcDF6d82A9C4109CEECCc1122",
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
  "0x3a85973fd194c9fb966882fee7b11481c38344fb": "sXAU",
};

export const MaxUint256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
