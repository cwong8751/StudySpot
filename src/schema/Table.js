import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  numberOfChairs: {
    type: Number,
    required: true,
  },
  outletNearby: {
    type: Boolean,
    default: false,
  },
  toiletNearby: {
    type: Boolean,
    default: false,
  },
  capacity: {
    type: Number,
    required: true,
  },
  utilization: {
    type: Number,
    default: 0,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Table", tableSchema);
