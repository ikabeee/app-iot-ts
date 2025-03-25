import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Send } from "lucide-react";
import { Form } from "@heroui/form";

export default function RegisterForm() {
  return (
    <Form validationBehavior="aria" className="w-full max-w-lg p-4 space-y-6">

          <Input
            isRequired
            name="name"
            label="Tu nombre"
            placeholder="John Doe"
            validate={(value) => {
              if (!value) {
                return 'El nombre no debe estar vacío';
              }
            }}
          />
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
      <Button href="/otp" className="w-full" color="secondary" startContent={<Send />}>Enviar</Button>
    </Form>
  );
}
