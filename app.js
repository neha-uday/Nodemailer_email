const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app= express();

//View Engine setup
app.engine('handlebars', exphbs());
app.set('view engine','handlebars');

//Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Public or static folder
app.use('/public',express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=> {
    res.render('contact', {layout:false} );
});

app.post('/send',(req,res)=>{
   const output = `
     <p>You have new contact request</p>
     <h3>Contact Details</h3>
     <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
     </ul>
     <h3>Message</h3>
     <p>${req.body.message}</p>
   `;

   // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'nehauday2000@gmail.com', // generated ethereal user
      pass: 'neha@gmail' // generated ethereal password
    },
    tls:{
        rejectUnauthorized:false
    }
  });

   // setup email data with unicode symbols
   let mailoptions = {
    from: '"Nodemailer Contact" <test@gmail.com>', // sender address
    to: 'glanehyfaj@gmail.com', // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };
   

  // send mail with defined transport object
  transporter.sendMail(mailoptions, (error,info) => {
      if(error) {
          return console.log(error);
      }

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview only available when sending through an Ethereal account

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...}
  
  res.render('contact',{msg:'Email has been Sent'});
  res.render('contact',{layout:false});
  

});
});

app.listen(2000,() => console.log('Server started ...'));
