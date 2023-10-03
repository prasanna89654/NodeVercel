import nodemailer from 'nodemailer';
import fs from 'fs';
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

jsonData.push(newItem);

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
    
    



export {

    sendMail,
    verifyotp

}