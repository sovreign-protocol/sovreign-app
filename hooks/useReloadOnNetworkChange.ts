import { useEffect } from "react";
import useWeb3Store from "./useWeb3Store";

export default function useReloadOnNetworkChange() {
  const library = useWeb3Store((state) => state.library);

  useEffect(() => {
    if (!library) {
      return;
    }

    function handleNetworkEvent(newNetwork, oldNetwork) {
      console.log({ newNetwork, oldNetwork });
    }

    library.on("network", handleNetworkEvent);

    return () => {
      library.off("network", handleNetworkEvent);
    };
  }, [library]);
}
