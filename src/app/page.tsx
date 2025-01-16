import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      Click <Link href="/documents/123">here</Link> to go to document id
    </div>
  );
}

export default Home;