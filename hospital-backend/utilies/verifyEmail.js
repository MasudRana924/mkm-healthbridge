const nodemailer = require("nodemailer");
const verifyEmail=async(email,user_id)=>{
    try{
      const transporter = nodemailer.createTransport({
         host: 'smtp.gamil.com',
         port: 465,
         service:false,
        auth: {
          user: 'masud15-924@diu.edu.bd' ,
          pass: 'ncqxfxrawzwjlqbs',
        },
        tls: {
          rejectUnauthorized: false
      }
      });
    
      const mailOptions = {
        from: 'masud15-924@diu.edu.bd' ,
        to: email,
        subject: 'Verification Email',
       html:`<p>Hello  </p>`
      };
    
       transporter.sendMail(mailOptions,function(error,info){
            if(error){
               console.log(error);
            }else{
              console.log("Email has been sent",info.response);
            }
      });
    }catch(error){
        console.log(error)
    }
}
module.exports=verifyEmail;
