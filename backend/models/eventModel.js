const { Schema, model } = require('../connection');

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    eventTime: {
        type: String,
        required: true,
    },
    eventLocation: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String,
        required: true,
    },
    eventImages: {
        type: [String],
        required: true,
    },
    panoramaImages: {
        type: [String],
        required: true,
    },
});
module.exports = model('event', eventSchema);