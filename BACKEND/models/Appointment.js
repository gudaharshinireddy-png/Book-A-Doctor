const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
{
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },

    appointmentDate:{
        type:Date,
        required:true
    },

    appointmentTime:{
        type:String,
        required:true
    },

    reason:{
        type:String
    },

    status:{
        type:String,
        enum:[
            "pending",
            "approved",
            "completed",
            "cancelled",
            "rejected"
        ],
        default:"pending"
    }
},
{
    timestamps:true
}
);

module.exports =
mongoose.model(
"Appointment",
appointmentSchema
);