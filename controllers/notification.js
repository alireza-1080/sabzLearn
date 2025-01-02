import Notification from '../models/notification.js';
import notificationValidator from '../validators/notificationValidator.js';
import idValidator from '../validators/idValidator.js';

const createNotification = async (req, res) => {
    try {
        //^ Get instructor ID from the request object
        const instructor = req.userId;

        //^ Validate the instructor ID
        const { error: instructorIdValidationError } = idValidator.validate({ id: instructor });

        //^ Return a 400 response if there is a validation error
        if (instructorIdValidationError) {
            throw new Error("Instructor ID must be a valid ObjectId");
        }

        //^ Get the adminId and message from the request body
        const { adminId, message } = req.body;

        //^ Create a notification test object
        const notificationSample = {
            instructorId: instructor,
            adminId,
            message
        };

        //^ Validate the notification object
        const { error: notificationValidationError } = notificationValidator.validate(notificationSample);

        //^ Return a 400 response if there is a validation error
        if (notificationValidationError) {
            throw new Error(notificationValidationError);
        }

        //^ Create a new notification object
        const newNotification = new Notification(notificationSample);

        //^ Save the new notification object
        await newNotification.save();

        //^ Return a 201 response
        return res.status(201).json(newNotification);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
}

const getAdminNotifications = async (req, res) => {
    try {//^ Get the admin ID from the request object
        const admin = req.userId;

        //^ Validate the admin ID
        const { error: adminIdValidationError } = idValidator.validate({ id: admin });

        //^ Return a 400 response if there is a validation error
        if (adminIdValidationError) {
            return res.status(400).json({ message: "Admin ID must be a valid ObjectId" });
        }

        //^ Find the notifications that match the admin ID
        const notifications = await Notification.find({ adminId: admin })
        .populate('instructorId', {firstName: 1, lastName: 1})
        .populate('adminId', {firstName: 1, lastName: 1});

        //^ Return a 200 response
        return res.status(200).json(notifications);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
}

const markNotificationAsSeen = async (req, res) => {
    try {
        //^ Get the notification ID from the request parameters
        const { notificationId } = req.params;

        //^ Validate the notification ID
        const { error: notificationIdValidationError } = idValidator.validate({ id: notificationId });

        //^ Return a 400 response if there is a validation error
        if (notificationIdValidationError) {
            throw new Error("Notification ID must be a valid ObjectId");
        }

        //^ Get admin ID from the request object
        const admin = req.userId;
        console.log(admin);

        //^ Validate the admin ID
        const { error: adminIdValidationError } = idValidator.validate({ id: admin });

        //^ Return a 400 response if there is a validation error
        if (adminIdValidationError) {
            throw new Error("Admin ID must be a valid ObjectId");
        }

        //^ Get the notification by ID
        const notification = await Notification.findById(notificationId);

        //^ Return a 404 response if the notification is not found
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        //^ Check if the notification belongs to the admin
        if (notification.adminId.toString() !== admin) {
            return res.status(403).json({ message: "You are not authorized to mark this notification as seen" });
        }

        //^ Update the notification as seen
        await Notification.findByIdAndUpdate(notificationId, { isSeen: true });

        //^ Return a 200 response
        return res.status(200).json({ message: "Notification marked as seen successfully" });
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
}

const getAllNotifications = async (req, res) => {
    try {
        //^ Get all notifications
        const notifications = await Notification.find()
        .select({ updatedAt: 0, __v: 0 })
        .populate('instructorId', {firstName: 1, lastName: 1})
        .populate('adminId', {firstName: 1, lastName: 1});

        //^ Return a 200 response
        return res.status(200).json(notifications);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        //^ Get the notification ID from the request parameters
        const { notificationId } = req.params;

        //^ Validate the notification ID
        const { error: notificationIdValidationError } = idValidator.validate({ id: notificationId });

        //^ Return a 400 response if there is a validation error
        if (notificationIdValidationError) {
            throw new Error("Notification ID must be a valid ObjectId");
        }

        //^ Delete the notification by ID
        const notification = await Notification.findByIdAndDelete(notificationId);

        //^ Return a 404 response if the notification does not exist
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        //^ Return a 200 response if the notification is successfully deleted
        return res.status(200).json({ message: "Notification deleted successfully" });
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

export {
    createNotification,
    getAdminNotifications,
    markNotificationAsSeen,
    getAllNotifications,
    deleteNotification
};