const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
}, {
    timestamps: true  // Enables createdAt and updatedAt fields
});

module.exports = mongoose.model('Post', PostSchema);