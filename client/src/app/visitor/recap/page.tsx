"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BankData {
    bankName: string;
    branchBank: string;
    account: string;
}

interface RakyatData {
    NIK: string;
    name: string;
    gender: string;
    Bank: BankData;
}

interface TerminData {
    terminNum: number;
    description: string;
}

interface TerminNominalData {
    stage: number;
    nominal: string;
    createdAt: string;
}

interface RecapData {
    Rakyat: RakyatData;
    Termin: TerminData;
    TerminNominals: TerminNominalData[];
}

export default function RecapPage() {
    const [recap, setRecap] = useState<RecapData | null>(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const fetchRecaps = async () => {
        if (search.length < 3) {
            setError("Search term must be at least 3 characters long.");
            setRecap(null);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/recaps/visitor?search=${search}`);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            if (data.result.length === 0) {
                setError("No data found for the provided search criteria.");
                setRecap(null);
            } else {
                setRecap(data.result[0]);
                setError("");
            }
        } catch (error) {
            setError("No data found for the provided search criteria.");
            console.error(error);
        }
    };

    useEffect(() => {
        if (search.length >= 3) {
            fetchRecaps();
        }
    }, [search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value.length < 3) {
            setError("Search term must be at least 3 characters long.");
        } else {
            setError("");
        }
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
            <span 
                className="text-[#f28202] cursor-pointer" 
                onClick={() => router.push('/')}
                >
                Back To Dashboard
            </span>
                <h1 className="text-4xl font-bold">Rekap Data Rehabilitasi dan Rekonstruksi</h1>
            </div>

            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Masukkan Nama"
                    className="border rounded-full pl-4 pr-10 py-2 w-full max-w-md"
                    value={search}
                    onChange={handleSearchChange}
                />
                <button onClick={fetchRecaps} className="text-gray-500 -ml-10">
                    🔍
                </button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {!error && recap && (
                <div>
                    {/* Recap Data */}
                    <div className="overflow-x-auto mb-8">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-[#FF9F0C] text-white">
                                <tr>
                                    <th className="py-2 px-4 border">NIK</th>
                                    <th className="py-2 px-4 border">NAMA</th>
                                    <th className="py-2 px-4 border">JENIS KELAMIN</th>
                                    <th className="py-2 px-4 border">NO REKENING</th>
                                    <th className="py-2 px-4 border">NAMA CABANG</th>
                                    <th className="py-2 px-4 border">NAMA BANK</th>
                                    <th className="py-2 px-4 border">TERMIN</th>
                                    <th className="py-2 px-4 border">NOMINAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td className="py-2 px-4 border">{recap.Rakyat.NIK}</td>
                                    <td className="py-2 px-4 border">{recap.Rakyat.name}</td>
                                    <td className="py-2 px-4 border">{recap.Rakyat.gender}</td>
                                    <td className="py-2 px-4 border">{recap.Rakyat.Bank.account}</td>
                                    <td className="py-2 px-4 border">{recap.Rakyat.Bank.branchBank}</td>
                                    <td className="py-2 px-4 border">{recap.Rakyat.Bank.bankName}</td>
                                    <td className="py-2 px-4 border">{recap.Termin.terminNum}</td>
                                    <td className="py-2 px-4 border">
                                        <span>{recap.TerminNominals[recap.TerminNominals.length - 1]?.nominal}</span>
                                        <button
                                            onClick={handleShowModal}
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                        >
                                            ℹ️
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* TerminNominal History Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                                <h2 className="text-xl font-semibold mb-4">Termin History</h2>
                                <table className="min-w-full border-collapse">
                                    <thead className="bg-[#FF9F0C] text-white">
                                        <tr>
                                            <th className="py-2 px-4 border">Stage</th>
                                            <th className="py-2 px-4 border">Nominal</th>
                                            <th className="py-2 px-4 border">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recap.TerminNominals.map((item, index) => (
                                            <tr key={index} className="text-center">
                                                <td className="py-2 px-4 border">{item.stage}</td>
                                                <td className="py-2 px-4 border">{item.nominal}</td>
                                                <td className="py-2 px-4 border">{new Date(item.createdAt).toLocaleDateString("id-ID")}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    onClick={handleCloseModal}
                                    className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
