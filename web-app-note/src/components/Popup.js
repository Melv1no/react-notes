import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Popup = ({ message, onClose }) => {
  const popupRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      handleClickOutside(event);
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="popup" ref={popupRef}>
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

const showPopup = (customMessage) => {
  const popupRoot = document.createElement('div');
  document.body.appendChild(popupRoot);

  const closePopup = () => {
    ReactDOM.unmountComponentAtNode(popupRoot);
    document.body.removeChild(popupRoot);
  };

  const PopupWrapper = () => (
    <Popup message={customMessage} onClose={closePopup} />
  );

  ReactDOM.render(<PopupWrapper />, popupRoot);
};

export default showPopup;
