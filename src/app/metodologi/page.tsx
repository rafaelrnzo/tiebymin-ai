import { Card } from "@/components/ui/card";
import {
  Info,
  Users,
  Palette,
  Shapes,
  Bot,
  CheckCircle,
  Star,
  Target,
  TriangleAlert,
  ShieldAlert,
} from "lucide-react";
import { Navbar } from "@/components/component-landing/navbar";
import Footer from "@/components/component-landing/footer-section";

const jenisAnalisaData = [
  {
    icon: <Shapes className="w-8 h-8 text-[#323232]" />,
    title: "Bentuk Wajah",
    description:
      "Teknik facial landmark detection berguna untuk mengidentifikasi bentuk wajah (oval, kotak, dll.).",
  },
  {
    icon: <Palette className="w-8 h-8 text-[#323232]" />,
    title: "Warna Kulit",
    description:
      "Studi undertone kulit dari jurnal dermatologi seperti 'Skin Tone Classification in Cosmetics'",
  },
  {
    icon: <Users className="w-8 h-8 text-[#323232]" />,
    title: "Bentuk Tubuh",
    description:
      "Referensi dari model Hourglass, Pear, Rectangle, dll, yang di validasi oleh pakar modest fashion.",
  },
];

const SectionTitle = ({
  children,
  info,
}: {
  children: React.ReactNode;
  info: string;
}) => (
  <div className="flex items-center justify-between bg-[#323232] gap-3 py-8 px-6 rounded-2xl mb-[50px] mt-[100px]">
    <h2 className="font-oswald text-3xl md:text-4xl font-bold text-white">
      {children}
    </h2>
    <div className="flex items-center gap-4">
      <Info className="w-6 h-6 text-white" />
      <p className="font-poppins font-bold text-xl text-white">{info}</p>
    </div>
  </div>
);

