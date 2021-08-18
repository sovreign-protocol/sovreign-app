import { SupportedChainId } from "./chains";

export enum ContractNames {
  BASKET_BALANCER = "BasketBalancer",
  POOL_ROUTER = "PoolRouter",
  WRAPPING_REWARDS = "WrappingRewards",
  REIGN_FACET_PROXY = "ReignFacetProxy",
  GOV_REWARDS = "GovRewards",
  LP_REWARDS_SOV_USDC = "LPRewardsSOVUSDC",
  LP_REWARDS_REIGN_WETH = "LPRewardsREIGNWETH",
  STAKING = "Staking",
  REIGN_DAO = "ReignDAO",
  SOV_WRAPPER = "SovWrapper",
}

type AddressMap = Record<SupportedChainId, string>;

type ContractAddresses = Record<ContractNames, AddressMap>;

export const CONTRACT_ADDRESSES: ContractAddresses = {
  [ContractNames.BASKET_BALANCER]: {
    [SupportedChainId.MAINNET]: "0x5af2c9a84b6dc6b44a4d318df75a7b71d65f3886",
    [SupportedChainId.RINKEBY]: "0x349884021b0df3d50c07a08edbe171789fd3c8bb",
  },
  [ContractNames.POOL_ROUTER]: {
    [SupportedChainId.MAINNET]: "0xb59008414bc3087229d3cd09537946081b74f4cd",
    [SupportedChainId.RINKEBY]: "0xdd87fcefe89c598d835b412009f2f4f9209753cd",
  },
  [ContractNames.WRAPPING_REWARDS]: {
    [SupportedChainId.MAINNET]: "0x16d01a143fb54bc01e1c5a63f4bd26d246fe15cb",
    [SupportedChainId.RINKEBY]: "0x8635785602403fe2291127bf0a2f15f2b726ab9e",
  },
  [ContractNames.REIGN_FACET_PROXY]: {
    [SupportedChainId.MAINNET]: "0x456fb11ea859b8f1e128063cb949ed80f12afce2",
    [SupportedChainId.RINKEBY]: "0xc1660f2af8d7e6f20598e18c752a955b23cf564e",
  },
  [ContractNames.GOV_REWARDS]: {
    [SupportedChainId.MAINNET]: "0xfe1e7c7210460CeA3A4A49AeAD81443bF6e60A73",
    [SupportedChainId.RINKEBY]: "0x9a549a0704bae811128877d247812ede48095192",
  },
  [ContractNames.LP_REWARDS_REIGN_WETH]: {
    [SupportedChainId.MAINNET]: "0x8Da96eE3D3302628C367a5817F50Ea23392cbD7B",
    [SupportedChainId.RINKEBY]: "0x4cdf326f0cecf20c1b759c60590839e92e1b4d29",
  },
  [ContractNames.LP_REWARDS_SOV_USDC]: {
    [SupportedChainId.MAINNET]: "0x258dBb646aD8C2eE74923b2607363B6C8BEe371C",
    [SupportedChainId.RINKEBY]: "0x04f47aa96c1f2018e7cd6df7b07b55d1c57cdaf4",
  },
  [ContractNames.STAKING]: {
    [SupportedChainId.MAINNET]: "0xC23C1A1Cc094B436Ea0740aB53C9804Df6ec2141",
    [SupportedChainId.RINKEBY]: "0x5faf8c61a65670c9472e6ef909195a76104c6356",
  },
  [ContractNames.REIGN_DAO]: {
    [SupportedChainId.MAINNET]: "0xde809bbe8fb348581d4c913393e0ad456002d591",
    [SupportedChainId.RINKEBY]: "0x78500ee25f607ffc906cccd27077f15f76c01785",
  },
  [ContractNames.SOV_WRAPPER]: {
    [SupportedChainId.MAINNET]: "0xa7217d1b7710e03051519bf7a114dcca8e8868ca",
    [SupportedChainId.RINKEBY]: "0xbfa9ea3b1556687df2e9965ffef84f28911f8a8f",
  },
};

export const BALANCER_POOL_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: "0x3029c3763d4b61B255B5EEa5A506CB2f080487A7",
  [SupportedChainId.RINKEBY]: "0x1f4D666b204B0282fBe85EAb9231B13B50A03B91",
};
