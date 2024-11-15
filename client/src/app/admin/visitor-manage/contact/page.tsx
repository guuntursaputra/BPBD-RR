"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

export default function ContactPage() {
    const [contactData, setContactData] = useState<any>(null);
    const [formData, setFormData] = useState({
        detailLocation: "",
        embedMap: "",
    });
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch Contact data on component load
        const fetchContactData = async () => {
            try {
                const response = await fetch("http://localhost:3000/contacts",{
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setContactData(result.result[0] || null); // Expecting only one record
                }
            } catch (error) {
                console.error("Failed to fetch Contact data:", error);
            }
        };

        fetchContactData();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/contacts", {
                method: "POST",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to add contact");

            alert("Contact successfully added!");
            const result = await response.json();
            setContactData(result.result);
            setFormData({ detailLocation: "", embedMap: "" });
            setError("");
        } catch (error) {
            console.error(error);
            setError("Failed to add contact. Please try again.");
        }
    };

    const handleEdit = () => {
        setFormData({
            detailLocation: contactData.detailLocation,
            embedMap: contactData.embedMap,
        });
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:3000/contacts/${contactData.id}`, {
                method: "PUT",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update contact");

            alert("Contact successfully updated!");
            const result = await response.json();
            setContactData(result.result);
            setIsEditing(false);
            setError("");
        } catch (error) {
            console.error(error);
            setError("Failed to update contact. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/contacts/${contactData.id}`, {
                method: "DELETE",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
            });

            if (!response.ok) throw new Error("Failed to delete contact");

            alert("Contact successfully deleted!");
            setContactData(null);
        } catch (error) {
            console.error(error);
            setError("Failed to delete contact. Please try again.");
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage Contact Information</h2>
            {error && <p className="text-red-500">{error}</p>}

            {!contactData ? (
                // Render Add Form
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        Detail Location
                        <textarea
                            name="detailLocation"
                            value={formData.detailLocation}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </label>
                    <label className="block mb-2">
                        Google Maps Embed URL
                        <input
                            type="text"
                            name="embedMap"
                            value={formData.embedMap}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </label>
                    <button type="submit" className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Add Contact
                    </button>
                </form>
            ) : (
                // Render Data Table or Edit Form
                <div>
                    {isEditing ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                            <label className="block mb-2">
                                Detail Location
                                <textarea
                                    name="detailLocation"
                                    value={formData.detailLocation}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Google Maps Embed URL
                                <input
                                    type="text"
                                    name="embedMap"
                                    value={formData.embedMap}
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
                                Update Contact
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
                                        <td className="border px-4 py-2">Detail Location</td>
                                        <td className="border px-4 py-2">{contactData.detailLocation}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2">Google Maps</td>
                                        <td className="border px-4 py-2">
                                            <iframe
                                                src={contactData.embedMap}
                                                width="600"
                                                height="450"
                                                style={{ border: 0 }}
                                                allowFullScreen={true}
                                                loading="lazy"
                                            ></iframe>
                                        </td>
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
