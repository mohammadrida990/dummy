"use client";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await fetch("/api/session", { method: "DELETE" });
      router.push("/auth/signin");
    } catch (err) {
      setError(`Failed to sign out, ${err}`);
    }
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl">
        Welcome,{" "}
        <span className="text-sky-600 text-4xl">
          {user?.displayName || user?.email}
        </span>
      </h1>

      <div className="mt-5">
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Sign Out
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
