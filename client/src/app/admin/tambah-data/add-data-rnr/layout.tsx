import * as React from 'react';
import AdminSidebar from '@/components/AdminNavbar';

export default function TambahDataRnRLayout({ children }: {children: React.ReactNode;}) {
    return (
        <div className="flex min-w-full h-screen">
            <AdminSidebar />
            <main className="w-full flex justify-center items-center mt-5 ml-64 p-6">{children}</main>
        </div>
    );
}
