"use client"
import { useRouter } from "next/navigation";
import Image from 'next/image';
import imgAboutUs from '@/assets/detail.png'; // Adjust path as needed

export default function DetailUs() {
    const router = useRouter();

  return (
    <div className="container mx-auto flex flex-col md:flex-col px-4 py-12 gap-8">
        <div className='w-full flex justify-between items-center'>
            <span 
                className='text-[#f28202] cursor-pointer' 
                onClick={() => router.push('/')}
            >
                Back To Dashboard
            </span>
            <h1 className="text-4xl font-bold mb-4">Tugas Dan Fungsi</h1>
        </div>

        <div className='flex w-full justify-between'>
            <div className="md:w-5/12 sticky top-0 flex justify-center items-start">
                <Image src={imgAboutUs} alt="BPBD Cianjur" className="rounded-lg shadow w-full" />
            </div>

            <div className="md:w-1/2 overflow-y-auto">
                <p className="text-lg text-gray-700 text-justify">
                    Berdasarkan peraturan Bupati Cianjur nomor 128 tahun 2022 tentang tugas dan fungsi, serta tata kerja unit organisasi di lingkungan Badan Penanggulangan Bencana Daerah Kabupaten Cianjur bidang Rehabilitasi dan Rekonstruksi pasal 19

                    (1)  Bidang rehabilitasi dan rekonstruksi dipimpin oleh seorang kepala bidang.
                    (2) Kepala bidang sebagaimana dimaksud pada ayat (1), mempunyai tugas membantu kepala pelaksana dalam memimpin, membina dan mengendalikan tugas-tugas di bidang pengkoordinasian, pengkomandoan dan pelaksanaaan penanggulangan bencana yang meliputi rehabilitasi dan rekonstruksi pasca bencana secara adil dan setara sesuai dengan kebijakan pemerintah daerah dan badan nasional penanggulangan bencana agar terkelola nya pelayanan pasca bencana.
                    (3) Dalam melaksanakan tugas sebagaimana dimaksud pada ayat (2), bidang rehabilitasi dan rekonstruksi menyelenggarakan fungsi :
                    a. Penetapan penyusunan rencana dan program kerja pengkoordinasian, pengkomandoan dan pelaksanaan rehabilitasi dan rekonstruksi pasca bencana
                    b. Penyelenggaraan pelaksanaan tugas di bidang pengkoordinasian, pengkomandoan dan pelaksanaan rehabilitasi dan rekonstruksi pasca bencana;
                    c. Perumusan sasaran pelaksanaan tugas di bidang pengkoordinasian, pengkomandoan dan pelaksanaan rehabilitasi dan rekonstruksi pasca bencana;
                    d. Pembinaan dan pengarahan pelaksanaan tugas di bidang pengkoordinasian, pengkomandoan dan pelaksanaan rehabilitasi dan rekonstruksi pasca bencana;
                    e. Penetapan rumusan kebijakan perbaikan dan pemulihan semua aspek pelayanan publik;
                    f. Penetapan rumusan kebijakan normalisasi aspek pemerintahan dan kehidupan masyarakat pada wilayah pasca bencana;
                    g. Penetapan rumusan kebijakan pembangunan prasarana dan sarana serta kelembagaan pada wilayah pasca bencana;
                    h. Penetapan rumusan kebijakan pertumbuhan perekonomian, sosial dan budaya, tegaknya hukum dan ketertiban;
                    i. Penetapan rumusan kebijakan peningkatan peranserta masyarakat dalam segala aspek kehidupan bermasyarakat pada wilayah pasca bencana;
                    j. penetapan rumusan kebijakan penguatan komunitas yang terkena bencana;
                </p>
            </div>
        </div>
    </div>
  );
}
