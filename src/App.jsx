import Authentication from "./components/Authentication/Authentication.jsx";
import {Route, Routes} from "react-router-dom";
import Homepage from "./components/Homepage/Homepage.jsx";
import Profile from "./components/Homepage/Profile.jsx";
import AddPost from "./components/Homepage/AddPost.jsx";
import UserProfile from "./components/Homepage/UserProfile.jsx";


const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/auth" element={<Authentication/>}/>
                <Route path='/' element={<Homepage/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/add-post" element={<AddPost/>}/>
                <Route path="/profile/:userId" element={<UserProfile />} />
            </Routes>
        </div>
    );
}

export default App;