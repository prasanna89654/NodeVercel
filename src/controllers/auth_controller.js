import nodemailer from 'nodemailer';
import fs from 'fs';
import textflow from 'textflow.js'

textflow.useKey("M2r0T1ygGLz0qIz5yqrjsW0MfrjH5PBRVybwhd2XXLu93UdFAAY8uzXMzDGHMUBg");
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

const sendMail= async (req, res, next) => {
    const { email } = req.body;
try{
    let config = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service : 'Gmail',
        auth : {
            user: 'poudellprasanna789@gmail.com',
            pass: 'gybkvbmcxgzbuzke'
        }
    }
    let transporter = nodemailer.createTransport(config);
    var mailOptions={
         from: 'poudellprasanna789@gmail.com',
        to: email,
       subject: "Otp for Book Stack Registration",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
         next(error);
        }
        const jsonData = JSON.parse(fs.readFileSync('otp.json', 'utf8'));
        const newItem = { email: email, otp: otp };
        
        const existingIndex = jsonData.findIndex(item => item.email === email);
        console.log(existingIndex);
        
        if (existingIndex !== -1) {
          jsonData[existingIndex] = newItem;
        } else {
          jsonData.push(newItem);
        }
        
        fs.writeFileSync('otp.json', JSON.stringify(jsonData, null, 2));
        res.json({
        message: "OTP sent successfully"
        })
        // res.json({
        //     message: "OTP sent successfully"
        // })
    });

    
}
catch(err){
    next(err);
}
}


const verifyotp = (req,res, next)=> {
        const {email, userotp}  = req.body;
        const jsonData = JSON.parse(fs.readFileSync('otp.json', 'utf8'));
        const user = jsonData.find((user) => user.email === email);
        const otp = user.otp;
        if(otp == userotp){
            res.json({
                message: "OTP verified successfully"
            })
        }
        else{
           next("Incorrect OTP")
        }
    } 
    

    
const sendMsg = async (req, res, next) => {
    const { phone } = req.body;

    const verificationOptions ={
        service_name: 'My super cool app',
        seconds: 600,
    }

    const result = await textflow.sendVerificationSMS(phone, verificationOptions);

    return res.status(result.status).json(result.message)
}

const verifyMsg = (req, res, next) => {
    const { phone, userOtp } = req.body;
    if (otp == userOtp) {
        res.json({
            message: "OTP verified successfully"
        })
    } else {
        next("Incorrect OTP");
    }
}


export {

    sendMail,
    verifyotp,
    sendMsg,
    verifyMsg

}