import React from "react";
import { Button } from "../ui/button";

export default function FormRegister() {
  return (
    <div className="container mx-auto">
      <div className="flex">
        <div className="flex flex-col bg-[#EE769A] rounded-xl justify-center items-center">
          <p>tiebymin</p>
          <p>Lengkapi Data Kamu!</p>
          <p>
            Tenang saja data kamu aman dan justru membantu kami memberikan
            analisa terbaik
          </p>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <p>Buat Akun</p>
              <div className="flex">
                <p>1</p>
              </div>
            </div>
            <div className="flex justify-between">
              <p>Lengkapi Data</p>
              <div className="flex">
                <p>2</p>
              </div>
            </div>
            <div className="flex justify-between">
              <p>Analisa</p>
              <div className="flex">
                <p>3</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <p>Lengkapi Data Diri</p>
            <p>
              lengkapnya data kamu membuat hasil analisa kami jauh lebih presisi
            </p>
          </div>
          <div className="flex">
            <div className="flex flex-col">
              <p>Tinggi Badan</p>
              <p>text input</p>
            </div>
            <div className="flex flex-col">
              <p>Berat Badan</p>
              <p>text input</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p>Umur</p>
            <p>text input</p>
          </div>
          <div className="flex flex-col">
            <p>Lokasi</p>
            <p>text input</p>
          </div>
          <Button size="lg">
            <p>Selanjutnya</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
