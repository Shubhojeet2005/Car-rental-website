import mongoose from 'mongoose';

const driverCarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    charges: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const driverCarModel =
  mongoose.models.DriverCar || mongoose.model('DriverCar', driverCarSchema);

export default driverCarModel;

