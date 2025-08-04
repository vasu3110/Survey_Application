import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Regular expressions for validation
const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

const systemSchema = new Schema(
  {
    deviceType:   { 
        type: String, required: true 
    },
    deviceName:   { 
        type: String, required: true 
    },
    serialNo:     { 
        type: String, required: true 
    },
    model:        { 
        type: String, required: true 
    },
    os:           { 
        type: String, required: true 
    },
    ipAddress:    { 
      type: String, required: true, 
      validate: {
        validator: v => ipv4Regex.test(v),
        message: props => `${props.value} is not a valid IPv4 address!`
      }
    },
    macAddress:   { 
      type: String, required: true,
      validate: {
        validator: v => macRegex.test(v),
        message: props => `${props.value} is not a valid MAC address!`
      }
    },
    antivirus:    { 
        type: String, required: true 
    },
    network:{
         type: String, required: true 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
    },
    roomNo:{ 
        type: Number, 
        required: true 
    },
    isActive:     {
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

systemSchema.plugin(mongooseAggregatePaginate);

export const System = mongoose.model("System", systemSchema);
