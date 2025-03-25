import { Link } from "react-router-dom";
import RegisterForm from "../../components/RegisterForm";

export default function Register() {
  return (
    <main className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4">¡Registrate con nosotros!</h1>
          <p className="text-gray-600 mb-8">Introduce tus datos para que formes parte del equipo</p>
          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="mt-4 text-gray-600">
              ¿Ya tienes una cuenta? <Link to="/" className="text-blue-600">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block flex-1 bg-cover bg-center rounded-l-2xl" style={{ backgroundImage: 'url(./../../../public/iot.webp)' }} />
    </main>
  );
}
