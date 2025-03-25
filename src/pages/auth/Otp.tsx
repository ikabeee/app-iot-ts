import OtpForm from "../../components/OtpForm";

export default function Otp() {
  return (
    <main className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4">Autenticación multifactor</h1>
          <p className="text-gray-600 mb-8">Introduce tu código OTP que fue enviado a tu correo</p>
          <OtpForm/>
        </div>
      </div>
      <div className="hidden lg:block flex-1 bg-cover bg-center rounded-l-2xl" style={{ backgroundImage: 'url(./../../../public/iot.webp)' }} />
    </main>
  );
}
