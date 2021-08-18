import { __DEV__ } from "@/helpers";
import useWeb3Store from "@/hooks/useWeb3Store";
import normalizeChainId from "@/utils/normalizeChainId";
import detectEthereumProvider from "@metamask/detect-provider";
import type {
  EIP1193Provider,
  ProviderAccounts,
  ProviderChainId,
  ProviderRpcError,
} from "eip1193-provider";

export class NoEthereumProviderError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "No Ethereum provider was found on window.ethereum.";
  }
}

export class UnsupportedChainIdError extends Error {
  public constructor(
    unsupportedChainId: number,
    supportedChainIds?: readonly number[]
  ) {
    super();
    this.name = this.constructor.name;
    this.message = `Unsupported chain id: ${unsupportedChainId}. Supported chain ids are: ${supportedChainIds}.`;
  }
}

export default class MetaMaskConnector {
  readonly supportedChainIds: number[];

  constructor({ supportedChainIds }: { supportedChainIds: number[] }) {
    this.supportedChainIds = supportedChainIds;
  }

  public activate = async () => {
    if (__DEV__) {
      console.log("[activate]");
    }

    const provider = (await detectEthereumProvider()) as EIP1193Provider;

    if (typeof provider === "undefined") {
      throw new NoEthereumProviderError();
    }

    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });

    const account = accounts[0];

    const _chainId = await provider.request({ method: "eth_chainId" });

    const chainId = normalizeChainId(_chainId as string);

    if (!!this.supportedChainIds && !this.supportedChainIds.includes(chainId)) {
      throw new UnsupportedChainIdError(chainId, this.supportedChainIds);
    }

    const Web3Provider = (await import("@ethersproject/providers"))
      .Web3Provider;

    const library = new Web3Provider(provider);

    library.pollingInterval = 12000;

    useWeb3Store.setState({
      connector: this,
      chainId: chainId,
      account: account,
      library: library,
    });

    if (provider.on) {
      provider.on("chainChanged", this.handleChainChanged);
      provider.on("accountsChanged", this.handleAccountsChanged);
      provider.on("disconnect", this.handleDisconnect);
    }
  };

  private handleChainChanged = (chainId: ProviderChainId) => {
    if (__DEV__) {
      console.log("[handleChainChanged]", chainId);
    }

    window.location.reload();

    try {
      const _chainId = normalizeChainId(chainId);

      if (
        !!this.supportedChainIds &&
        !this.supportedChainIds.includes(_chainId)
      ) {
        this.deactivate();

        useWeb3Store.getState().reset();

        throw new UnsupportedChainIdError(_chainId, this.supportedChainIds);
      }

      useWeb3Store.setState({
        chainId: _chainId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  private handleAccountsChanged = (accounts: ProviderAccounts) => {
    if (__DEV__) {
      console.log("[handleAccountsChanged]", accounts);
    }

    useWeb3Store.setState({
      account: accounts[0],
    });
  };

  private handleDisconnect = (error: ProviderRpcError) => {
    if (__DEV__) {
      console.log("[handleDisconnect]", error);
    }

    this.deactivate();
  };

  public deactivate = () => {
    if (__DEV__) {
      console.log("[deactivate]");
    }

    if ((window as any).ethereum && (window as any).ethereum.removeListener) {
      (window as any).ethereum.removeListener(
        "chainChanged",
        this.handleChainChanged
      );
      (window as any).ethereum.removeListener(
        "accountsChanged",
        this.handleAccountsChanged
      );
      (window as any).ethereum.removeListener(
        "disconnect",
        this.handleDisconnect
      );
    }
  };

  public isAuthorized = async () => {
    if (!window.ethereum) {
      return false;
    }

    try {
      const provider = (await detectEthereumProvider()) as EIP1193Provider;

      return await provider
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            return true;
          } else {
            return false;
          }
        });
    } catch {
      return false;
    }
  };
}

export const injected = new MetaMaskConnector({
  supportedChainIds: [1, 4],
});
