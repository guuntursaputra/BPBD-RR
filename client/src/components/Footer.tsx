"use client"
import Image from 'next/image';
import logoKabCianjur from '@/assets/logo cianjur.png';
import logoBPBD from '@/assets/bpbd logo.png';

const Footer = () => {


    return (
        <footer className="w-full bg-[#F28202] py-12 text-white">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-6 md:mb-0">
                    <Image src={logoKabCianjur} alt="Logo Kabupaten Cianjur" width={120} height={120} />
                    <Image src={logoBPBD} alt="Logo BPBD" width={120} height={120} className="ml-4" />
                </div>
                <div className="flex flex-col md:flex-row md:space-x-8">
                    <div>
                    <h4 className="text-lg font-semibold mb-2">Our Service</h4>
                    <ul>
                        <li className="mb-2">Beranda</li>
                        <li className="mb-2">About Us</li>
                        <li className="mb-2">Structure</li>
                        <li className="mb-2">Contact</li>
                    </ul>
                    </div>
                    <div className="mt-4 md:mt-0">
                    <h4 className="text-lg font-semibold mb-2">Social Media</h4>
                    <ul>
                        <li className="mb-2">Instagram</li>
                        <li className="mb-2">Facebook</li>
                    </ul>
                    </div>
                    <div className="mt-4 md:mt-0">
                    <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
                    <ul>
                        <li className="mb-2">📞 +62-123-456-78</li>
                        <li className="mb-2">📍 Jl. Lika, Sawah Gede, Cianjur</li>
                    </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
