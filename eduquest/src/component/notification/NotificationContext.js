import React, { createContext, useContext, useState, useEffect } from "react";
import Notification from "./Notification";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: "",
    type: "info",
    show: false, 
  });

  useEffect(() => {
    console.log("Notification state updated:", notification);
  }, [notification]);

  const showNotification = (message, type="info") => {
    setNotification({ message: message, type: type, show: true });
  }

  const hideNotification = () => {
    console.log("Hide notification")
    setNotification((prev) => ({ message: "", type: "info", show: false }));
  }

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Notification
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};