export default function MethodologyPage() {
  return (
    <div className="bg-white min-h-screen w-full font-poppins text-[#333]">
      <Navbar />
      <main className="lg:px-[200px] py-8 sm:py-12 md:py-16">
        <section className="mb-12 md:mb-16">
          <Card className="bg-[url('/card-bg.png')] bg-[#323232] h-[500px] text-white rounded-2xl shadow-xl p-8 md:p-12 text-center justify-center items-center">
            <h1 className="font-handlee italic text-4xl md:text-5xl text-[#FF7EA4]">
              Mengapa Analisa Kami Akurat dan Personal?
            </h1>
          </Card>
        </section>

        <section className="mb-12 md:mb-16">
          <SectionTitle info="Dasar Ilmiah di balik rekomendasi Hijab">
            Konsep Analisis
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 p-6">
              <p className="text-[#323232]">
                Analisis Tiebymin AI telah dirancang berdasarkan studi
                dermatologi, psikologi fashion, dan database visual untuk
                memberikan rekomendasi hijab yang sesuai dengan kepribadian,
                bentuk wajah, warna kulit, dan bentuk tubuh pengguna. Kami
                menggabungkan prinsip-prinsip dari:
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {jenisAnalisaData.map((item, index) => (
                <Card
                  key={index}
                  className="bg-[#FFC6C6] h-[210px] rounded-2xl border-0 shadow-md p-6 flex flex-col text-start"
                >
                  <p className="font-poppins font-bold">{item.title}</p>
                  <p className="font-poppins">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <SectionTitle info="Mengapa Kami Memilih 3 Fokus Utama?">
            Jumlah Analisis
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {jenisAnalisaData.map((item, index) => (
                <Card
                  key={index}
                  className="rounded-2xl h-[210px] border border-[#323232] p-6 flex flex-col items-center justify-center text-center shadow-sm"
                >
                  {item.icon}
                  <h3 className="font-poppins font-bold text-lg mt-4">
                    {item.title}
                  </h3>
                </Card>
              ))}
            </div>
            <div className="md:col-span-2 p-6">
              <p className="text-[#323232]">
                Kami memilih 3 fokus utama untuk menjaga keseimbangan antara
                akurasi dan kenyamanan pengguna. Studi dari {'"'}Efficient User
                Experience in Fashion Tech{'"'} menunjukkan bahwa analisis
                terfokus pada 3–5 variabel menghasilkan rekomendasi yang lebih
                praktis dan mudah diaplikasikan. Setiap fokus utama dipecah
                menjadi 5–10 parameter (misalnya: proporsi wajah, undertone
                kulit, dll.) untuk memastikan hasil yang mendalam tanpa
                membebani pengguna.
              </p>
            </div>
          </div>
        </section>

        {/* Hasil Analisa Section */}
        <section className="mb-10">
          <SectionTitle info="Mengapa Kami Menggunakan Foto Selfie + Pilihan Manual?">
            Bentuk Analisis
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-2xl border border-[#323232] p-6 shadow-sm">
              <div className="flex flex-col items-start gap-4">
                <div className="flex gap-4 items-center">
                  <Bot className="w-8 h-8 text-[#EF789B] shrink-0" />
                  <h3 className="font-oswald font-bold text-xl">Foto Selfie</h3>
                </div>
                <p className="text-[#323232]">
                  Analisis bentuk wajah dan warna kulit menggunakan AI yang
                  terlatih dengan dataset 10.000+ foto dari berbagai etnis dan
                  kondisi pencahayaan. Teknologi ini dirancang untuk menghindari
                  bias dengan memproses foto tanpa filter atau makeup
                  berlebihan.
                </p>
              </div>
            </Card>
            <div className="rounded-2xl border border-[#323232] p-6 shadow-sm">
              <div className="flex flex-col items-start gap-4">
                <div className="flex gap-4 items-center">
                  <CheckCircle className="w-8 h-8 text-[#EF789B] shrink-0" />
                  <h3 className="font-oswald font-bold text-xl">
                    Pilih Manual (Bentuk tubuh)
                  </h3>
                </div>
                <p className="text-[#323232]">
                  Pengguna memilih bentuk tubuh dari ilustrasi visual yang
                  jelas. Metode ini mengurangi kesalahan analisis karena bentuk
                  tubuh sulit dideteksi hanya melalui foto.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <Card className="bg-[#EF789B] text-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
              {/* Bagian Kiri */}
              <div className="flex items-center gap-4 w-full md:w-1/4 shrink-0 justify-center mt-5">
                <Star className="w-10 h-10 text-white fill-white" />
                <h3 className="font-oswald font-bold text-xl mt-auto">
                  Kelebihan Pendekatan Hybrid (AI + Manual)
                </h3>
              </div>
              {/* Bagian Kanan */}
              <div className="w-full md:w-3/4 md:pl-4">
                <ul className="list-disc list-inside space-y-3">
                  <li>
                    Menggabungkan akurasi AI untuk analisis visual dengan
                    kejelasan input manual untuk data subjektif.
                  </li>
                  <li>
                    Mengurangi bias teknologi dalam interpretasi bentuk tubuh.
                  </li>
                  <li>
                    Memberikan kontrol lebih kepada pengguna atas data pribadi
                    mereka.
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-12 md:mb-16">
          <SectionTitle info="Mengapa Kami Menggunakan Foto Selfie + Pilihan Manual?">
            Kombinasi Karakteristik
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className=" border rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <Target />
                <h3 className="font-oswald font-semibold text-lg">
                  Kontekstual
                </h3>
              </div>
              <p>
                Hasil disesuaikan dengan data yang kamu berikan. Jika ada
                perubahan berat badan atau gaya hidup, rekomendasi mungkin
                berbeda.
              </p>
            </Card>
            <Card className=" border rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <Target />
                <h3 className="font-oswald font-semibold text-lg">
                  Kontekstual
                </h3>
              </div>
              <p>
                Hasil disesuaikan dengan data yang kamu berikan. Jika ada
                perubahan berat badan atau gaya hidup, rekomendasi mungkin
                berbeda.
              </p>
            </Card>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="mb-12 md:mb-16">
          <SectionTitle info="Bagaimana Kami Menggabungkan Data untuk Rekomendasi?">
            Disclaimer
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-[#FFC6C6] border-0 rounded-2xl p-4 text-center">
              <TriangleAlert className="self-center" />
              <h3 className="font-oswald font-semibold text-lg">
                Bukan Alat Diagnostik
              </h3>
              <p>
                Rekomendasi hijab bisa berubah seiring tren atau perubahan
                preferensi pribadi.
              </p>
            </Card>
            <Card className="bg-[#FFC6C6] border-0 rounded-2xl p-4 text-center">
              <ShieldAlert className="self-center" />
              <h3 className="font-oswald font-semibold text-lg">
                Subjektivitas Gaya
              </h3>
              <p>
                Foto dan data yang kamu unggah tidak disimpan setelah analisis
                selesai.
              </p>
            </Card>
            <Card className=" border rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <Target />
                <h3 className="font-oswald font-semibold text-lg">
                  Kontekstual
                </h3>
              </div>
              <p>
                Hasil disesuaikan dengan data yang kamu berikan. Jika ada
                perubahan berat badan atau gaya hidup, rekomendasi mungkin
                berbeda.
              </p>
            </Card>
          </div>
          <p className="text-center text-[#323232] max-w-7xl mx-auto font-handlee text-[36px] italic my-[100px]">
            {'"'}Gunakan hasil tes ini sebagai panduan untuk mengeksplorasi gaya
            baru, bukan sebagai aturan baku. Kepercayaan diri adalah kunci utama
            dari penampilan yang memukau. Kami hanya membantu mengarahkan.{'"'}
          </p>
        </section>

        {/* Referensi Jurnal Section */}
        <section>
          <Card className="bg-[#323232] text-white rounded-2xl shadow-xl p-8 md:p-10">
            <h2 className="font-oswald text-3xl font-bold mb-6">
              Referensi Jurnal Ilmiah
            </h2>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-4">
              <p>
                <strong>1. Facial Feature Detection and Analysis:</strong>{" "}
                Menggunakan algoritma berbasis Convolutional Neural Networks
                (CNN) untuk mendeteksi landmark wajah seperti mata, hidung, dan
                garis rahang. Referensi dari {'"'}Deep Alignment Network: A
                convolutional neural network for robust face alignment{'"'} oleh
                M. Kowalski, et al.
              </p>
              <p>
                <strong>2. Skin Tone and Undertone Classification:</strong>{" "}
                Analisis warna kulit dilakukan dengan mengonversi ruang warna
                gambar dari RGB ke CIE L*a*b* untuk memisahkan iluminasi dari
                kromatisitas, memungkinkan deteksi undertone (cool, warm,
                neutral) yang lebih akurat. Terinspirasi dari penelitian {'"'}A
                Novel Method for Skin Color and Undertone Detection{'"'} oleh A.
                Gupta, et al.
              </p>
              <p>
                <strong>3. Body Shape Recognition:</strong> Memanfaatkan teknik
                estimasi pose untuk mengidentifikasi proporsi tubuh dan
                mengklasifikasikannya ke dalam bentuk umum (misalnya, pir, jam
                pasir, apel) berdasarkan rasio bahu, pinggang, dan pinggul.
                Metodologi ini diadaptasi dari {'"'}Human Pose Estimation with
                Deep Learning{'"'} oleh A. Newell, et al.
              </p>
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
