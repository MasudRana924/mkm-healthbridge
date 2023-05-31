const hireNurseModel = require('../models/HireNurse');
const ApiFeatures = require('../utilies/apiFeatures');
const SendEmail = require('../utilies/sendEmail');

// Create new appointment
exports.newHireNurse = async (req, res, next) => {
  const {
    nursename,
    nursefees,
    nurseimage,
    nurseId,
    phone,
    fees,
    totalFees,
    patientname,
    patientemail,
    patientgender,
    date,
    
  } = req.body;

  const hireNurse = await hireNurseModel.create({
    nursename,
    nursefees,
    nurseimage,
    nurseId,
    phone,
    fees,
    totalFees,
    patientname,
    patientemail,
    patientgender,
    date,
    user: req.user._id,
  });
  if(hireNurse){
    await SendEmail({
      email: patientemail,
      subject: "You have booked an Appointment",
     message:`Hii ${patientname}, You Hire  ${nursename} `
  });
  }
  res.status(201).json({
    success: true,
    hireNurse
  });

};

// get Single 
exports.getSingleHireNurse = async (req, res, next) => {
  const hireNurse = await hireNurseModel.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!hireNurse) {
    res.json({ message: "Not found a appointment with this id" })
  }

  res.status(200).json({
    success: true,
    appoinhireNursetment,
  });
};
// get logged in user  
exports.myHireNurse = async (req, res, next) => {
  const hireNurse = await hireNurseModel.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    hireNurse,

  });
};
// get all Appointments
exports.getAllHireNurse = async (req, res, next) => {
  const resultPerPage=3;
  const appointmentCount=await hireNurseModel.countDocuments();
  // const appointments = await appointmentModel.find();
  const apiFeature = new ApiFeatures(hireNurseModel.find(),req.query);
  const hireNurses = await apiFeature.query;
  apiFeature.pagination(resultPerPage);
  res.status(200).json({
    success: true,
    hireNurses,
    resultPerPage,
    appointmentCount
  });
};
// update 
exports.updateHireNurse = async (req, res, next) => {
  const bookingStatus = req.body;
  const hireNurse = await hireNurseModel.findByIdAndUpdate(req.params.id, bookingStatus, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (!hireNurse) {
    res.json({ message: "Booking appointment is not Found" });
  }
  if (hireNurse.bookingStatus=="Confirmed") {
    res.json({ message: "Booking already confirmed" });
  }
  await hireNurse.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    hireNurse
  });
};

// delete 
exports.deleteHireNurse = async (req, res, next) => {
  const booking = await hireNurseModel.findByIdAndDelete(req.params.id);
  if (!booking) {
    res.json({ message: "Appointment does not exit" });
  }
  res.status(200).json({
    success: true,
  });
};