import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../src/assets/fontAwesomeConfig";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/Landingpage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";

import Admin from "./pages/Admin";

import SearchProfile from "./pages/SearchProfile";

import Create from "./pages/Create";
import CreateEvent from "./components/CreateEvent";
import CreatePost from "./pages/CreatePost";

import Posts from "./pages/Posts";
import UpdatePost from "./pages/PostUpdate";
import PostShow from "./pages/PostShow";

import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import ProfileEdit from "./pages/ProfileEdit";

import ShowEvents from "./pages/EventsShow";
import EventUpdate from "./components/UpdateEvent";

import ChatView from "./pages/Chat";

import Communities from "./pages/Communities";
import CommunityChat from "./components/Community/ChatCommunity";
import CreateCommunity from "./components/Community/CreateCommunity";
import UpdateCommunity from "./components/Community/UpdateCommunity";

import Premium from "./components/Premium/Premium";

import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas protegidas */}
          {/* Inicio */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Home />
              </ProtectedRoute>
            }
          />
          {/* Vista Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Premium */}
          <Route
            path="/premium"
            element={
              <ProtectedRoute>
                <Navbar />
                <Premium />
              </ProtectedRoute>
            }
          />
          {/* Buscador */}
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Navbar />
                <SearchProfile />
              </ProtectedRoute>
            }
          />
          {/* Creacion de Posteos y Eventos */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Navbar />
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/event"
            element={
              <ProtectedRoute>
                <Navbar />
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/post"
            element={
              <ProtectedRoute>
                <Navbar />
                <CreatePost />
              </ProtectedRoute>
            }
          />
          {/* Publicaciones */}
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Navbar />
                <Posts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <PostShow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-post/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <UpdatePost />
              </ProtectedRoute>
            }
          />
          {/* Eventos */}

          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <ShowEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-event/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <EventUpdate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Navbar />
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <Navbar />
                <ProfileEdit />
              </ProtectedRoute>
            }
          />

          {/* Chat */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Navbar />
                <ChatView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <ChatView />
              </ProtectedRoute>
            }
          />

          {/* Comunidades */}
          <Route
            path="/create/community"
            element={
              <ProtectedRoute>
                <Navbar />
                <CreateCommunity />
              </ProtectedRoute>
            }
          />

          <Route
            path="/update-community/:communityId"
            element={
              <ProtectedRoute>
                <Navbar />
                <UpdateCommunity />
              </ProtectedRoute>
            }
          />

          <Route
            path="/communities"
            element={
              <ProtectedRoute>
                <Navbar />
                <Communities />
              </ProtectedRoute>
            }
          />

          <Route
            path="/communities/:communityId"
            element={
              <ProtectedRoute>
                <Navbar />
                <CommunityChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search-profiles"
            element={
              <ProtectedRoute>
                <Navbar />
                <SearchProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <UserProfile />
              </ProtectedRoute>
            }
          />
          {/* Rutas públicas */}
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={
              <>
                <Login />
                <Footer />
              </>
            }
          />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
