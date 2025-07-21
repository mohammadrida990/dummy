"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FirebaseError } from "firebase/app";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/auth/signin");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        console.log(err);
        setError(err.code.split("/")[1]);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center p-4 sm:h-screen">
      <h1 className="mb-10 text-3xl text-center">Sign Up</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mx-auto p-8 border border-gray-300 rounded-2xl w-full max-w-md">
        <form>
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
              onClick={handleSignUp}
              type="button"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-md focus:outline-none w-full font-medium text-white text-sm tracking-wider cursor-pointer"
            >
              Create an account
            </button>
          </div>

          <p className="mt-6 text-slate-600 text-sm text-center">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="ml-1 font-medium text-blue-600 hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
