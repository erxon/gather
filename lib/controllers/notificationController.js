import Notification from "@/db/notification";
import dbConnect from "@/db/dbConnect";

export async function getCount(req, res) {
  const { channel } = req.query;
  try {
    await dbConnect();
    const data = await Notification.find({ channel: channel });
    res.status(200).json({ count: data.length });
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
}

export async function getNotificationsForContacts(req, res){
  try {
    await dbConnect();
    const user = await req.user;
    const data = await Notification.find({channel: `contact-${user._id}`})

    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({error: error, message: "Something went wrong."})
  }
}

export function saveNotification(notification) {
  const data = dbConnect().then(async () => {
    const newNotification = new Notification({
      ...notification,
      createdAt: new Date(),
    });
    try {
      const result = await newNotification.save();
      return result;
    } catch (err) {
      return err;
    }
  });
  return data;
}

//get notifications
export function getNotificationsByChannel(channel){
  const data = dbConnect()
    .then(async () => {
      try {
        const notifications = await Notification.find({
          channel: channel
        });
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

export function getNotifications(channel, event) {
  const data = dbConnect()
    .then(async () => {
      try {
        const notifications = await Notification.find({
          channel: channel,
          event: event,
        });
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

export function removeAll(channel, event) {
  const data = dbConnect().then(async () => {
    try {
      const result = await Notification.deleteMany({
        channel: channel,
        event: event,
      });
      return result;
    } catch (err) {
      return err;
    }
  });
  return data;
}
