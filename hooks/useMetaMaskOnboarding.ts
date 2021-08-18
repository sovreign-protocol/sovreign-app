import detectEthereumProvider from "@metamask/detect-provider";
import type MetaMaskOnboarding from "@metamask/onboarding";
import { useEffect, useRef, useState } from "react";

export default function useMetaMaskOnboarding() {
  const [isMetaMaskInstalled, isMetaMaskInstalledSet] = useState<boolean>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    async function checkForMetaMask() {
      const provider = await detectEthereumProvider({
        timeout: 1000,
        mustBeMetaMask: true,
      });

      if (provider) {
        isMetaMaskInstalledSet(true);
      } else {
        isMetaMaskInstalledSet(false);
      }
    }

    checkForMetaMask();
  }, []);

  const onboarding = useRef<MetaMaskOnboarding>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    async function loadOnboarding() {
      const MetaMaskOnboarding = (await import("@metamask/onboarding")).default;

      onboarding.current = new MetaMaskOnboarding();
    }

    loadOnboarding();
  }, []);

  function startOnboarding() {
    onboarding?.current?.startOnboarding();
  }

  const isWeb3Available = typeof window !== "undefined" && window?.ethereum;

  return {
    startOnboarding,
    isMetaMaskInstalled,
    isWeb3Available,
  };
}
