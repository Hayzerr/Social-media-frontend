import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth";

// Функция для логина
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signin`,
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
        const { token, id } = response.data.response;

        // Сохраняем токен в localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', id);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Ошибка на сервере");
    }
};

// Функция для регистрации
export const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, { username, email, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 409) {
            throw new Error("Пользователь с таким email или именем пользователя уже существует");
        } else {
            throw error.response ? error.response.data : new Error("Ошибка на сервере");
        }
    }
};
