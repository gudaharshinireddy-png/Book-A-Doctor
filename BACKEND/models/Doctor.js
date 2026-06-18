const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    specialization:{
        type:String,
        required:true
    },

    experience:{
        type:Number,
        required:true
    },

    fees:{
        type:Number,
        required:true
    },

    hospital:{
        type:String
    },

    qualification:{
        type:String
    },

    availableDays:[
        {
            type:String
        }
    ],

    availableTime:{
        start:String,
        end:String
    },

    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model("Doctor",doctorSchema);