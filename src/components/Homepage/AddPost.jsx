import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Hook для навигации

const AddPost = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);  // State для файла
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();  // Hook для перенаправления

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  // Захватываем файл из инпута
    };

    const handleAddPost = async () => {
        if (!file) {
            setErrorMessage("Please select an image.");
            return;
        }

        try {
            const token = localStorage.getItem('token');  // Получаем токен

            // Создаем форму для загрузки файла
            const formData = new FormData();
            formData.append('file', file);

            // Загрузка файла на сервер
            const uploadResponse = await axios.post('http://localhost:8080/api/upload/photo', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            const uploadedImageUrl = "http://localhost:8080" + uploadResponse.data;  // Получаем URL изображения

            // Отправляем данные поста с URL изображения
            const postResponse = await axios.post('http://localhost:8080/api/post/create', {
                imageUrl: uploadedImageUrl,
                caption
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (postResponse.status === 201) {
                // Перенаправляем пользователя на страницу с постами после успешного добавления
                navigate('/');
            }
        } catch (error) {
            console.error('Error adding post:', error);
            setErrorMessage('Failed to add post. Please try again.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Add New Post</h2>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            <input type="file" onChange={handleFileChange} className="border p-2 w-full mb-4" />
            <textarea
                placeholder="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border p-2 w-full mb-4"
                maxLength="255"
            />

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleAddPost}
            >
                Add Post
            </button>
        </div>
    );
};

export default AddPost;
