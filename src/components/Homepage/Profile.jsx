import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from "./Post.jsx";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [editing, setEditing] = useState(false);
    const [newBio, setNewBio] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setUser(response.data.response);
                setNewBio(response.data.response.bio);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleProfileUpdate = async () => {
        const token = localStorage.getItem('token');
        let profileImageUrl = user.profileImage; // Default to current image

        // Step 1: Upload profile image if selected
        if (profileImage) {
            const formData = new FormData();
            formData.append('file', profileImage);

            try {
                const uploadResponse = await axios.post('http://localhost:8080/api/upload/photo', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log(uploadResponse.data);

                profileImageUrl = "http://localhost:8080" + uploadResponse.data; // Get uploaded image URL
            } catch (error) {
                console.error('Error uploading image:', error);
                return;
            }
        }

        // Step 2: Update bio and profile image
        try {
            console.log(newBio);
            await axios.put('http://localhost:8080/api/user/profile/update', {
                bio: newBio,
                profileImageUrl: profileImageUrl
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('Profile updated successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }
  //  console.log(user);


    return (
        <div className="profile bg-white shadow-lg rounded-lg p-4">
            <div className="profile-header flex items-center mb-4">
                <img
                    src={user.userImage}
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
            <p>Following: {user.followings ? user.followings.length : 0}</p>

            <button
                onClick={() => setEditing(!editing)}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
                {editing ? 'Cancel' : 'Edit Profile'}
            </button>

            {editing && (
                <div className="mt-4">
                    <label className="block mb-2">Update Bio:</label>
                    <textarea
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        className="border rounded p-2 w-full"
                    />

                    <label className="block mt-4 mb-2">Change Profile Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        className="border rounded p-2 w-full"
                    />

                    <button
                        onClick={handleProfileUpdate}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Save Changes
                    </button>
                </div>
            )}

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Your Posts</h3>
                <div>
                    {user.posts.map(post => (
                        <Post key={post.id} post={post}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
