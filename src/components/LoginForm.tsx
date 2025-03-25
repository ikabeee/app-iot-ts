import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Send } from "lucide-react";

export default function LoginForm() {
    return (
        <Form validationBehavior="aria">
            <Input
                isRequired
                name="Correo electrónico"
                label="Tu correo"
                placeholder="example@gmail.com"
                validate={(value) => {
                    if (value.length < 0) {
                        return 'El usuario no debe estar vacío'
                    }
                }}
            />
            <Input
                isRequired
                type="password"
                name="Correo electrónico"
                label="Tu contraseña"
                placeholder="*********"
                validate={(value) => {
                    if (value.length < 0) {
                        return 'El usuario no debe estar vacío'
                    }
                }}
            />
            <Button className="" color="secondary" startContent={<Send/>}>Enviar</Button>
        </Form>
    )
}