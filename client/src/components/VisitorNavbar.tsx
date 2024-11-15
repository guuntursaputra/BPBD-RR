import Link from 'next/link';
import logoKabCianjur from '@/assets/logo cianjur.png';
import logoBPBDRR from '@/assets/bpbd logo.png';
import Image from 'next/image';


const VisitorNavbar = () => {

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md text-[#252525] p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className='w-40 flex justify-between'>
                    <Image src={logoKabCianjur} alt='logo kab cianjur' width={70} />
                    <Image src={logoBPBDRR} alt='logo kab cianjur' width={70} />
                </div>
                <div>
                    <Link href="/" className='font-normal text-lg'>Beranda</Link>
                    <Link href="#about" className="ml-4 font-normal text-lg">About Us</Link>
                    <Link href="#structure" className="ml-4 font-normal text-lg">Structure</Link>
                    <Link href="#contact" className="ml-4 font-normal text-lg">Contact</Link>
                    <Link href="/visitor/news" className="ml-4 font-normal text-lg">News</Link>
                    <Link href="/visitor/recap" className="ml-4 font-normal text-lg border-b-4 border-[#F28202]">RnR Recap</Link>
                </div>
                <div>
                    <Link href="/login" className='px-4 py-2 bg-[#F28202] rounded-xl text-white font-semibold'>Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default VisitorNavbar;
