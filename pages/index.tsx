import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

function HomePage() {
  const { replace } = useRouter();

  useEffect(() => {
    replace("/invest");
  }, [replace]);

  return null;
}

export default HomePage;
