import { SupportedChainId } from "./chains";

export const EPOCH_DURATION = 604800;

/**
 * Will be this value for the next two years as of August 16, 2021
 */
export const EPOCH_REWARDS = 2403846.153;

/**
 * Will be this value for the next two years as of August 16, 2021
 */
export const LP_EPOCH_REWARDS = 96153.84;

export const DAO_THRESHOLD = {
  [SupportedChainId.MAINNET]: 15_000_000,
  [SupportedChainId.RINKEBY]: 4_000_000,
};

export const MaxUint256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export const MIN_INPUT_VALUE = 0.00000000000000001;
