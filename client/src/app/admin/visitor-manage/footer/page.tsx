"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Footer {
    id: number;
    titleFooter: string;
    ListContentFooters: ListContentFooter[];
}

interface ListContentFooter {
    id: number;
    content: string;
    urlLink: string;
}

export default function FooterPage() {
    const [footers, setFooters] = useState<Footer[]>([]);
    const [newFooterTitle, setNewFooterTitle] = useState("");
    const [listContent, setListContent] = useState("");
    const [urlLink, setUrlLink] = useState("");
    const [selectedFooterId, setSelectedFooterId] = useState<number | null>(null);
    const [editListItem, setEditListItem] = useState<ListContentFooter | null>(null);
    const [error, setError] = useState("");
    const [editingFooter, setEditingFooter] = useState<Footer | null>(null);
    const token = localStorage.getItem("token");

useEffect(() => {
    const fetchFooters = async () => {
        try {
            const response = await fetch("http://localhost:3000/footers", {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const result = await response.json();

                // Ensure each footer has an array for ListContentFooters
                const formattedFooters = result.result.map((footer: Footer) => ({
                    ...footer,
                    ListContentFooters: footer.ListContentFooters || [], // Default to empty array if undefined
                }));

                setFooters(formattedFooters);
            }
        } catch (error) {
            console.error("Failed to fetch footers data:", error);
        }
    };

    fetchFooters();
}, []);

    const handleFooterSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/footers", {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ titleFooter: newFooterTitle }),
            });

            if (!response.ok) throw new Error("Failed to add footer");

            const result = await response.json();
            setFooters([...footers, result.data]);
            setNewFooterTitle("");
            setError("");
        } catch (error: any) {
            console.error(error);
            setError("Failed to add footer. Please try again.");
        }
    };

    const handleFooterDelete = async (footerId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/footers/${footerId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to delete footer");

            setFooters(footers.filter((footer) => footer.id !== footerId));
            setError("");
        } catch (error: any) {
            console.error(error);
            setError("Failed to delete footer. Please try again.");
        }
    };

    const handleListSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedFooterId) return;

        try {
            const response = await fetch(`http://localhost:3000/footers/list/${selectedFooterId}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: listContent, urlLink }),
            });

            if (!response.ok) throw new Error("Failed to add list item");

            const result = await response.json();
            const updatedFooters = footers.map((footer) =>
                footer.id === selectedFooterId
                    ? { ...footer, ListContentFooters: [...footer.ListContentFooters, result.data] }
                    : footer
            );

            setFooters(updatedFooters);
            setListContent("");
            setUrlLink("");
            setError("");
        } catch (error: any) {
            console.error(error);
            setError("Failed to add list item. Please try again.");
        }
    };

    const handleListDelete = async (footerId: number, itemId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/footers/list/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to delete list item");

            const updatedFooters = footers.map((footer) =>
                footer.id === footerId
                    ? {
                          ...footer,
                          ListContentFooters: footer.ListContentFooters.filter((item) => item.id !== itemId),
                      }
                    : footer
            );

            setFooters(updatedFooters);
        } catch (error: any) {
            console.error(error);
            setError("Failed to delete list item. Please try again.");
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage Footer Sections</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Add Footer Form */}
            <form onSubmit={handleFooterSubmit} className="mb-6">
                <label className="block mb-2">
                    Footer Title
                    <input
                        type="text"
                        value={newFooterTitle}
                        onChange={(e) => setNewFooterTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
                <button type="submit" className="mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Add Footer Section
                </button>
            </form>

            {/* Display each footer and associated list items */}
            {footers.map((footer) => (
                <div key={footer.id} className="mb-8 border-t-2 pt-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{footer.titleFooter}</h3>
                        <button
                            onClick={() => handleFooterDelete(footer.id)}
                            className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>

                    {footer.ListContentFooters?.length === 0 ? (
                        <p className="text-gray-500 mt-2">No content available in this section.</p>
                    ) : (
                        <table className="w-full mt-4 border">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Content</th>
                                    <th className="border px-4 py-2">URL</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {footer.ListContentFooters?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border px-4 py-2">{item.content}</td>
                                        <td className="border px-4 py-2">{item.urlLink}</td>
                                        <td className="flex justify-center border px-4 py-2">
                                            <button
                                                onClick={() => handleListDelete(footer.id, item.id)}
                                                className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Conditionally Render Add List Item Form */}
                    <button
                        onClick={() =>
                            setSelectedFooterId(selectedFooterId === footer.id ? null : footer.id)
                        }
                        className="mt-4 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        {selectedFooterId === footer.id ? "Hide Add List Item" : "Add List Item"}
                    </button>

                    {selectedFooterId === footer.id && (
                        <form onSubmit={handleListSubmit} className="mt-4">
                            <label className="block mb-2">
                                Content
                                <input
                                    type="text"
                                    value={listContent}
                                    onChange={(e) => setListContent(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                URL
                                <input
                                    type="text"
                                    value={urlLink}
                                    onChange={(e) => setUrlLink(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </label>
                            <button
                                type="submit"
                                className="mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add List Item
                            </button>
                        </form>
                    )}
                </div>
            ))}
        </section>
    );
}
