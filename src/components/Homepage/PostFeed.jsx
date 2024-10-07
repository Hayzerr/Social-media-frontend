import React, { useEffect, useState } from 'react';
import Post from './Post';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const PostFeed = () => {
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/post', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPosts(response.data.response);
            } catch (error) {
                console.error('Error fetching posts:', error);
                navigate('/auth');
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            {posts.length > 0 ? (
                posts.map(post => (
                    <Post key={post.id} post={post} />
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default PostFeed;
