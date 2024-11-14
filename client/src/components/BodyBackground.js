// components/BackgroundUpdater.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import backgroundImage from '../assets/bg-party.jpg';

const BackgroundUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const updateBackground = () => {
      switch (location.pathname) {
        case '/login':
            document.body.style.backgroundImage = `url(${backgroundImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
          break;
        default:
          document.body.style.backgroundColor = '#ffffff';
          break;
      }
    };

    updateBackground();

    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
    };
  }, [location.pathname]);

  return null;
};

export default BackgroundUpdater;
