const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const users = [
  {
    user: "Rodwell Leo",
    phoneNumber: 795565344,
  },
  {
    user: "Rodwell Leonardo",
    phoneNumber: 790601107,
  },
];

const OTPs = [];
function generateOTP(contact) {
  //take the phone number then generate the OTP from the contact
  const numbers = contact.toString().slice("");
  const OTP = [];

  for (let i = 0; i < 4; i++) {
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    OTP.push(number);
  }

  OTPs.push({
    phoneNumber: contact,
    OTP: Number(OTP.join("")),
    createdOn: moment().format("YYYY-MM-DD HH:mm:ss"),
    expiresBy: moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss"),
  });
  return {
    OTP: Number(OTP.join("")),
    createdOn: moment().format("YYYY-MM-DD HH:mm:ss"),
    expiresBy: moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss"),
  };
}

function verifyUser(user) {
  //check if the user is in the OTPs list
  const isVerified = OTPs.find((otp) => {
    return otp.phoneNumber === user.phoneNumber && otp.OTP === user.OTP;
  });

  return isVerified;
}
app.post("/api/v1/auth/verify", (req, res) => {
  console.log(OTPs);
  const isVerified = verifyUser(req.body);
  isVerified
    ? res.status(200).json({
        message: "User verified successfully!",
      })
    : res.status(401).json({
        message: "OTP verification failed!",
      });
});

app.post("/api/v1/auth/login", (req, res) => {
  //get the user information
  const { phoneNumber } = req.body;

  //verify the phone number
  const user = users.find((user) => {
    return user.phoneNumber === phoneNumber;
  });

  if (user) {
    //generate the OTP for the user
    const { OTP, createdOn, expiresBy } = generateOTP(phoneNumber);

    res.status(200).json({
      phoneNumber: phoneNumber,
      OTP: OTP,
      expiresIn: 500,
      createdOn: createdOn,
      expiresBy: expiresBy,
    });
  } else {
    res.status(404).json({
      message: "User not found.",
    });
  }
});

const port = 5001;
app.listen(port, (req, res) => {
  console.log(`Server online on port ${port}`);
});
