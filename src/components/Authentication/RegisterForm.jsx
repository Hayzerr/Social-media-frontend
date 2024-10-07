import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register } from "../../Services/AuthService"; // Импортируем функцию

const registerValidationSchema = Yup.object({
    username: Yup.string().required("Имя пользователя обязательно"),
    email: Yup.string().email("Неверный формат email").required("Email обязателен"),
    password: Yup.string().min(6, "Пароль должен быть минимум 6 символов").required("Пароль обязателен"),
});

const RegisterForm = () => {
    return (
        <Formik
            initialValues={{ username: "", email: "", password: "" }}
            validationSchema={registerValidationSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    const data = await register(values.username, values.email, values.password);
                    console.log("Registration successful", data);
                } catch (error) {
                    setErrors({ email: "Ошибка регистрации. Возможно, email уже используется" });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Имя пользователя
                        </label>
                        <Field
                            type="text"
                            name="username"
                            placeholder="Введите имя пользователя"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                        <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <Field
                            type="email"
                            name="email"
                            placeholder="Введите email"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Пароль
                        </label>
                        <Field
                            type="password"
                            name="password"
                            placeholder="Введите пароль"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
                    >
                        Зарегистрироваться
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;
