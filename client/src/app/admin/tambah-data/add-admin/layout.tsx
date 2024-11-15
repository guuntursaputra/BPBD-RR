import * as React from 'react';
import AdminSidebar from '@/components/AdminNavbar';

export default function AddAdminLayout({ children }: {children: React.ReactNode;}) {
    return (
        <div className="flex min-w-full h-screen">
            <AdminSidebar />
            <main className="ml-64 w-full flex justify-center items-center p-6">{children}</main>
        </div>
    );
}
