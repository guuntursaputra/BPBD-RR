"use client";
import Link from 'next/link';
import Image from 'next/image';
import kabCianjur from '@/assets/logo cianjur.png';
import BPBDRR from '@/assets/bpbd logo.png';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminSidebar = () => {
    const router = useRouter();

    // State for managing the expanded state of each menu item
    const [expandMenu, setExpandMenu] = useState({
        tambahData: false,
        masterData: false,
        visitorManage: false,
        listData: false
    });

    // Toggle function for menu expansion
    const toggleMenu = (menu) => {
        setExpandMenu(prevState => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        router.push('/'); // Redirect to login page
    };

    return (
        <aside className="fixed z-50 box-shadow-lg bg-white text-[#252525] h-full p-6 border-r-2 border-[#F28202] flex flex-col justify-between w-64">
            <div>
                <div className='flex w-48 justify-around mb-10'>
                    <Image src={kabCianjur} alt='logo kab cianjur' width={80} />
                    <Image src={BPBDRR} alt='logo bpbd' width={80}/>
                </div>
                <nav>
                    <Link href="/admin/recap-rnr" className="block my-2 text-lg py-2 px-4 hover:bg-[#FF9F0C] hover:text-white cursor-pointer font-semibold rounded-r-3xl">
                        Rekap Data RnR
                    </Link>
                    
                    {/* Tambah Data Section */}
                    <div>
                        <button onClick={() => toggleMenu('tambahData')} className="block w-full text-left my-2 text-lg py-2 px-4 hover:bg-[#FF9F0C] hover:text-white cursor-pointer font-semibold rounded-r-3xl">
                            Tambah Data
                        </button>
                        {expandMenu.tambahData && (
                            <div className="pl-6">
                                <Link href="/admin/tambah-data/add-data-rnr" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Data RnR</Link>
                                <Link href="/admin/tambah-data/add-admin" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Admin</Link>
                            </div>
                        )}
                    </div>

                    {/* Master Data Section */}
                    <div>
                        <button onClick={() => toggleMenu('masterData')} className="block w-full text-left my-2 text-lg py-2 px-4 hover:bg-[#FF9F0C] hover:text-white cursor-pointer font-semibold rounded-r-3xl">
                            Master Data
                        </button>
                        {expandMenu.masterData && (
                            <div className="pl-6">
                                <Link href="/admin/master-data/add-warga" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Warga</Link>
                                <Link href="/admin/master-data/add-perbankan" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Banking</Link>
                                <Link href="/admin/master-data/termin" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Termin</Link>
                            </div>
                        )}
                    </div>

                    {/* List Data Section */}
                    <div>
                        <button onClick={() => toggleMenu('listData')} className="block w-full text-left my-2 text-lg py-2 px-4 hover:bg-[#FF9F0C] hover:text-white cursor-pointer font-semibold rounded-r-3xl">
                            List Data
                        </button>
                        {expandMenu.listData && (
                            <div className="pl-6">
                                <Link href="/admin/list-data/admin" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Admin</Link>
                                <Link href="/admin/list-data/banking" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Banking</Link>
                                <Link href="/admin/list-data/warga" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Warga</Link>
                            </div>
                        )}
                    </div>

                    {/* Visitor Manage Section */}
                    <div>
                        <button onClick={() => toggleMenu('visitorManage')} className="block w-full text-left my-2 text-lg py-2 px-4 hover:bg-[#FF9F0C] hover:text-white cursor-pointer font-semibold rounded-r-3xl">
                            Visitor Manage
                        </button>
                        {expandMenu.visitorManage && (
                            <div className="pl-6">
                                <Link href="/admin/visitor-manage/news" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">News</Link>
                                <Link href="/admin/visitor-manage/about" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">About</Link>
                                <Link href="/admin/visitor-manage/footer" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Footer</Link>
                                <Link href="/admin/visitor-manage/contact" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Contact</Link>
                                <Link href="/admin/visitor-manage/struct" className="block my-1 text-md py-1 hover:text-[#FF9F0C] cursor-pointer">Struct</Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            <div className="mt-10">
                <button onClick={handleLogout} className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
                    Logout
                </button>
                <p className="mt-4 text-center text-sm text-gray-500">Version 1.0.0</p>
            </div>
        </aside>
    );
};

export default AdminSidebar;
