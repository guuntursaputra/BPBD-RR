"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function AddAdminPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(formData),
            });
            console.log({response})

            if (!response.ok) throw new Error("Failed to add admin");

            alert("Admin user successfully added!");
            setFormData({
                username: "",
                email: "",
                password: "",
            });
            setError("");
        } catch (error) {
            console.error(error);
            setError("Failed to add admin. Please try again.");
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Tambah Data Admin</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Username
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
                <label className="block mb-2">
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
                <label className="block mb-2">
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
                <div className="w-full flex justify-end mt-6">
                    <button
                        type="submit"
                        className="mt-4 w-1/6 py-2 px-4 bg-[#f28202] text-white rounded hover:bg-[#ca6404]"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </section>
    );
}
