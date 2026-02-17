import mongoose from 'mongoose';
const formSchema = new mongoose.Schema({
    carName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passenger: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    days: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    seconds: { type: Number, default: 0 },
    milliseconds: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    place1: { type: String, default: '' },
    place2: { type: String, default: '' },
    place3: { type: String, default: '' },
    place4: { type: String, default: '' },
    place5: { type: String, default: '' },
    place6: { type: String, default: '' },
    
});
const formModel=mongoose.model('forms',formSchema);
export default formModel;