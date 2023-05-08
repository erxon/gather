import Notification from "@/db/notification";
import dbConnect from "@/db/dbConnect";

export function saveNotification(notification) {
  const data = dbConnect().then(async () => {
    const newNotification = new Notification({
      ...notification,
      createdAt: new Date(),
    });
    try {
      await newNotification.save();
      return newNotification;
    } catch (err) {
      return err;
    }
  });
  return data;
}

//get notifications
export function getNotifications(event) {
  const data = dbConnect()
    .then(async () => {
      try {
        const notifications = await Notification.find({ event: event });
        return notifications;
      } catch (err) {
        return err;
      }
    })
    .catch((err) => {
      return err;
    });

  return data;
}

//delete notification
export function removeNotification(id) {
  const data = dbConnect()
    .then(async () => {
      try {
        const notification = await Notification.findByIdAndDelete(id);
        return notification;
      } catch (err) {
        return err;
      }
    })
    .catch((err) => {
      return err;
    });
  return data;
}
