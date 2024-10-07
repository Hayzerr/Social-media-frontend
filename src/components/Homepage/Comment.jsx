import React from 'react';

const Comment = ({ comment }) => {
    return (
        <div className="comment p-2 border-b border-gray-200">
            <p className="text-sm font-bold">{comment.user.username}</p>
            <p className="text-sm">{comment.content}</p>
        </div>
    );
};

export default Comment;
