import axios from 'axios';

  const API = "http://localhost:4000/api/auth";
  
const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await axios.post(`${API}/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
