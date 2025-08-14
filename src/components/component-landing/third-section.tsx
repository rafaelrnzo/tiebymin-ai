import { Check } from "lucide-react";
import Image from "next/image";

type Testimonial = {
  type: "image" | "text";
  content: string; // Bisa berisi URL gambar atau teks kutipan
  author: string;
  badgeType: "success" | "highlight"; // Menentukan warna badge
};

const testimonials: Testimonial[] = [
  {
    type: "image",
    content: "/hijab-1.png",
    author: "Yasmin Azizah",
    badgeType: "success",
  },
  {
    type: "image",
    content: "/hijab-2.png",
    author: "Yasmin Azizah",
    badgeType: "success",
  },
  {
    type: "text",
    content:
      '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
    author: "Yasmin Azizah",
    badgeType: "highlight",
  },
  {
    type: "image",
    content: "/hijab-3.png",
    author: "Yasmin Azizah",
    badgeType: "success",
  },
];

const AuthorBadge: React.FC<{
  author: string;
  type: "success" | "highlight";
}> = ({ author, type }) => {
  const badgeStyles = {
    success: "bg-[#E2F5E6] text-[#34A853]",
    highlight: "bg-[#FFE5ED] text-[#EF789B]",
  };

  return (
    <div
      className={`absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full ${badgeStyles[type]}`}
    >
      <div className="bg-white p-0.5 rounded-full">
        <Check size={14} className="stroke-current" />
      </div>
      <span className="font-semibold text-sm">{author}</span>
    </div>
  );
};

const TestimonialCard: React.FC<{ data: Testimonial }> = ({ data }) => {
  return (
    <div className="relative h-96 w-64 flex-shrink-0 overflow-hidden rounded-3xl shadow-lg transition-transform hover:-translate-y-2 duration-300">
      {data.type === "image" ? (
        <Image
          src={data.content}
          alt={`Testimonial by ${data.author}`}
          width={300}
          height={300}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="bg-[#323232] h-full w-full p-6 flex items-center">
          <p className="text-white font-medium text-lg italic">
            {data.content}
          </p>
        </div>
      )}
      <AuthorBadge author={data.author} type={data.badgeType} />
    </div>
  );
};

export const ThirdSection = () => {
  return (
    <section>
      <div className="container mx-auto px-4">
        <hr className="my-[5rem]" />
        <div className="flex flex-col items-center text-center lg:flex-row lg:text-start justify-between mb-10">
          <div>
            <h2 className="font-handlee italic text-[30px] lg:text-[46px] text-gray-900 mt-2">
              Dengar testimoni pengguna tercinta kita{" "}
            </h2>
          </div>
        </div>

        <div className="flex space-x-6 overflow-x-auto pb-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} data={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
