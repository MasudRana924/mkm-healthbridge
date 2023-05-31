const appointmentModel = require('../models/Appointment');
const ApiFeatures = require('../utilies/apiFeatures');
const SendEmail = require('../utilies/sendEmail');
// Create new appointment
exports.newAppointment = async (req, res, next) => {
  const {
    doctorname,
    doctorfees,
    doctorimage,
    doctorId,
    phone,
    fees,
    totalFees,
    patientname,
    patientemail,
    patientgender,
    date,
    schedule,
    
  } = req.body;

  const appointment = await appointmentModel.create({
    doctorname,
    doctorfees,
    doctorimage,
    doctorId,
    phone,
    fees,
    totalFees,
    patientname,
    patientemail,
    patientgender,
    date,
    schedule,
    user: req.user._id,
  });
  if(appointment){
    await SendEmail({
      email: patientemail,
      subject: "You have booked an Appointment",
     message:`Hii ${patientname}, You have booked an Appointment of Dr. ${doctorname} \n\n Appointment Fees ${doctorfees} \n\n Appointment Date ${date} \n\n Appointment Schedule ${schedule}`
  });
  }
  res.status(201).json({
    success: true,
    appointment
  });

};

// get Single 
exports.getSingleAppointment = async (req, res, next) => {
  const appointment = await appointmentModel.findById(req.params.id)
  if (!appointment) {
    res.json({ message: "Not found a appointment with this id" })
  }
  res.status(200).json({
    success: true,
    appointment,
  });
};
// get logged in user  
exports.myAppointment = async (req, res, next) => {
  const appointment = await appointmentModel.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    appointment,

  });
};
// get all Appointments
exports.getAllAppointments = async (req, res, next) => {
  const resultPerPage=3;
  const appointmentCount=await appointmentModel.countDocuments();
  // const appointments = await appointmentModel.find();
  const apiFeature = new ApiFeatures(appointmentModel.find(),req.query);
  const appointments = await apiFeature.query;
  apiFeature.pagination(resultPerPage);
  res.status(200).json({
    success: true,
    appointments,
    resultPerPage,
    appointmentCount
  });
};
// update 
exports.updateBooking = async (req, res, next) => {
  const {bookingStatus,patientemail,patientname,doctorname} = req.body;
  const appointment = await appointmentModel.findByIdAndUpdate(req.params.id, bookingStatus);
  appointment.bookingStatus=req.body.bookingStatus;
  await appointment.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    appointment
  });
  await SendEmail({
    email: patientemail,
    subject: "Appointment Update",
    message: `Hii ${patientname}, Your Appointment of Dr. ${doctorname} is ${bookingStatus}`
  });
  
 
};

// delete 
exports.deleteAppointment = async (req, res, next) => {
  const booking = await appointmentModel.findByIdAndDelete(req.params.id);
  if (!booking) {
    res.json({ message: "Appointment does not exit" });
  }
  res.status(200).json({
    success: true,
  });
};