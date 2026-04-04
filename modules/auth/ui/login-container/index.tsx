"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField, Label, Input, FieldError, Button, Spinner, ErrorMessage } from "@heroui/react";
import { useFormik } from "formik";
import { useLogin } from "../../application/use-login";
import { loginSchema } from "../../domain/auth-schemas";

export const LoginContainer = () => {
	const router = useRouter();
	const { login } = useLogin();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: loginSchema,
		onSubmit: (values) => {
			login.mutate(values, {
				onSuccess: () => router.push("/home"),
			});
		},
	});

	return (
		<section className="flex h-dvh w-full flex-col items-center md:flex-row">
			<div className="flex flex-1 justify-center p-10">
				<form className="flex flex-col justify-center md:justify-normal" onSubmit={formik.handleSubmit}>
					<h1 className="mb-5 text-3xl font-semibold text-neutral-200">Iniciar sesión</h1>

					<TextField name="email" type="email" className="my-4" isInvalid={formik.touched.email && !!formik.errors.email}>
						<Label>Escriba su email</Label>
						<Input value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
						<FieldError>{formik.errors.email}</FieldError>
					</TextField>

					<TextField
						name="password"
						type="password"
						className="my-4"
						isInvalid={formik.touched.password && !!formik.errors.password}
					>
						<Label>Escriba su contraseña</Label>
						<Input value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
						<FieldError>{formik.errors.password}</FieldError>
					</TextField>

					<p className="mb-3 text-sm text-neutral-100">
						¿Te olvidaste tus credenciales?{" "}
						<Link href="/forgot-password" className="text-accent hover:underline">
							Recuperar cuenta
						</Link>
					</p>

					<p className="mb-5 text-sm text-neutral-100">
						¿Aún no tienes una cuenta?{" "}
						<Link href="/register" className="text-accent hover:underline">
							Crear cuenta
						</Link>
					</p>

					<ErrorMessage className="mb-4 text-center">
						{login.isError && <>Ocurrió un error al iniciar sesión</>}
					</ErrorMessage>

					<Button fullWidth type="submit" isPending={login.isPending}>
						{({ isPending }) => <>{isPending ? <Spinner color="current" /> : "Iniciar sesión"}</>}
					</Button>
				</form>
			</div>
		</section>
	);
};
