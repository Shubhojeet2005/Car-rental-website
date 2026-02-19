import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    car_license_no: {
      type: String,
      required: true,
      trim: true,
    },
    car_name: {
      type: String,
      required: true,
      trim: true,
    },
    doc_upload: {
      type: String,
      default: '',
    },
    car_picture: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const driverModel = mongoose.models.Driver || mongoose.model('Driver', driverSchema);

export default driverModel;
