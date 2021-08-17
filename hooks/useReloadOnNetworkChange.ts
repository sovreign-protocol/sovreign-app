import type { Network } from "@ethersproject/providers";
import { useEffect } from "react";
import useWeb3Store from "./useWeb3Store";

export default function useReloadOnNetworkChange() {
  const library = useWeb3Store((state) => state.library);

  useEffect(() => {
    if (!library) {
      return;
    }

    function handleOnNetwork(_: Network, old: Network) {
      if (old) {
        window.location.reload();
      }
    }

    library.on("network", handleOnNetwork);

    return () => {
      library.off("network", handleOnNetwork);
    };
  }, [library]);
}
