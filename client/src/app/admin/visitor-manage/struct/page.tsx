"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

export default function StructPage() {
    const [structData, setStructData] = useState<any>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch Struct data on component load
        const fetchStructData = async () => {
            try {
                const response = await fetch("http://localhost:3000/structs",{
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setStructData(result.result[0] || null); // Expecting only one record
                }
            } catch (error) {
                console.error("Failed to fetch Struct data:", error);
            }
        };

        fetchStructData();
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            setError("Please select an image file");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("imgStruct", imageFile);

            const response = await fetch("http://localhost:3000/structs", {
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                    },
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Failed to add struct");
            }

            alert("Struct successfully added!");
            const result = await response.json();
            setStructData(result.data);
            setImageFile(null);
            setError("");
        } catch (error: any) {
            console.error(error);
            setError(error.message || "Failed to add struct. Please try again.");
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        if (!imageFile) {
            setError("Please select an image file");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("imgStruct", imageFile);

            const response = await fetch(`http://localhost:3000/structs/${structData.id}`, {
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                    },
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Failed to update struct");
            }

            alert("Struct successfully updated!");
            const result = await response.json();
            setStructData(result.data);
            setIsEditing(false);
            setImageFile(null);
            setError("");
        } catch (error: any) {
            console.error(error);
            setError(error.message || "Failed to update struct. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/structs/${structData.id}`, {
                method: "DELETE",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Failed to delete struct");
            }

            alert("Struct successfully deleted!");
            setStructData(null);
        } catch (error: any) {
            console.error(error);
            setError(error.message || "Failed to delete struct. Please try again.");
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage Structure Image</h2>
            {error && <p className="text-red-500">{error}</p>}

            {!structData ? (
                // Render Add Form
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        Upload Image
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </label>
                    <button type="submit" className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Add Structure Image
                    </button>
                </form>
            ) : (
                // Render Image and Options
                <div>
                    {isEditing ? (
                        <div>
                            <label className="block mb-2">
                                Upload New Image
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleFileChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </label>
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Update Structure Image
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="mt-4 py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 ml-4"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <img
                                src={`http://localhost:3000${structData.imgStruct}`}
                                alt="Structure"
                                className="w-full h-auto mb-4"
                            />
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
