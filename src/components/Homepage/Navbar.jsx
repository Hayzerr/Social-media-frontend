import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const searchUsers = async (term) => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/user/search?query=${term}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSearchResults(response.data.response);
                setLoading(false);
            } catch (error) {
                console.error('Error searching users:', error);
                setLoading(false);
            }
        };

        if (searchTerm.length > 0) {
            searchUsers(searchTerm);
        } else {
            setSearchResults([]); // Clear results if the search term is empty
        }
    }, [searchTerm]);

    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        // Redirect to login page or home page
        navigate('/auth'); // Adjust the route to your login page
    };

    return (
        <nav className="bg-white border-b border-gray-300 py-2">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold">
                    Social media
                </Link>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    {/* Search Results Dropdown */}
                    {(searchTerm.length > 0 && loading) ? (
                        <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full z-10 p-2">
                            Loading...
                        </div>
                    ) : (
                        searchTerm.length > 0 && (
                            <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full z-10">
                                {searchResults.length > 0 ? (
                                    <div>
                                        {searchResults.map(user => (
                                            <Link
                                                key={user.id}
                                                to={`/profile/${user.id}`}
                                                className="block text-blue-500 hover:bg-blue-100 hover:text-blue-700 p-2 transition duration-200"
                                            >
                                                {user.username}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-2 text-gray-500">No users found</div>
                                )}
                            </div>
                        )
                    )}
                </div>

                {/* Icons */}
                <div className="flex space-x-6">
                    <Link to="/add-post" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200">Add Post</Link>
                    <Link to="/messages" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200">Messages</Link>
                    <button onClick={handleLogout} className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200">
                        Logout
                    </button>
                    <Link to="/profile" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200">Profile</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
