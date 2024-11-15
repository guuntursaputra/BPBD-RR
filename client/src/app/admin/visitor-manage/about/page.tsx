"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

export default function AboutPage() {
    const [aboutData, setAboutData] = useState<any>(null);
    const [formData, setFormData] = useState({
        aboutUs: "",
        detailAboutUs: "",
    });
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch("http://localhost:3000/about",{
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setAboutData(result.result[0] || null);
                }
            } catch (error) {
                console.error("Failed to fetch About data:", error);
            }
        };

        fetchAboutData();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/about", {
                method: "POST",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to add About data");

            alert("About data successfully added!");
            const result = await response.json();
            setAboutData(result.result);
            setFormData({ aboutUs: "", detailAboutUs: "" });
            setError("");
        } catch (error) {
            console.error(error);
            setError("Failed to add About data. Please try again.");
        }
    };

    const handleEdit = () => {
        setFormData({
            aboutUs: aboutData.aboutUs,
            detailAboutUs: aboutData.detailAboutUs,
        });
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:3000/about/${aboutData.id}`, {
                method: "PUT",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update About data");

            alert("About data successfully updated!");
            const result = await response.json();
            setAboutData(result.result);
            setIsEditing(false);
            setError("");
        } catch (error) {
            console.error(error);
            setError("Failed to update About data. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/about/${aboutData.id}`, {
                method: "DELETE",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
            });

            if (!response.ok) throw new Error("Failed to delete About data");

            alert("About data successfully deleted!");
            setAboutData(null);
        } catch (error) {
            console.error(error);
            setError("Failed to delete About data. Please try again.");
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage About Us</h2>
            {error && <p className="text-red-500">{error}</p>}

            {!aboutData ? (
                // Render Add Form
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        About Us
                        <textarea
                            name="aboutUs"
                            value={formData.aboutUs}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </label>
                    <label className="block mb-2">
                        Detail About Us
                        <textarea
                            name="detailAboutUs"
                            value={formData.detailAboutUs}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </label>
                    <button type="submit" className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Add About Us
                    </button>
                </form>
            ) : (
                // Render Data Table or Edit Form
                <div>
                    {isEditing ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                            <label className="block mb-2">
                                About Us
                                <textarea
                                    name="aboutUs"
                                    value={formData.aboutUs}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Detail About Us
                                <textarea
                                    name="detailAboutUs"
                                    value={formData.detailAboutUs}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </label>
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Update About Us
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="mt-4 py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 ml-4"
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <div>
                            <table className="w-full text-left border">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">Field</th>
                                        <th className="border px-4 py-2">Content</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2">About Us</td>
                                        <td className="border px-4 py-2">{aboutData.aboutUs}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2">Detail About Us</td>
                                        <td className="border px-4 py-2">{aboutData.detailAboutUs}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button
                                onClick={handleEdit}
                                className="mt-4 py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 ml-4"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
