"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function AddTerminPage() {
    const [formData, setFormData] = useState({
        terminNum: "",
        description: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const token = localStorage.getItem("token");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/termin", {
                method: "POST",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify(formData),
            });

            if (response.status === 400) {
                const result = await response.json();
                setError(result.msg || "Termin number already exists. Cannot add duplicate.");
                return;
            }

            if (!response.ok) throw new Error("Failed to add termin");

            alert("Termin successfully added!");
            setFormData({
                terminNum: "",
                description: "",
            });
            setError("");
        } catch (error) {
            console.error(error);
            setError("Failed to add termin. Please try again.");
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Tambah Data Termin</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Termin Number
                    <input
                        type="text"
                        name="terminNum"
                        value={formData.terminNum}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
                <label className="block mb-2">
                    Description
                    <input
                        name="description"
                        value={formData.description}
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
