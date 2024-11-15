"use client";
import Image from "next/image";
import logoKabCianjur from "@/assets/logo cianjur.png"; // Update with correct path
import logoBPBD from "@/assets/bpbd logo.png"; // Update with correct path
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set Content-Type header
          },
        body: JSON.stringify({ email, password }),
      });

      console.log(response)

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("token", token);

      router.push("/admin/recap-rnr");
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-evenly mb-4">
          <Image src={logoKabCianjur} alt="Logo Cianjur" width={70} height={70} />
          <Image src={logoBPBD} alt="BPBD Logo" width={70} height={70} />
        </div>
        <h1 className="text-3xl font-bold text-center mb-4">LOGIN</h1>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="flex w-full justify-center">
            <button
              type="submit"
              className="w-5/12 py-2 px-4 bg-[#F28202] text-white font-semibold rounded-lg hover:bg-gray-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
