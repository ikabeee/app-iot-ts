import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Send } from "lucide-react"
import { Form } from "@heroui/form"

export default function RegisterForm(){
    return(
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