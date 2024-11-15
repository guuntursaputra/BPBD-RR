"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { BankSuggestion, FormData } from "@/interface";

export default function AddRakyatPage() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        NIK: "",
        gender: "",
        accountNumber: "",
        bankName: "",
        branchBank: "",
        bankId: 0
    });
    const [suggestions, setSuggestions] = useState<BankSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [noResultsMessage, setNoResultsMessage] = useState("");
    const [reminderNIK, setReminderNIK] = useState("")
    const token = localStorage.getItem('token');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Trigger search for account number field
        if (name === "accountNumber" && value) {
            fetchBankSuggestions(value);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setNoResultsMessage("");
        }
    };

    const fetchBankSuggestions = async (query: string) => {
        try {
            const response = await fetch(`http://localhost:3000/bank/search?norek=${query}`,{
                headers: {
                    "Authorization": `${token}`, // Include the token in the Authorization header
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();

            if (result.status === 200 && result.result.length > 0) {
                setSuggestions(result.result);
                setShowSuggestions(true);
                setNoResultsMessage("");
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
                setNoResultsMessage("Bank not found!");
            }
        } catch (error) {
            console.error("Failed to fetch bank suggestions:", error);
            setNoResultsMessage("Failed to fetch bank suggestions.");
        }
    };

    const handleSuggestionClick = (suggestion: BankSuggestion) => {
        setFormData({
            ...formData,
            accountNumber: suggestion.account,
            bankName: suggestion.bankName,
            branchBank: suggestion.branchBank,
            bankId: suggestion.id
        });
        if(formData.NIK.length !== 16) {
            setReminderNIK("panjang NIK harus 16 digit")
        }
        setShowSuggestions(false);
        setNoResultsMessage("");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/rakyat", {
                method: "POST",
                    headers: {
                        "Authorization": `${token}`, // Include the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error data:", errorData);
                throw new Error("Failed to add Rakyat: " + errorData.message);
            }
    
            alert("Data Rakyat successfully added!");
            setFormData({
                name: "",
                NIK: "",
                gender: "",
                accountNumber: "",
                bankName: "",
                branchBank: "",
                bankId: 0
            });
            setSuggestions([]);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };
    

    return (
        <section className="bg-white w-full shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Tambah Data Warga</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    NAMA
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </label>
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
                {reminderNIK ? (<p className="text-red-600 font-semibold">{reminderNIK}</p>) : ""}
                <label className="block mb-2">
                    Jenis Kelamin
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Pilih Gender</option>
                        <option value="Laki Laki">Laki Laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </label>
                <label className="block mb-2 relative">
                    No Rekening
                    <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                    {showSuggestions && (
                        <ul className="border rounded shadow-lg max-h-48 overflow-y-auto absolute bg-white w-full mt-1">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion.account} - {suggestion.branchBank} - {suggestion.bankName}
                                </li>
                            ))}
                        </ul>
                    )}
                    {noResultsMessage && !showSuggestions && (
                        <p className="text-red-500 mt-2">{noResultsMessage}</p>
                    )}
                </label>
                <label className="block mb-2">
                    Nama Bank
                    <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full border rounded bg-gray-100 px-3 py-2"
                        required
                        readOnly
                    />
                </label>
                <label className="block mb-2">
                    Cabang Bank
                    <input
                        type="text"
                        name="branchBank"
                        value={formData.branchBank}
                        onChange={handleChange}
                        className="w-full border rounded bg-gray-100 px-3 py-2"
                        required
                        readOnly
                    />
                </label>
                <div className="w-full flex justify-end mt-6">
                    <button
                        type="submit"
                        className="mt-4 w-1/6 py-2 px-4 bg-[#f28202] text-white rounded hover:hover:bg-[#ca6404]"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </section>
    );
}
