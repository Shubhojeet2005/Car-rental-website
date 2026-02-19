const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    driverUserName: {
        type: String,
        required: true
    },
    DriverPassword: {
        type: String,
        required: true
    },
    driverEmail: {
        type: String,
        required: true
    },
    driverPhone: {
        type: String,
        required: true
    },
    driverAddress: {
        type: String,
        required: true
    }
});