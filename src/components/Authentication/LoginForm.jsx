import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../../services/authService";
import {useNavigate} from "react-router-dom";

const loginValidationSchema = Yup.object({
    email: Yup.string().email("Неверный формат email").required("Email обязателен"),
    password: Yup.string().required("Пароль обязателен"),
});

const LoginForm = () => {
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    const data = await login(values.email, values.password);
                    console.log("Login successful", data);
                    navigate('/')
                } catch (error) {
                    setErrors({ email: error.message });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
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
                        Войти
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
