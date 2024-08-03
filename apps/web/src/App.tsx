import { AxiosError } from "axios";
import { getNotes, getUserInfo } from "./api/axios";
import { Button } from "./components/ui/button";

const App = () => {
  const handleLogin = () => {
    const loginUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/google?redirectUrl=http://localhost:5173/dashboard`;
    window.location.href = loginUrl;
  };

  const handleLogout = () => {
    const logoutUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/google/signout?redirectUrl=http://localhost:5173`;
    window.location.href = logoutUrl;
  };

  const handleGetNotes = async () => {
    try {
      const notes = await getNotes();
      console.log("🚀 ~ handleGetNotes ~ notes:", notes);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("🚀 ~ handleGetNotes ~ e:", e.response?.data);
      }
    }
  };

  const handleGetUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      console.log("🚀 ~ handleGetUserInfo ~ userInfo:", userInfo);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("🚀 ~ handleGetUserInfo ~ e:", e.response?.data);
      }
    }
  };

  return (
    <div className="flex h-screen flex-wrap items-center justify-center gap-3">
      <Button role="link" onClick={handleLogin}>
        Login with google
      </Button>

      <Button role="link" onClick={handleLogout}>
        Log out
      </Button>

      <Button onClick={handleGetUserInfo}>get user info</Button>

      <Button onClick={handleGetNotes}>Get notes</Button>
    </div>
  );
};
export default App;
