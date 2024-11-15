"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "remixicon/fonts/remixicon.css";

interface RecapData {
    no: number;
    NIK: string;
    name: string;
    gender: string;
    account: string;
    branch: string;
    bankName: string;
    damageLevel: string;
    stage: string;
    termin: string;
    nominal: string;
    date: string;
    terminDetails: { terminNum: string; nominal: string }[];
    id: number;
}

export default function RecapRnRPage() {
    const [recaps, setRecaps] = useState<RecapData[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedTerminDetails, setSelectedTerminDetails] = useState<{ terminNum: string; nominal: string }[]>([]);
    const router = useRouter();
    const token = localStorage.getItem("token");

    const fetchRecaps = async (page = 1, searchQuery = "") => {
        try {
            const response = await fetch(`http://localhost:3000/recaps?page=${page}&search=${searchQuery}`, {
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (response.ok) {
                const formattedData = data.result.map((item, index) => {
                    const terminDetails = item.TerminNominals?.map((tn) => ({
                        terminNum: tn.Termin?.terminNum || "-",
                        nominal: formatRupiah(tn.nominal || "0"),
                        stage: tn.stage || "-"
                    })) || [];
                
                    const latestTerminNominal = terminDetails[terminDetails.length - 1] || { nominal: "0", stage: "-" };
                
                    return {
                        no: index + 1,
                        id: item.id,
                        NIK: item.Rakyat?.NIK || "-", 
                        name: item.Rakyat?.name || "-",
                        gender: item.Rakyat?.gender || "-",
                        account: item.Rakyat?.Bank?.account || "-",
                        branch: item.Rakyat?.Bank?.branchBank || "-",
                        bankName: item.Rakyat?.Bank?.bankName || "-",
                        damageLevel: item.lvlDamage,
                        stage: latestTerminNominal.stage,
                        termin: item.Termin?.terminNum || "-",
                        nominal: latestTerminNominal.nominal,
                        date: new Date(item.transactionDate).toLocaleDateString("id-ID"),
                        terminDetails,
                    };
                });

                setRecaps(formattedData);
                setCurrentPage(data.pageInfo.currentPage);
                setTotalPages(data.pageInfo.totalPages);
                setError("");
            } else {
                setError("Failed to fetch recaps data.");
            }
        } catch (error) {
            console.error("Error fetching recaps data:", error);
            setError("Failed to fetch recaps data.");
        }
    };
    
    const fetchTerminHistory = async (recapId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/recaps/${recapId}/history`, {
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (response.ok) {
                const terminDetails = data.result.map((item) => ({
                    terminNum: item.Termin.terminNum,
                    nominal: formatRupiah(item.nominal || "0"),
                    stage: item.stage || "-"
                }));

                setSelectedTerminDetails(terminDetails);
                setShowModal(true);
            } else {
                console.error("Failed to fetch termin history:", data.message);
            }
        } catch (error) {
            console.error("Error fetching termin history:", error);
        }
    };

    useEffect(() => {
        fetchRecaps(currentPage, search);
    }, [currentPage, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleShowModal = (recapId: number) => {
        fetchTerminHistory(recapId);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const formatRupiah = (value: string) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value));
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this data?");
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:3000/recaps/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `${token}`,
                        "Content-Type": "application/json",
                    }
                });
                if (response.ok) {
                    alert("Data deleted successfully!");
                    fetchRecaps(currentPage, search);
                } else {
                    alert("Failed to delete data.");
                }
            } catch (error) {
                console.error("Error deleting data:", error);
                alert("An error occurred while deleting the data.");
            }
        }
    };

    const handleUpdate = (id: number) => {
        router.push(`/admin/recap/update/${id}`);
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Rekap Data Rehabilitasi dan Rekonstruksi</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search NIK or Name"
                        className="border rounded-full pl-4 pr-10 py-2"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔍</span>
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="overflow-x-auto" style={{ maxHeight: "88vh" }}>
                <table className="min-w-full border-collapse">
                    <thead className="sticky top-0 z-10 bg-[#FF9F0C] text-white">
                        <tr>
                            <th className="py-2 px-6 border w-24">NO</th>
                            <th className="py-2 px-6 border w-60">NIK</th>
                            <th className="py-2 px-6 border w-60">NAMA</th>
                            <th className="py-2 px-6 border w-32">JENIS KELAMIN</th>
                            <th className="py-2 px-6 border w-60">NO REKENING</th>
                            <th className="py-2 px-6 border w-72">NAMA CABANG</th>
                            <th className="py-2 px-6 border w-72">NAMA BANK</th>
                            <th className="py-2 px-6 border w-60">TINGKAT KERUSAKAN</th>
                            <th className="py-2 px-6 border w-32">TAHAP</th>
                            <th className="py-2 px-6 border w-32">TERMIN</th>
                            <th className="py-2 px-6 border w-72">NOMINAL</th>
                            <th className="py-2 px-6 border w-60">TANGGAL</th>
                            <th className="py-2 px-6 border w-48">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recaps.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="py-2 px-6 border">{item.no}</td>
                                <td className="py-2 px-6 border">{item.NIK}</td>
                                <td className="py-2 px-6 border">{item.name}</td>
                                <td className="py-2 px-6 border">{item.gender}</td>
                                <td className="py-2 px-6 border">{item.account}</td>
                                <td className="py-2 px-6 border">{item.branch}</td>
                                <td className="py-2 px-6 border">{item.bankName}</td>
                                <td className="py-2 px-6 border">{item.damageLevel}</td>
                                <td className="py-2 px-6 border">{item.stage}</td>
                                <td className="py-2 px-6 border">{item.termin}</td>
                                <td className="py-2 px-6 border">
                                    {item.nominal}
                                    <button
                                        onClick={() => handleShowModal(item.id)}
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                    >
                                        <i className="ri-information-line"></i>
                                    </button>
                                </td>
                                <td className="py-2 px-6 border">{item.date}</td>
                                <td className="py-2 px-6 border">
                                    <button
                                        onClick={() => handleUpdate(item.id)}
                                        className="mr-2 p-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        <i className="ri-edit-line"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-1 rounded bg-red-500 text-white hover:bg-red-600"
                                    >
                                        <i className="ri-delete-bin-6-line"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-xl font-semibold mb-4">Detail Termin Nominal</h2>
                        <ul>
                            {selectedTerminDetails.map((detail, idx) => (
                                <li key={idx} className="mb-2">
                                    Termin {detail.terminNum} - {detail.nominal}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={closeModal}
                            className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200"
                >
                    {'<'}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 mx-1 rounded ${
                            page === currentPage ? "bg-[#f28202] text-white" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200"
                >
                    {'>'}
                </button>
            </div>
        </section>
    );
}
