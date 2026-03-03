import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    default: 'DriveRent'
  },
  tagline: {
    type: String,
    required: true,
    default: 'Your Trusted Car Rental Partner'
  },
  description: {
    type: String,
    required: true,
    default: 'We provide affordable and reliable car rental services across India with the largest fleet of vehicles.'
  },
  missionStatement: {
    type: String,
    required: true,
    default: 'Our mission is to make car rental accessible, affordable, and convenient for every traveler.'
  },
  visionStatement: {
    type: String,
    required: true,
    default: 'To become the most trusted and customer-centric car rental platform in India.'
  },
  yearEstablished: {
    type: Number,
    required: true,
    default: 2020
  },
  foundedBy: {
    type: String,
    required: true,
    default: 'DriveRent Team'
  },
  totalCars: {
    type: Number,
    default: 0
  },
  totalCustomers: {
    type: Number,
    default: 0
  },
  totalTrips: {
    type: Number,
    default: 0
  },
  features: [{
    title: String,
    description: String,
    icon: String
  }],
  team: [{
    name: String,
    position: String,
    image: String,
    bio: String
  }],
  contactEmail: {
    type: String,
    required: true,
    default: 'info@driverent.com'
  },
  contactPhone: {
    type: String,
    required: true,
    default: '+91-9876543210'
  },
  address: {
    type: String,
    required: true,
    default: 'Delhi, India'
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('About', aboutSchema);