import { useRouter } from "next/router";
import Signup from "@/components/authentication/Signup";

export default function Page() {
  const router = useRouter();
  const { type } = router.query;

  return <Signup type={type} />;
}
