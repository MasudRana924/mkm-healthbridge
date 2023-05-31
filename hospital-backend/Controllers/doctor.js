const doctorModel = require('../models/Doctors');
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utilies/apiFeatures');
const cloudinary = require("cloudinary");
const SendEmail = require('../utilies/sendEmail');
// only admin access this 
exports.createDoctor = asyncHandler(async (req, res) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "doctors",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const newDoctor = await doctorModel.create(req.body);
     SendEmail({
        email: req.body.email,
        subject: "MKM Health Bridge",
        message: `Hii Dr. ${req.body.name}, Your profile is created on MKM Health Bridge online `
    });
    res.status(201).json({ success: true, newDoctor });
});
// get all doctor for users
exports.getAllDoctors = asyncHandler(async (req, res) => {
    const resultPerPage=5;
    const doctorCount=await doctorModel.countDocuments();
    const apiFeature = new ApiFeatures(doctorModel.find(), req.query)
        .search()
        .filter()
        
    const doctors = await apiFeature.query;
    apiFeature.pagination(resultPerPage);
    res.status(200).json({
        success:true,
         doctors,
         doctorCount,
         resultPerPage

    });
});
// get all doctors for admin
exports.getDoctors = asyncHandler(async (req, res) => {
    const Doctors = await doctorModel.find();
    res.status(200).json({ success: true, Doctors });
});
// get single doctor
exports.doctorDetails = asyncHandler(async (req, res) => {
    const doctor = await doctorModel.findById(req.params.id);
    if (!doctor) {
        return res.status(500).json({
            message: "Doctor is not Found !!"
        });
    }
    res.status(200).json({
        success: true,
        doctor,
    
    });
});
// update doctor
exports.updateDoctor = asyncHandler(async (req, res, next) => {
    let doctor = await doctorModel.findById(req.params.id);
    if (!doctor) {
        return res.status(500).json({
            success: false,
            message: "Doctor is not found !!"
        });
    }
    let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < doctor.images.length; i++) {
      await cloudinary.v2.uploader.destroy(doctor.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "doctors",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
    doctor = await doctorModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    SendEmail({
        email: req.body.email,
        subject: "MKM Health Bridge",
        message: `Hii Dr. ${doctor.name}, Your profile is updated on MKM Health Bridge online `
    });
    res.status(200).json({
        success: true,
        doctor,
    });
});
//delete doctor
exports.deleteDoctor = asyncHandler(async (req, res, next) => {
    try {
        const deleteDoctor = await doctorModel.findOneAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Doctor Delete Successfully",
            deleteDoctor
        });
    } catch (error) {
        throw new Error(error);
    }

});
// Create New Review or Update the review
exports.createDoctorReview = async (req, res, next) => {
    const { rating, comment, doctorId } = req.body;
    const review = {
         user: req.user._id,
         name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const doctor = await doctorModel.findById(doctorId);
    const isReviewed = doctor.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
        doctor.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        doctor.reviews.push(review);
        doctor.numOfReviews = doctor.reviews.length;
    }

    let avg = 0;
    doctor.reviews.forEach((rev) => {
        avg += rev.rating;
    }); //average review
    doctor.ratings = avg / doctor.reviews.length;
    await doctor.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
};
// Get All Reviews of a product
exports.getDoctorReviews = async (req, res, next) => {
    const doctor = await doctorModel.findById(req.query.id);
    if (!doctor) {
        res.json({ message: "Doctor is not Found" })
    }
    res.status(200).json({
        success: true,
        reviews: doctor.reviews,
    });
};
// Delete Review
exports.deleteReview = async (req, res, next) => {
    const doctor = await doctorModel.findById(req.query.doctorId);
    if (!doctor) {
      return next(new ErrorHandler("Product not found", 404));
    }
    const reviews = doctor.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    ); //jeita delete korbo seita hobe
    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
    let ratings = 0;
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
    const numOfReviews = reviews.length;
    await doctorModel.findByIdAndUpdate(
      req.query.doctorId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
    });
  };