import mongoose from 'mongoose';

const tripNotificationSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'forms',
      required: true,
    },
    message: {
      type: String,
      required: true,
      default: 'You have been assigned a new trip.',
    },
    read: {
      type: Boolean,
      default: false,
    },
    customerEmail: {
      type: String,
      default: '',
    },
    carName: {
      type: String,
      default: '',
    },
    pickupDate: {
      type: Date,
    },
    pickupTime: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const TripNotification = mongoose.models.TripNotification || mongoose.model('TripNotification', tripNotificationSchema);
export default TripNotification;
