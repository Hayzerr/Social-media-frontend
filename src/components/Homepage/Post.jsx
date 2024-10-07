import React, { useState, useEffect } from 'react';
import axios from "axios";
import Comment from "./Comment.jsx";

const Post = ({ post }) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const [likedByUsers, setLikedByUsers] = useState(post.likedByUsers || []);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        // Check if the current user has liked the post
       // console.log(likedByUsers.map(user => user.id));
        const currentUserId = Number(localStorage.getItem('userId'));
        setIsLiked(likedByUsers.some(user => user.id === currentUserId));
    }, [likedByUsers]);

   // console.log(isLiked);

    const handleAddComment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8080/api/comment/create/${post.id}`, { content: commentText }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setComments(prevComments => [...prevComments, response.data.response]);
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleLikePost = async () => {
        try {
            const token = localStorage.getItem('token');
            const currentUserId = Number(localStorage.getItem('userId'));

            if (isLiked) {
                // Unlike the post
                await axios.post(`http://localhost:8080/api/post/unlike/${post.id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setLikedByUsers(prevLikes => prevLikes.filter(user => user.id !== currentUserId));
            } else {
                // Like the post
                const response = await axios.post(`http://localhost:8080/api/post/like/${post.id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setLikedByUsers(response.data.response.likedByUsers);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    // Early return if post or user data is not available
    if (!post || !post.user) {
        return <div>Loading...</div>; // Handle loading state
    }

    const { user, caption, imageUrl } = post;

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="flex items-center mb-4">
                <img
                    src={user.userImage || '/default-profile.png'}
                    alt={user.username || 'User'}
                    className="w-12 h-12 rounded-full mr-3"
                />
                <h3 className="text-lg font-semibold">{user.username || 'Unknown User'}</h3>
            </div>
            <div className="mb-4">
                <img
                    src={imageUrl}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-lg"
                />
            </div>
            <div className="mb-2">
                <p>{caption}</p>
            </div>

            <div className="flex justify-between items-center">
                <button className="text-blue-500 hover:underline" onClick={handleLikePost}>
                    {isLiked ? 'Unlike' : 'Like'} {likedByUsers.length}
                </button>
                <button className="text-blue-500 hover:underline">Comment {comments.length}</button>
            </div>

            {/* Comments Section */}
            <div className="mt-4">
                {comments.length > 0 ? (
                    comments.map(comment => <Comment key={comment.id} comment={comment} />)
                ) : (
                    <p>No comments yet</p>
                )}
            </div>

            {/* Add Comment Section */}
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="border rounded p-2 w-full"
                />
                <button onClick={handleAddComment} className="text-blue-500 mt-2">Post Comment</button>
            </div>
        </div>
    );
};

export default Post;
