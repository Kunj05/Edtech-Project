const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/Template/emailVerficationEmail")

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    },
});


//to send email
async function sendVerificationEmail(email,otp){
    try {
        const mailResponse=await mailSender(email,"Verification Email from StudyNotion",otpTemplate(otp));
        console.log("Email sent successfully ",mailResponse);

    } catch (error) {
        console.log("Error occured while sending mail",error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})


module.exports=mongoose.model("OTP",OTPSchema)