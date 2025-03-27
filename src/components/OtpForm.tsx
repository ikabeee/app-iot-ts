import { useState } from "react";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import { Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom"; 
import AuthService from "../services/AuthService";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "@heroui/spinner";

export default function OtpForm() {
  const [otp, setOtp] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = location.state?.email;

  const handleOtpChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    // Solo permitir números
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!otp || !email) {
        setError("Por favor ingresa el OTP y asegúrate de que tu correo esté disponible.");
        return;
      }

      if (otp.length !== 6) {
        setError("El código OTP debe tener 6 dígitos");
        return;
      }

      setLoading(true);
      setError("");

      const response = await AuthService.verifyOTP({ 
        token: otp,
        email: email 
      });

      console.log('OTP verification response:', response);

      if (response.status === 200) {
        if (response.data.payload) {
          login({
            id: response.data.payload.id,
            name: response.data.payload.name,
            email: response.data.payload.email,
            avatar: response.data.payload.avatar
          });
          navigate("/admin");
        } else {
          setError("Error: No se recibieron los datos del usuario");
        }
      } else {
        setError("Error al verificar el OTP. Intenta nuevamente.");
      }
    } catch (err: any) {
      console.error('Error en verificación OTP:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || "Código OTP inválido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-4 space-y-6 flex flex-col justify-center items-center">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="secondary" />
          <p className="text-secondary">Verificando tu código OTP...</p>
        </div>
      ) : (
        <>
          <InputOtp
            value={otp}
            onChange={handleOtpChange}
            length={6}
            placeholder="Ingresa el código OTP"
            className="items-center justify-center"
            isInvalid={error !== ""}
            errorMessage={error}
            classNames={{
              input: "text-center",
              wrapper: "justify-center"
            }}
          />
          <Button
            className="w-full"
            color="secondary"
            startContent={<Send />}
            onClick={handleSubmit}
            isDisabled={otp.length !== 6}
          >
            Verificar
          </Button>
        </>
      )}
    </div>
  );
}
