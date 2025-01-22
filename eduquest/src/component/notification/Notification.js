import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Notification = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); 
      return () => clearTimeout(timer); 
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`toast show position-fixed bottom-0 end-0 m-3`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ zIndex: 1055 }}
    >
      <div className={`toast-header bg-${type} text-white`}>
        <strong className="me-auto">Notification</strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "danger", "warning", "info"]).isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;
