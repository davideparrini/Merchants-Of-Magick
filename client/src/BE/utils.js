import momIcon from './asserts/icon-48x48.png';

export const sendNotification = (message) => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
        } else if (Notification.permission === "granted") {
            new Notification(message, { icon: momIcon });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(message, { icon: momIcon });
                }
            });
        }
    };