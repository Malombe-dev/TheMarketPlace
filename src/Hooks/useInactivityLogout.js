import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useInactivityLogout = (timeout = 300000) => { // default: 5 minutes
  const navigate = useNavigate();
  const timer = useRef(null);

  const logout = () => {
    // Clear token and redirect
    localStorage.removeItem('authToken');
    alert('Logged out due to inactivity');
    navigate('/login'); // Adjust if your login route is different
  };

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(logout, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
};

export default useInactivityLogout;
