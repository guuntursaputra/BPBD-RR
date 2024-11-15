"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Termin {
    id: string;
    terminNum: string;
    description: string;
}

export default function RnRPage() {
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
    const token = localStorage.getItem('token');

    useEffect(() => {
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

        fetchTermins();
    }, []);

    const formatRupiah = (value: string) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value.replace(/\D/g, "")));
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Format the nominal field as Rupiah for display
        if (name === "nominal") {
            const numericValue = value.replace(/\D/g, ""); // Keep only numbers
            setFormData((prevData) => ({
                ...prevData,
                [name]: numericValue,
                nominalFormatted: formatRupiah(numericValue),
            }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }

        if (name === "NIK" && value.length === 16) {
            handleNIKBlur(value);
        }
    };

    const handleNIKBlur = async (NIK: string) => {
        if (NIK) {
            try {
                const response = await fetch(`http://localhost:3000/rakyat/search?NIK=${NIK}`,{
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();

                if (response.ok) {
                    setFormData({
                        ...formData,
                        rakyatId: result.result[0].id,
                        name: result.result[0].name,
                        gender: result.result[0].gender,
                        bankName: result.result[0].Bank.bankName,
                        branchBank: result.result[0].Bank.branchBank,
                        account: result.result[0].Bank.account,
                        NIK: NIK
                    });
                    setError("");
                } else {
                    setError("Rakyat not found. Please check the NIK or add details manually.");
                    setFormData({
                        ...formData,
                        rakyatId: 0,
                        name: "",
                        gender: "",
                        account: "",
                        bankName: "",
                        branchBank: "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch Rakyat data:", error);
                setError("Failed to fetch Rakyat data.");
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/recaps", {
                method: "POST",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },

                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to add Recap");

            alert("Recap data successfully added!");
            setFormData({
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
            setError("");
        } catch (error) {
            console.error(error);
            setError("Failed to add Recap. Please try again.");
        }
    };

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Tambah Data Rehabilitasi dan Rekonstruksi</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    NIK
                    <input
                        type="text"
                        name="NIK"
                        value={formData.NIK}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        maxLength={16}
                        required
                    />
                </label>
                <label className="block mb-2">
                    NAMA
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className="w-full border bg-gray-100 rounded px-3 py-2"
                        required
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
                        name="nameBank"
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
                        Submit
                    </button>
                </div>
            </form>
        </section>
    );
}
