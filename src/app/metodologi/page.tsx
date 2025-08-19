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
  Heart,
  Database,
  Camera,
  SquareSquare,
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
          <SectionTitle info="Bagaimana Kami Menggabungkan Data untuk Rekomendasi?">
            Bentuk Analisis
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-2xl border border-[#323232] p-6 shadow-sm">
              <div className="flex flex-col items-start gap-4">
                <div className="flex gap-4 items-center">
                  <Camera className="w-8 h-8 text-[#323232] shrink-0" />
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
                  <SquareSquare className="w-8 h-8 text-[#323232] shrink-0" />
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
                <Heart fill="#323232" />
                <h3 className="font-poppins font-semibold text-lg">
                  Setiap rekomendasi hijab dihasilkan dari kombinasi:
                </h3>
              </div>
              <p>
                <b>Bentuk Wajah</b> (oval) + <b>Warna Kulit</b> (cool winter)
                →Rekomendasi hijab dengan layer panjang dan warna bold.
              </p>
              <p>
                <b>Bentuk Tubuh</b> (hourglass) → Paduan hijab dan pakaian yang
                menonjolkan pinggang ramping.
              </p>
            </Card>
            <Card className=" border rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <Database className="text-[#323232]" />
                <h3 className="font-poppins font-semibold text-lg">
                  Database yang Kami Gunakan:
                </h3>
              </div>
              <p>
                <b>Fashion Psychology:</b> Studi tentang bagaimana bentuk tubuh
                memengaruhi kepercayaan diri.
              </p>
              <p>
                <b>Color Theory:</b> Penelitian tentang harmonisasi warna hijab
                dengan undertone kulit.
              </p>
            </Card>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="mb-12 md:mb-16">
          <SectionTitle info="Penting untuk Diperhatikan">
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
            <h2 className="font-oswald text-3xl font-bold mb-6 text-center">
              Referensi Jurnal Ilmiah
            </h2>
            <hr className="text-[#f0f0f0]" />
            <div className="prose prose-invert prose-sm max-w-none text-[#f0f0f0] space-y-6 mt-5">
              <p className="flex flex-col gap-2">
                <b>Facial Landmark Detection & Face Shape Analysis</b> <br />{" "}
                Wu, Y., & Ji, Q. (2019). {'"'}Facial landmark detection: A
                literature survey.
                {'"'}
                International Journal of Computer Vision, Springer. (579
                citations) Cheng, W.H., Song, S., Chen, C.Y., et al. (2021).
                {'"'}Fashion meets computer vision: A survey.{'"'} ACM Computing
                Surveys. (233 citations) Liu, Z., Yan, S., Luo, P., et al.
                (2016). {'"'}Fashion landmark detection in the wild.{'"'}{" "}
                European Conference on Computer Vision, Springer. (232
                citations)
              </p>
              <p className="flex flex-col gap-2">
                <b>Skin Tone Classification & Color Matching</b> <br /> Ly,
                B.C.K., et al. (2020). {'"'}Cutaneous Colorimetry: A Reliable
                Technique for Objective Skin Color Evaluation.{'"'} Journal of
                Investigative Dermatology, ScienceDirect. (522 citations)
                Branigan, A.R., & Nunez, J.G. (2024). {'"'}Variation in Skin Red
                and Yellow Undertone: Reliability of Ratings and Predicted
                Relevance for Social Experiences.{'"'} Social Psychology
                Quarterly, Sage Publications. Heldreth, C.M., Monk, E.P., et al.
                (2024). {'"'}
                Which skin tone measures are the most inclusive? An
                investigation of skin tone measures for artificial intelligence.
                {'"'} ACM Journal on Responsible Computing. (42 citations)
              </p>
              <p className="flex flex-col gap-2">
                <b>Body Shape Analysis & Modest Fashion</b> <br /> Hidayati,
                S.C., Hsu, C.C., et al. (2018). {'"'}What dress fits me best?
                Fashion recommendation on the clothing style for personal body
                shape.
                {'"'} Proceedings of the 26th ACM International Conference on
                Multimedia. (111 citations) Hassan, S.H., & Harun, H. (2016).{" "}
                {'"'}Factors influencing fashion consciousness in hijab fashion
                consumption among hijabistas.{'"'} Journal of Islamic Marketing,
                Emerald. (187 citations) Putri, N.F., Hameed, A., et al. (2025).{" "}
                {'"'}Analysing the modest fashion market: an empirical study of
                e-commerce best-selling products.{'"'} Journal of Islamic
                Marketing, Emerald
              </p>
              <p className="flex flex-col gap-2">
                <b>AI Fashion Recommendation Systems</b> <br />
                Shirkhani, S., Mokayed, H., et al. (2023). {'"'}Study of
                AI-driven fashion recommender systems.
                {'"'} SN Computer Science, Springer. (33 citations) Kotouza,
                M.T., Tsarouchis, S.F., et al. (2020). {'"'}Towards fashion
                recommendation: an AI system for clothing data retrieval and
                analysis.{'"'} International Conference on Artificial
                Intelligence Applications and Innovations, Springer. (35
                citations)
              </p>
              <p className="flex flex-col gap-2">
                <b>Color Theory & Fashion Psychology</b>
                <br />
                Kodžoman, D. (2019). {'"'}The psychology of clothing: Meaning of
                colors, body image and gender expression in fashion.{'"'}{" "}
                Textile & Leather Review. (120 citations) Chattaraman, V., &
                Rudd, N.A. (2006). {'"'}
                Preferences for aesthetic attributes in clothing as a function
                of body image, body cathexis and body size.{'"'} Clothing and
                Textiles Research Journal, Sage Publications. (202 citations)
              </p>
              <p className="flex flex-col gap-2">
                <b>User Experience in Fashion Technology</b>
                <br /> Xue, L., Parker, C.J., & Hart, C.A. (2023). {'"'}How
                augmented reality can enhance fashion retail: a UX design
                perspective.{'"'} International Journal of Retail & Distribution
                Management, Emerald. (72 citations) Perlman, D. (2021). {'"'}The
                effect of user interface, user experience and design on mobile
                e-commerce applications in the fashion industry.{'"'} Pace
                University Honors College. (13 citations)
              </p>
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
