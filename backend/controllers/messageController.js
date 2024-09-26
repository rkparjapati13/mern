const Message = require('../models/messageModel');
const mongoose = require('mongoose');

exports.createMessage = async (req, res) => {
    try {
        const sender = req.user?.id; // Get the sender's ID from the request
        if (!sender) {
            return res.status(400).json({ error: 'User not found' }); // Return if sender not found
        }

        const { text, receiver } = req.body; // Extract text and receiver from the request body

        // Convert receiver to ObjectId if it's not already
        const receiverId = new mongoose.Types.ObjectId(receiver);

        // Create a new message
        const message = new Message({ text, from: sender, to: receiverId });
        await message.save(); // Save the message

        // Populate the sender and receiver fields
        // const populatedMessage = await Message.findById(message._id)
        //     .populate('from') // Populate sender information
        //     .populate('to');   // Populate receiver information

        const populatedMessage = await Message.aggregate([
            {
                $match: {
                    _id: message._id // Match the message by its ID
                }
            },
            {
                $addFields: {
                    senderRole: "self" // Add senderRole with a static value
                }
            },
            {
                $lookup: {
                    from: 'users', // Assuming 'users' is your user collection
                    localField: 'from',
                    foreignField: '_id',
                    as: 'sender'
                }
            },
            {
                $lookup: {
                    from: 'users', // Assuming 'users' is your user collection
                    localField: 'to',
                    foreignField: '_id',
                    as: 'receiver'
                }
            },
            {
                $unwind: '$sender' // Unwind the sender array to get the object
            },
            {
                $unwind: '$receiver' // Unwind the receiver array to get the object
            }
        ]);
        res.status(201).json(populatedMessage[0]); // Respond with the populated message
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle any errors
    }
};

exports.getMessages = async (req, res) => {
    try {
        // Convert currentUserId and otherUserId to ObjectId
        const currentUserId = new mongoose.Types.ObjectId(req.user.id); // Convert to ObjectId
        const otherUserId = new mongoose.Types.ObjectId(req.params.id); // Convert to ObjectId
        // Validate user IDs
        if (!currentUserId || !otherUserId) {
            return res.status(400).json({ error: 'Both user IDs are required' });
        }

        // Use the aggregation pipeline to find messages exchanged between the current user and the other user
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { from: currentUserId, to: otherUserId },
                        { from: otherUserId, to: currentUserId }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users', // The collection to join with
                    localField: 'from', // Field from the messages collection (from: sender)
                    foreignField: '_id', // Field from the users collection
                    as: 'fromDetails' // Output array field for sender details
                }
            },
            {
                $lookup: {
                    from: 'users', // Lookup receiver (to) details
                    localField: 'to',
                    foreignField: '_id',
                    as: 'toDetails' // Output array field for receiver details
                }
            },
            {
                // Add a new field `senderRole` to indicate who sent the message
                $addFields: {
                    senderRole: {
                        $cond: {
                            if: { $eq: ["$from", currentUserId] }, // Check if the current user is the sender
                            then: "self", // If true, set senderRole to "self"
                            else: "other" // Otherwise, set senderRole to "other"
                        }
                    }
                }
            },
            {
                // Sort the messages by creation date (ascending)
                $sort: { createdAt: 1 } // Sort by the createdAt field (oldest to newest)
            }
        ]);

        // Respond with the list of messages
        res.status(200).json(messages);
    } catch (error) {
        // Log the error for debugging
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: error.message });
    }
};
