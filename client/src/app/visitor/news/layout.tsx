import React from 'react';
import Footer from '@/components/Footer';
import VisitorNavbar from '@/components/VisitorNavbar';

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <VisitorNavbar />
      <div className='mt-24 h-screen'>
        {children}    
      </div>
      <Footer />
    </div>
  );
}
