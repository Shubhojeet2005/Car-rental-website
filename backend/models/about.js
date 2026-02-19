const mongoose = require('mongoose');
const aboutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    email: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users'|| 'Driver',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const aboutModel = mongoose.models.about || mongoose.model('about', aboutSchema);
export default aboutModel;