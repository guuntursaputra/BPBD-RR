"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface RakyatData {
    id: number;
    name: string;
    NIK: string;
    gender: string;
    bank: { id: number; bankName: string };
    bankId: number;
}

export default function RakyatPage() {
    const [rakyats, setRakyats] = useState<RakyatData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [editingRakyatId, setEditingRakyatId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        NIK: "",
        gender: "",
        bankId: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = localStorage.getItem('token');

    const fetchRakyats = async (page: number = 1) => {
        const url = searchTerm
            ? `http://localhost:3000/rakyat/search?NIK=${searchTerm}&page=${page}&limit=10`
            : `http://localhost:3000/rakyat?page=${page}&limit=10`;
        try {
            const response = await fetch(url,{
                headers: {
                    "Authorization": `${token}`, // Include the token in the Authorization header
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setRakyats(data.result);
                setCurrentPage(data.pageInfo.currentPage);
                setTotalPages(data.pageInfo.totalPages);
                setError("");
            } else {
                setError("Failed to fetch rakyat data.");
            }
        } catch (error) {
            console.error("Error fetching rakyat data:", error);
            setError("Failed to fetch rakyat data.");
        }
    };

    useEffect(() => {
        fetchRakyats(currentPage);
    }, [currentPage, searchTerm]);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/rakyat/${id}`, {
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete rakyat data");

            setRakyats(rakyats.filter((rakyat) => rakyat.id !== id));
        } catch (error: any) {
            console.error(error);
            setError("Failed to delete rakyat data.");
        }
    };

    const handleEdit = (rakyat: RakyatData) => {
        setEditingRakyatId(rakyat.id);
        setFormData({
            name: rakyat.name,
            NIK: rakyat.NIK,
            gender: rakyat.gender,
            bankId: String(rakyat.bankId)
        });
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (editingRakyatId === null) return;

        try {
            const response = await fetch(`http://localhost:3000/rakyat/${editingRakyatId}`, {
                method: "PUT",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },

                body: JSON.stringify({
                    ...formData,
                    bankId: parseInt(formData.bankId)
                }),
            });

            if (!response.ok) throw new Error("Failed to update rakyat data");

            setRakyats(
                rakyats.map((rakyat) =>
                    rakyat.id === editingRakyatId
                        ? { ...rakyat, ...formData, bankId: parseInt(formData.bankId) }
                        : rakyat
                )
            );
            setEditingRakyatId(null);
            setError("");
        } catch (error: any) {
            console.error(error);
            setError("Failed to update rakyat data.");
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Warga Data</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by NIK"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
            />

            {/* Rakyat Table */}
            <table className="w-full mt-4 border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">NIK</th>
                        <th className="border px-4 py-2">Gender</th>
                        <th className="border px-4 py-2">Bank</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rakyats.map((rakyat) => (
                        <tr key={rakyat.id}>
                            <td className="border px-4 text-center py-2">
                                {editingRakyatId === rakyat.id ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    rakyat.name
                                )}
                            </td>
                            <td className="border px-4 text-center py-2">
                                {editingRakyatId === rakyat.id ? (
                                    <input
                                        type="text"
                                        name="NIK"
                                        value={formData.NIK}
                                        maxLength={16}
                                        onChange={handleFormChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    rakyat.NIK
                                )}
                            </td>
                            <td className="border px-4 text-center py-2">
                                {editingRakyatId === rakyat.id ? (
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleFormChange}
                                        className="border rounded px-2 py-1 w-full"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                ) : (
                                    rakyat.gender
                                )}
                            </td>
                            <td className="border px-4 text-center py-2">{rakyat.Bank.bankName}</td>
                            <td className="border flex justify-center px-4 py-2">
                                {editingRakyatId === rakyat.id ? (
                                    <button
                                        onClick={handleUpdate}
                                        className="mr-2 py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(rakyat)}
                                        className="mr-2 py-1 px-3 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(rakyat.id)}
                                    className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
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
