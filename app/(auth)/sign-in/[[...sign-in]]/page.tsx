import { SignIn } from "@clerk/nextjs";
import { Sign } from "crypto";

export default function Page() {
  return <SignIn path="/sign-in" />;
}