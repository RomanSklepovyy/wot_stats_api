const mongoose = require('mongoose');

const gameProfileSchema = new mongoose.Schema({
    accountId: {
        required: true,
        type: String,
    },
    nickname: {
        required: true,
        type: String,
        trim: true,
        unique: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    stats: {
        type: Object,
    }
}, {
    timestamps: true
});

const GameProfile = mongoose.model('GameProfile', gameProfileSchema);

module.exports = GameProfile;