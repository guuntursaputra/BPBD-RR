"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface BankData {
    id: number;
    account: string;
    bankName: string;
    branchBank: string;
}

export default function BankingPage() {
    const [banks, setBanks] = useState<BankData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [editingBankId, setEditingBankId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        account: "",
        bankName: "",
        branchBank: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = localStorage.getItem('token');

    const fetchBanks = async (page: number = 1) => {
        const url = searchTerm
            ? `http://localhost:3000/bank/search?norek=${searchTerm}&page=${page}&limit=10`
            : `http://localhost:3000/bank?page=${page}&limit=10`;
        try {
            const response = await fetch(url,{
                headers: {
                    "Authorization": `${token}`, // Include the token in the Authorization header
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setBanks(data.result);
                setCurrentPage(data.pageInfo.currentPage);
                setTotalPages(data.pageInfo.totalPages);
                setError("");
            } else {
                setError("Failed to fetch banking data.");
            }
        } catch (error) {
            console.error("Error fetching banking data:", error);
            setError("Failed to fetch banking data.");
        }
    };

    useEffect(() => {
        fetchBanks(currentPage);
    }, [currentPage, searchTerm]);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/bank/${id}`, {
                headers: {
                    "Authorization": `${token}`, // Include the token in the Authorization header
                    "Content-Type": "application/json",
                },
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete bank data");

            setBanks(banks.filter((bank) => bank.id !== id));
        } catch (error: any) {
            console.error(error);
            setError("Failed to delete bank data.");
        }
    };

    const handleEdit = (bank: BankData) => {
        setEditingBankId(bank.id);
        setFormData({
            account: bank.account,
            bankName: bank.bankName,
            branchBank: bank.branchBank
        });
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (editingBankId === null) return;

        try {
            const response = await fetch(`http://localhost:3000/bank/${editingBankId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `${token}`, // Include the token in the Authorization header
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update bank data");

            setBanks(
                banks.map((bank) =>
                    bank.id === editingBankId
                        ? { ...bank, ...formData }
                        : bank
                )
            );
            setEditingBankId(null);
            setError("");
        } catch (error: any) {
            console.error(error);
            setError("Failed to update bank data.");
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Banking Data</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Search Input */}
            <input
                type="text"
                placeholder="Nomor Rekening, Nama Bank, atau Cabang"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
            />

            {/* Banking Table */}
            <table className="w-full mt-4 border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Nomor Rekening</th>
                        <th className="border px-4 py-2">Nama Bank</th>
                        <th className="border px-4 py-2">Cabang Bank</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {banks.map((bank) => (
                        <tr key={bank.id}>
                            <td className="border px-4 text-center py-2">
                                {editingBankId === bank.id ? (
                                    <input
                                        type="text"
                                        name="account"
                                        value={formData.account}
                                        onChange={handleFormChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    bank.account
                                )}
                            </td>
                            <td className="border px-4 text-center py-2">
                                {editingBankId === bank.id ? (
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleFormChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    bank.bankName
                                )}
                            </td>
                            <td className="border px-4 text-center py-2">
                                {editingBankId === bank.id ? (
                                    <input
                                        type="text"
                                        name="branchBank"
                                        value={formData.branchBank}
                                        onChange={handleFormChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    bank.branchBank
                                )}
                            </td>
                            <td className="border flex justify-center px-4 py-2">
                                {editingBankId === bank.id ? (
                                    <button
                                        onClick={handleUpdate}
                                        className="mr-2 py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(bank)}
                                        className="mr-2 py-1 px-3 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(bank.id)}
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
