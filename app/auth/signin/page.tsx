"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FirebaseError } from "firebase/app";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await userCredential.user.getIdToken();

      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.code.split("/")[1]);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      router.push("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center p-4 sm:h-screen">
      <h1 className="mb-10 text-3xl text-center">Sign In</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex flex-col mx-auto p-8 border border-gray-300 rounded-2xl w-full max-w-md">
        <form onSubmit={handleSignIn}>
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-slate-900 text-sm">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                name="email"
                className="bg-white px-4 py-3 border border-gray-300 rounded-md outline-blue-500 w-full text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-900 text-sm">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white px-4 py-3 border border-gray-300 rounded-md outline-blue-500 w-full text-slate-900 text-sm"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="mt-12">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-md focus:outline-none w-full font-medium text-white text-sm tracking-wider cursor-pointer"
            >
              Login
            </button>
          </div>

          <p className="mt-6 text-slate-600 text-sm text-center">
            Dont have an account?{" "}
            <Link
              href="/auth/signup"
              className="ml-1 font-medium text-blue-600 hover:underline"
            >
              Signup here
            </Link>
          </p>
        </form>

        <div className="flex justify-end w-full">
          <button
            title="Sign in with Google"
            onClick={handleGoogleSignIn}
            className="p-2 border border-gray-500 rounded-full text-white cursor-pointer"
          >
            <FcGoogle size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}
