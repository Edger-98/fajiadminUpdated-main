// Logout.js
// Logout.js
import React from 'react';
import { ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
  
    
    <ListItemText className="sidebarText"  onClick={handleLogout} primary="Logout" style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFF', cursor: 'pointer' }} />
    
  );
};

export default Logout;