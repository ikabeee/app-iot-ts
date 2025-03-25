import { useState } from "react";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import { Send } from "lucide-react";
import { useLocation } from "react-router-dom"; 
import AuthService from "../services/AuthService";

export default function OtpForm() {
  const [otp, setOtp] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  const location = useLocation(); 
  const email = location.state?.email;  // Obtenemos el email desde el estado de la navegación

  const handleOtpChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;  // Obtenemos el valor del input
    setOtp(value);  // Guardamos el OTP ingresado
  };

  const handleSubmit = async () => {
    try {
      if (!otp || !email) {
        setError("Por favor ingresa el OTP y asegúrate de que tu correo esté disponible.");
        return;
      }

      setLoading(true);
      setError("");  // Reseteamos el error

      // Hacemos la llamada al servicio para verificar el OTP
      console.log(email, otp)
      const response = await AuthService.verifyOTP({ otp, email });
      console.log("Respuesta del servicio:", response);

      if (response.status === 200) {
        window.location.href = "/admin";  // Redirigimos si la verificación es exitosa
      } else {
        setError("Error al verificar el OTP. Intenta nuevamente.");
      }
    } catch (err) {
      setError("Código OTP inválido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-4 space-y-6 flex flex-col justify-center items-center">
      <InputOtp
        className="items-center"
        isInvalid={error !== ""}
        errorMessage={error}
        length={6}
        onChange={handleOtpChange}  // Usamos onChange correctamente
      />
      <Button
        className="w-full"
        color="secondary"
        startContent={<Send />}
        onPress={handleSubmit}  // Usamos onPress para capturar la acción de presionar el botón
        disabled={loading}  // Deshabilitamos el botón mientras se procesa la solicitud
      >
        {loading ? "Verificando..." : "Enviar"}
      </Button>
    </div>
  );
}
