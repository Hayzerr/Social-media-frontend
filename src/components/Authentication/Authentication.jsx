import {useEffect, useState} from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Authentication = () => {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => {
        setIsLogin(!isLogin);
    };


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                await axios.get('http://localhost:8080/api/post', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                navigate('/');
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);


    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? "Войти" : "Регистрация"}
                </h1>
                {isLogin ? <LoginForm /> : <RegisterForm />}
                <div className="text-center mt-4">
                    <button
                        onClick={toggleForm}
                        className="text-blue-500 hover:underline"
                    >
                        {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Authentication;
