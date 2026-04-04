import * as Yup from "yup";

export const loginSchema = Yup.object({
	email: Yup.string().email("Ingresa un correo válido").required("El correo es requerido"),
	password: Yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
});

export const registerSchema = Yup.object({
	nickName: Yup.string().min(3, "Mínimo 3 caracteres").required("El sobre nombre es requerido"),
	email: Yup.string().email("Email inválido").required("El email es requerido"),
	password: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es requerida"),
});
