import { Instagram } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "../ui/button";

interface StoryQRSectionProps {
  handleDownloadStory: () => void;
  isGenerating: boolean;
}

export const StoryQRSection = ({
  handleDownloadStory,
  isGenerating,
}: StoryQRSectionProps) => {
  return (
    <div className="w-full flex flex-col justify-center items-center border rounded-xl py-4">
      <QRCode
        value="https://tiebyminai.withsummon.com/"
        size={173}
        className="mt-auto"
      />
      <p className="text-xl font-poppins mt-auto mx-10">
        Yuk share ke temen kamu untuk coba AI ini dengan scan barcode di atas!
      </p>
      <div className="flex justify-center items-center gap-10 mt-6 mb-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleDownloadStory();
          }}
          rel="noopener noreferrer"
          className="border w-[230px] flex items-center space-x-1 text-sm"
          disabled={isGenerating}
        >
          {isGenerating ? (
            "Generating..."
          ) : (
            <>
              <Instagram />
              <span className="font-medium font-poppins">tiebymin</span>
            </>
          )}
        </Button>
        <a
          href="https://www.tiktok.com/@tiebymin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="border w-[230px] flex items-center space-x-1 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-tiktok"
              viewBox="0 0 16 16"
            >
              <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
            </svg>
            <span className="font-medium font-poppins">tiebymin</span>
          </Button>
        </a>
      </div>
    </div>
  );
};
