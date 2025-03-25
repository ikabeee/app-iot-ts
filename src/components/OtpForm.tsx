import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import { Send } from "lucide-react";

export default function OtpForm() {
    return (
      <div className="w-full max-w-lg p-4 space-y-6 flex flex-col justify-center items-center">
        <InputOtp className="items-center" isInvalid errorMessage="Invalid OTP code" length={6} />
        <Button className="w-full" href="/admin" color="secondary" startContent={<Send />}>Enviar</Button>
      </div>
    );
}