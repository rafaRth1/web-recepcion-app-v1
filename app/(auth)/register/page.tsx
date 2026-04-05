"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField, Label, Input, FieldError, Button, Spinner, ErrorMessage } from "@heroui/react";
import { useFormik } from "formik";
import { useRegister } from "@/modules/auth/hooks/use-register";
import { registerSchema } from "@/modules/auth/validations";

export default function RegisterPage() {
	const router = useRouter();
	const { register } = useRegister();

	const formik = useFormik({
		initialValues: {
			nickName: "",
			email: "",
			password: "",
		},
		validationSchema: registerSchema,
		onSubmit: (values) => {
			register.mutate(values, {
				onSuccess: () => router.push("/login"),
			});
		},
	});

	return (
		<section className="flex h-dvh w-full flex-col items-center md:flex-row">
			<div className="flex flex-1 justify-center p-10">
				<form className="flex flex-col justify-center md:justify-normal" onSubmit={formik.handleSubmit}>
					<h1 className="mb-5 text-3xl font-semibold text-neutral-200">Registro de usuario</h1>

					<TextField name="nickName" type="text" className="my-4">
						<Label>Escriba su sobre nombre</Label>
						<Input value={formik.values.nickName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
						<FieldError>{formik.touched.nickName && formik.errors.nickName}</FieldError>
					</TextField>

					<TextField name="email" type="email" className="my-4">
						<Label>Escriba su email</Label>
						<Input value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
						<FieldError>{formik.touched.email && formik.errors.email}</FieldError>
					</TextField>

					<TextField name="password" type="password" className="my-4">
						<Label>Escriba su contraseña</Label>
						<Input value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
						<FieldError>{formik.touched.password && formik.errors.password}</FieldError>
					</TextField>

					<p className="mb-3 text-sm text-neutral-100">
						¿Te olvidaste tus credenciales?{" "}
						<Link href="/forgot-password" className="text-accent hover:underline">
							Recuperar cuenta
						</Link>
					</p>

					<p className="mb-5 text-sm text-neutral-100">
						¿Ya tienes cuenta?{" "}
						<Link href="/login" className="text-accent hover:underline">
							Iniciar sesión
						</Link>
					</p>

					<ErrorMessage className="mb-4 text-center">{register.isError && <>Error al crear la cuenta</>}</ErrorMessage>

					<Button fullWidth type="submit" isPending={register.isPending}>
						{({ isPending }) => <>{isPending ? <Spinner color="current" /> : "Crear cuenta"}</>}
					</Button>
				</form>
			</div>
		</section>
	);
}
