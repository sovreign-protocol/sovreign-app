export const __DEV__ = process.env.NODE_ENV !== "production";

export const INFURA_ID = "TODO";

export const CONTRACT_ADDRESSES: Record<
  "BasketBalancer" | "PoolRouter",
  Record<1 | 4, string>
> = {
  BasketBalancer: {
    1: "TODO",
    4: "0x38c2FA98Ba56fBF553821f55084737181A4c6635",
  },
  PoolRouter: {
    1: "TODO",
    4: "TODO",
  },
};
