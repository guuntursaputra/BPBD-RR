"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation"; // Assuming you're using Next.js

interface Termin {
    id: string;
    terminNum: string;
    description: string;
}

export default function UpdateRnRPage() {
    const router = useRouter();
    const pathname = usePathname();
    
    const recapId = pathname.split("/").pop();

    const [formData, setFormData] = useState({
        rakyatId: 0,
        NIK: "",
        name: "",
        gender: "",
        bankName: "",
        branchBank: "",
        account: "",
        terminId: "",
        lvlDamage: "",
        transactionDate: "",
        stage: "",
        nominal: "",
    });
    const [error, setError] = useState("");
    const [termins, setTermins] = useState<Termin[]>([]);
    const [initialTerminId, setInitialTerminId] = useState("");
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!recapId) {
            setError("Recap ID not found.");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/recaps/${recapId}`,{
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                console.log("Recap data result:", result);

                if (response.ok && result.status === 200) {
                    const recapData = result.result;
                    
                    const latestTerminNominal = recapData.TerminNominals?.[recapData.TerminNominals.length - 1] || {};
                    
                    setFormData({
                        rakyatId: recapData.rakyatId,
                        NIK: recapData.Rakyat.NIK,
                        name: recapData.Rakyat.name,
                        gender: recapData.Rakyat.gender,
                        bankName: recapData.Rakyat.Bank.bankName,
                        branchBank: recapData.Rakyat.Bank.branchBank,
                        account: recapData.Rakyat.Bank.account,
                        terminId: recapData.terminId,
                        lvlDamage: recapData.lvlDamage,
                        transactionDate: recapData.transactionDate.split("T")[0],
                        stage: latestTerminNominal.stage || "",
                        nominal: latestTerminNominal.nominal || "",
                    });
                    setInitialTerminId(recapData.terminId);
                } else {
                    setError("Recap not found or failed to load.");
                }
            } catch (error) {
                console.error("Failed to fetch recap data:", error);
                setError("Failed to fetch data. Please try again.");
            }
        };

        const fetchTermins = async () => {
            try {
                const response = await fetch("http://localhost:3000/termin",{
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();

                if (result.status === 200) {
                    setTermins(result.result);
                }
            } catch (error) {
                console.error("Failed to fetch Termins:", error);
            }
        };

        fetchData();
        fetchTermins();
    }, [recapId]);

    const formatRupiah = (value: string) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value.replace(/\D/g, "")));
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "nominal") {
            const numericValue = value.replace(/\D/g, "");
            setFormData((prevData) => ({
                ...prevData,
                [name]: numericValue,
            }));
        } else if (name === "terminId" && value !== initialTerminId) {
            setFormData((prevData) => ({ ...prevData, [name]: value, nominal: "" }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!recapId) {
            setError("No recap ID found. Cannot update data.");
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3000/recaps/${recapId}`, {
                method: "PUT",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update Recap");

            alert("Recap data successfully updated!");
            router.push("/admin/recap-rnr");
            setError("");
        } catch (error) {
            console.error(error);
            setError("Failed to update Recap. Please try again.");
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Update Data Rehabilitasi dan Rekonstruksi</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    NIK
                    <input
                        type="text"
                        name="NIK"
                        value={formData.NIK}
                        className="w-full border bg-gray-100 rounded px-3 py-2"
                        readOnly
                    />
                </label>
                <label className="block mb-2">
                    NAMA
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className="w-full border bg-gray-100 rounded px-3 py-2"
                        readOnly
                    />
                </label>
                <label className="block mb-2">
                    Jenis Kelamin
                    <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        className="w-full border bg-gray-100 rounded px-3 py-2"
                        readOnly
                    />
                </label>
                <label className="block mb-2">
                    Rekening bank
                    <input
                        type="text"
                        name="account"
                        value={formData.account}
                        className="w-full border bg-gray-100 rounded px-3 py-2"
                        readOnly
                    />
                </label>
                <label className="block mb-2">
                    Nama bank
                    <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        className="w-full border bg-gray-100 rounded px-3 py-2"
                        readOnly
                    />
                </label>
                <label className="block mb-2">
                    Cabang bank
                    <input
                        type="text"
                        name="branchBank"
                        value={formData.branchBank}
                        className="w-full border bg-gray-100 rounded px-3 py-2"
                        readOnly
                    />
                </label>
                <label className="block mb-2">
                    Termin
                    <select
                        name="terminId"
                        value={formData.terminId}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Pilih Termin</option>
                        {termins.map((termin) => (
                            <option key={termin.id} value={termin.id}>
                                {termin.terminNum} - {termin.description}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="block mb-2">
                    Tingkat Kerusakan
                    <select
                        name="lvlDamage"
                        value={formData.lvlDamage}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Pilih Tingkat Kerusakan</option>
                        <option value="Rendah">Rendah</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Tinggi">Tinggi</option>
                    </select>
                </label>
                <label className="block mb-2">
                    Tanggal Transaksi
                    <input
                        type="date"
                        name="transactionDate"
                        value={formData.transactionDate}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
                <label className="block mb-2">
                    Tahap
                    <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Pilih Tahap</option>
                        {[1, 2, 3, 4, 5, 6].map((stage) => (
                            <option key={stage} value={stage}>
                                {stage}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="block mb-2">
                    Nominal
                    <input
                        type="text"
                        name="nominal"
                        value={formData.nominal ? formatRupiah(formData.nominal) : ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
                <div className="w-full flex justify-end mt-6">
                    <button
                        type="submit"
                        className="mt-4 w-1/6 py-2 px-4 bg-[#f28202] text-white rounded hover:bg-[#ca6404]"
                    >
                        Update
                    </button>
                </div>
            </form>
        </section>
    );
}
