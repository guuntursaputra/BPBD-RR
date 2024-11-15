"use client";

import { useState, useEffect } from "react";

interface AdminUser {
    id: number;
    username: string;
    email: string;
}

export default function ListAdminPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    const fetchAdmins = async (page: number) => {
        try {
            const response = await fetch(`http://localhost:3000/admin?page=${page}&limit=10`,{
                headers: {
                    "Authorization": `${token}`, // Include the token in the Authorization header
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAdmins(data.result);
                setCurrentPage(data.pageInfo.currentPage);
                setTotalPages(data.pageInfo.totalPages);
                setError("");
            } else {
                setError("Failed to fetch admin data.");
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
            setError("Failed to fetch admin data.");
        }
    };

    useEffect(() => {
        fetchAdmins(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filteredAdmins = admins.filter(
        (admin) =>
            admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Admin Users</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by username or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
            />

            {/* Admin Table */}
            <table className="w-full mt-4 border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Username</th>
                        <th className="border px-4 py-2">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAdmins.map((admin) => (
                        <tr key={admin.id}>
                            <td className="border text-center px-4 py-2">{admin.id}</td>
                            <td className="border text-center px-4 py-2">{admin.username}</td>
                            <td className="border text-center px-4 py-2">{admin.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="mx-2 py-1 px-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200"
                >
                    {'<'}
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 py-1 px-3 rounded ${
                            currentPage === index + 1 ? "bg-[#f28202] text-white" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="mx-2 py-1 px-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200"
                >
                    {'>'}
                </button>
            </div>
        </section>
    );
}
