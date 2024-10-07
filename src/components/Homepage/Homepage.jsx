import Navbar from './Navbar';
import PostFeed from './PostFeed';

const Homepage = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="container mx-auto flex justify-center mt-6">
                <div className="w-full max-w-3xl">
                    <PostFeed />
                </div>
            </div>
        </div>
    );
};

export default Homepage;
