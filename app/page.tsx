"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "./api/auth/[...nextauth]/route";

export default function Home() {
  // using serverside props
  //   const data = await getServerSession(authOptions);
  //   return <main>{JSON.stringify(data)}</main>;

  // using clientside props
  const { data, status } = useSession();
  const router = useRouter();

  const loginHandler = async () => {
    router.push("/api/auth/signin");
  };
  const logoutHandler = async () => {
    await signOut();
  };
  return (
    <main>
      <div>{JSON.stringify(data)}</div>
      {status === "unauthenticated" && (
        <button onClick={loginHandler}>Login</button>
      )}
      {status === "authenticated" && (
        <button onClick={logoutHandler}>Logout</button>
      )}
    </main>
  );
}
