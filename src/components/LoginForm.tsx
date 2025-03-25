import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import AuthService from "../services/AuthService";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        try {
            const loginData = { email, password };
            const response = await AuthService.login(loginData);

            if (response.status === 200) {
                navigate('/otp', { state: { email } }); // Envia el correo al estado de la navegación
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            setErrorMessage('Error al iniciar sesión. Verifica tu correo y contraseña.');
        }
    };

    return (
        <Form validationBehavior="aria" className="w-full max-w-lg p-4 space-y-6" onSubmit={handleSubmit}>
            <Input
                isRequired
                name="email"
                label="Tu correo"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                validate={(value) => {
                    if (!value) {
                        return 'El correo no debe estar vacío';
                    }
                }}
            />
            <Input
                isRequired
                type="password"
                name="password"
                label="Tu contraseña"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                validate={(value) => {
                    if (!value) {
                        return 'La contraseña no debe estar vacía';
                    }
                }}
            />
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <Button className="w-full" type="submit" color="secondary" startContent={<Send />}>
                Enviar
            </Button>
        </Form>
    );
}
