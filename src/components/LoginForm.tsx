import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Send } from "lucide-react";

export default function LoginForm() {
    return (
        <Form validationBehavior="aria" className="w-full max-w-lg p-4 space-y-6">
            <Input
                isRequired
                name="email"
                label="Tu correo"
                placeholder="example@gmail.com"
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
                validate={(value) => {
                    if (!value) {
                        return 'La contraseña no debe estar vacía';
                    }
                }}
            />
                <Button className="w-full" href="/otp" color="secondary" startContent={<Send />}>Enviar</Button>

        </Form>
    )
}