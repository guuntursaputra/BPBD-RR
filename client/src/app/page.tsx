"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";
import imgAboutUs from '@/assets/about us.png';
import imgStructure from '@/assets/structure.png';
import contactUs from '@/assets/contact us.png';
import Footer from "@/components/Footer";
import VisitorNavbar from "@/components/VisitorNavbar";

export default function Home() {
  const router = useRouter(); 

  return (
    <>
      <VisitorNavbar />
      <section className="flex flex-col w-full justify-center items-center">
        <div
          className="relative flex items-center min-h-screen px-8 pt-16 bg-cover bg-center"
          style={{ backgroundImage: "url('/bpbd-bg.png')" }}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>

          <div className="relative z-10 text-start text-white flex flex-col px-2">
            <h4 className="text-4xl font-semibold italic">BPBD PEMKAB CIANJUR</h4>
            <h1 className="text-7xl md:text-9xl font-bold mb-2">Sistem Informasi Manajemen</h1>
            <p className="text-2xl md:text-4xl mt-4 font-medium">Bidang Rehabilitasi dan Rekonstruksi</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20" id="about">
          <h2 className="text-6xl font-bold mb-6 text-center md:text-start">About Us</h2>
          <div className="md:flex md:justify-between md:items-center gap-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <p className="text-lg leading-relaxed text-gray-700 text-justify">
                BPBD adalah Badan Penanggulangan Bencana Daerah yang bertanggung jawab atas penanggulangan bencana di tingkat kabupaten.
                Pembentukannya diatur pertama kali melalui Peraturan Menteri Dalam Negeri Nomor 46 Tahun 2008 dan Peraturan Kepala BNPB Nomor 3 Tahun 2008,
                yang menetapkan pedoman pembentukan BPBD di daerah.
                Di Kabupaten Cianjur, BPBD diatur dalam Peraturan Daerah No. 02 Tahun 2010, yang memperbarui Perda No. 07 Tahun 2008 tentang organisasi perangkat daerah.
                Aturan lebih lanjut tercantum dalam Perda No. 18 Tahun 2016 tentang susunan perangkat daerah dan Peraturan Bupati No. 83 Tahun 2016 yang mengatur tugas,
                fungsi, dan tata kerja BPBD.
              </p>
              <button 
                onClick={() => router.push('/visitor/detail-us')}
                className="mt-6 px-6 py-3 bg-[#F28202] text-white font-semibold rounded-lg"
              >
                Learn More
              </button>
            </div>

            <div className="md:w-1/2 flex justify-center md:justify-end">
              <Image src={imgAboutUs} alt="BPBD Cianjur" className="rounded-lg shadow-lg w-full md:w-4/5 object-cover" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20" id="structure">
          <h2 className="text-6xl font-bold mb-12 text-center">Organizational Structure</h2>
          <div className="flex justify-center">
            <Image src={imgStructure} alt="Organizational Structure" className="w-full md:w-3/4 object-contain" />
          </div>
        </div>

        <div className="container mx-auto px-4 min-h-screen" id="contact">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex flex-col md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-6xl font-bold mb-6">Contact Us</h2>
              <p className="text-lg text-gray-700 font-semibold mb-4">Jika ada yang perlu di tanyakan kami siap untuk membantu dengan:</p>
              <div className="flex items-center justify-center md:justify-start mb-4">
                <span className="text-2xl">📍</span>
                <p className="ml-2 text-lg">Jl. Lika, Sawah Gede, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43212</p>
              </div>
              <div className="w-full md:w-full mt-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31730.517499247987!2d107.12462926362353!3d-6.82409143581209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e684857f997ecdf%3A0x401e8f1fc28fe50!2sSawah%20Gede%2C%20Cianjur%2C%20Jawa%20Barat%2043212!5e0!3m2!1sen!2sid!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: "0" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <Image src={contactUs} alt="Contact Us" className="w-full object-contain" />
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}
