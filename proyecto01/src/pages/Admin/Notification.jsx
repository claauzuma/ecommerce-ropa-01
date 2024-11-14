
import React, { useEffect } from 'react';
import PropTypes from 'prop-types'; 
import './Notificacion.css'; 

const Notification = ({ message, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, 3000); 
            return () => clearTimeout(timer); 
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <figure className="notification">
            <div className="notification__body">
                <div className="notification__description">
                    <div className="icon__wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                            viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                            fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 12l5 5l10 -10"></path>
                        </svg>
                    </div>                    
                    {message}
                </div> 
                <button className="notification__button" onClick={onClose}>
                    Close
                </button>
            </div>
            <div className="notification__progress"></div>
        </figure>
    );
};


Notification.propTypes = {
    message: PropTypes.string, 
    onClose: PropTypes.func.isRequired, 
};

export default Notification;
