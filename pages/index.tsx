import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/invest");
  }, []);

  return null;
}

export default Home;
