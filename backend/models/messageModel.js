const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    from: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    to: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    text: { 
        type: String, 
        required: true,
        minlength: 1,  // Ensures the text is not empty
        maxlength: 500  // Optional: limits the length of the message
    },
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Export the Message model
module.exports = mongoose.model('Message', MessageSchema);
