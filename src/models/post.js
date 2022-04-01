const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    privacy: {
        type: String,
        enum: [ 'public', 'private' ],
        default: 'public',
        required: true,
    }
})

module.exports = mongoose.model('Post', postSchema)