import axios from 'axios';
import styles from "../pages/SignupPage/SignupPage.module.css"

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
    <p
    className={styles["span"]}
      onClick={handleLogout}
    >
      Sign out
    </p>
  );
};

export default LogoutButton;
