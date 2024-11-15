"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";

interface NewsItem {
    id: number;
    titleNews: string;
    contentNews: string;
    imgNewsUrl: string;
    createdAt: string;
}

export default function NewsPage() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [titleNews, setTitleNews] = useState("");
    const [contentNews, setContentNews] = useState("");
    const [imgNews, setImgNews] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch("http://localhost:3000/news",{
                headers: {
                    "Authorization": `${token}`, // Include the token in the Authorization header
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const result = await response.json();
                setNewsItems(result.result);
            }
        } catch (error) {
            console.error("Failed to fetch news data:", error);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImgNews(e.target.files[0]);
        }
    };
    const handleNewsSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        if (!imgNews) {
            setError("Please upload an image.");
            return;
        }
    
        const formData = new FormData();
        formData.append("titleNews", titleNews);
        formData.append("contentNews", contentNews);
        formData.append("imgNews", imgNews);
    
        try {
            const response = await fetch("http://localhost:3000/news", {
                method: "POST",
                headers: {
                    "Authorization": `${token}`, // Only include the Authorization header
                },
                body: formData,
            });
    
            if (!response.ok) throw new Error("Failed to add news item");
    
            setTitleNews("");
            setContentNews("");
            setImgNews(null);
            fetchNews();
            setError("");
        } catch (error: any) {
            console.error(error);
            setError("Failed to add news item. Please try again.");
        }
    };

    const handleDeleteNews = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/news/${id}`, {
                method: "DELETE",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
            });

            if (!response.ok) throw new Error("Failed to delete news item");

            setNewsItems(newsItems.filter((item) => item.id !== id));
        } catch (error: any) {
            console.error(error);
            setError("Failed to delete news item. Please try again.");
        }
    };

    const filteredNews = newsItems.filter((item) =>
        item.titleNews.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage News</h2>
            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleNewsSubmit} className="mb-6">
                <label className="block mb-2">
                    Title
                    <input
                        type="text"
                        value={titleNews}
                        onChange={(e) => setTitleNews(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
                <label className="block mb-2">
                    Content
                    <textarea
                        value={contentNews}
                        onChange={(e) => setContentNews(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
                <label className="block mb-2">
                    Image
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full border rounded px-3 py-2"
                        accept="image/png, image/jpeg, image/jpg"
                        required
                    />
                </label>
                <button type="submit" className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Add News
                </button>
            </form>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search news by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
            />

            {/* News Table */}
            <table className="w-full mt-4 border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Image</th>
                        <th className="border px-4 py-2">Title</th>
                        <th className="border px-4 py-2">Date Created</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredNews.map((item) => (
                        <tr key={item.id}>
                            <td className="flex justify-center border px-4 py-2">
                                <img src={`http://localhost:3000${item.imgNewsUrl}`} alt={item.titleNews} className="w-24 h-16 object-cover" />
                            </td>
                            <td className="text-center border px-4 py-2">{item.titleNews}</td>
                            <td className="border px-4 text-center py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td className="items-center border text-center px-4 py-2">
                                <button
                                    onClick={() => handleDeleteNews(item.id)}
                                    className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
