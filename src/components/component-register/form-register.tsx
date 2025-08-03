import React from "react";
import { Button } from "../ui/button";

export default function FormRegister() {
  return (
    <div className="container mx-auto">
      <div className="flex">
        <div className="flex flex-col bg-[#EE769A] rounded-xl justify-center items-center">
          <p>tiebymin</p>
          <p>Mulai Dengan Kami</p>
          <p>Mulai perjalanan kecantikanmu dengan analisa kami</p>
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
            <p>Daftarkan Akun</p>
            <p>masukkan data pribadi Anda untuk membuat akun Anda</p>
          </div>
          <div className="flex">
            <div className="flex justify-between border rounded-full p-4">
              <p>Google</p>
              <p>G</p>
            </div>
            <div className="flex justify-between border rounded-full p-4">
              <p>Apple</p>
              <p>A</p>
            </div>
          </div>
          <div className="flex">
            <div className="border-t-2"></div>
            <p>Or</p>
            <div className="border-t-2"></div>
          </div>
          <div className="flex">
            <div className="flex flex-col">
              <p>Nama Lengkap</p>
              <p>text input</p>
            </div>
            <div className="flex flex-col">
              <p>Nama Panggilan</p>
              <p>text input</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p>Email</p>
            <p>text input</p>
          </div>
          <div className="flex flex-col">
            <p>Password</p>
            <p>text input</p>
            <p>Password harus lebih dari 8 karakter</p>
          </div>
          <Button size="lg">
            <p>Buat Akun</p>
          </Button>
          <div className="flex">
            <p>Sudah punya akun? </p>
            <p>Login</p>
          </div>
        </div>
      </div>
    </div>
  );
}
