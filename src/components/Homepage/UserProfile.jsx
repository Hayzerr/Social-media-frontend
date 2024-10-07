import React, { useEffect, useState } from 'react';
import Post from './Post'; // Assuming you have a Post component
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false); // State to manage follow/unfollow status
    const userId = window.location.pathname.split('/')[2]; // Get the userId from the URL

    // Check if the user is being followed by the current user
    useEffect(() => {
        const followCheck = async () => {
            const token = localStorage.getItem('token');
            try {
                const currentUserResponse = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (user && user.followers && user.followers.some(follower => follower.id === currentUserResponse.data.response.id)) {
                    setFollowing(true);
                } else {
                    setFollowing(false);
                }
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };

        if (user) followCheck(); // Only run followCheck if user is loaded
    }, [user]);

    // Fetch user profile on mount or userId change
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response.data.response);
                setUser(response.data.response);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    // Handle follow/unfollow actions
    const handleFollowUnfollow = async () => {
        try {
            console.log(user);
            const token = localStorage.getItem('token');
            if (following) {
                // Unfollow user
                const response = await axios.put(`http://localhost:8080/api/user/unfollow/${userId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUser(response.data.response);
            } else {
                // Follow user
                const response = await axios.put(`http://localhost:8080/api/user/follow/${userId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setUser(response.data.response);
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile bg-white shadow-lg rounded-lg p-4">
            <div className="profile-header flex items-center mb-4">
                <img
                    src={user.profileImage || '/default-profile.png'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                />
                <div className="ml-4">
                    <h2 className="font-bold text-xl">{user.username}</h2>
                    <p className="text-sm text-gray-500">{user.bio}</p>
                </div>
            </div>
            <p>Posts: {user.posts ? user.posts.length : 0}</p>
            <p>Followers: {user.followers ? user.followers.length : 0}</p>
            <p>Following: {user.following ? user.following.length : 0}</p>

            {/* Follow/Unfollow Button */}
            <button
                onClick={handleFollowUnfollow}
                className={`mt-2 px-4 py-2 rounded-md text-white ${following ? 'bg-red-500' : 'bg-blue-500'}`}
            >
                {following ? 'Unfollow' : 'Follow'}
            </button>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">User Posts</h3>
                <div>
                    {user.posts && user.posts.length > 0 ? (
                        user.posts.map(post => (
                            <Post key={post.id} post={post} />
                        ))
                    ) : (
                        <p>No posts yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
