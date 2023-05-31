const asyncHandler = require('express-async-handler');
const nurseModel = require('../models/Nurses');
const sendToken = require('../utilies/jwtToken');
const ApiFeatures = require('../utilies/apiFeatures');
const cloudinary = require("cloudinary");
const SendEmail = require('../utilies/sendEmail');

// only admin access this 
exports.createNurse = asyncHandler(async (req, res) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "nurses",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const newNurse = await nurseModel.create(req.body);
   
    res.status(201).json({
        success: true,
        newNurse,
      });
      SendEmail({
        email: req.body.email,
        subject: "MKM Health Bridge",
        message: `Hii  ${req.body.name}, Your profile is created on MKM Health Bridge online as an Nurse`
    });
});
exports.getAllNurses = asyncHandler(async (req, res) => {
    const resultPerPage=5;
    const nurseCount=await nurseModel.countDocuments();
    const apiFeature = new ApiFeatures(nurseModel.find(), req.query)
        .search()
        .filter()
        
    const nurses = await apiFeature.query;
    apiFeature.pagination(resultPerPage);
    res.status(200).json({
        success:true,
        nurses,
        nurseCount,
         resultPerPage

    });
});
exports.getNurses = asyncHandler(async (req, res) => {
    const Nurses = await nurseModel.find();
    res.status(200).json({ success: true, Nurses });
});
exports.nurseDetails = asyncHandler(async (req, res) => {
    const nurse = await nurseModel.findById(req.params.id);
    if (!nurse) {
        return res.status(500).json({
            message: "Nurse is not Found !!"
        });
    }
    res.status(200).json({
        success: true,
        nurse,
    
    });
});
exports.createNursesReview = async (req, res, next) => {
    const { rating, comment, nurseId } = req.body;
    const review = {
         user: req.user._id,
         name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const nurse = await nurseModel.findById(nurseId);
    const isReviewed = nurse.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
        nurse.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        nurse.reviews.push(review);
        nurse.numOfReviews = nurse.reviews.length;
    }

    let avg = 0;
    nurse.reviews.forEach((rev) => {
        avg += rev.rating;
    }); //average review
    nurse.ratings = avg / nurse.reviews.length;
    await nurse.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
};
// Get All Reviews of a product
exports.getNurseReviews = async (req, res, next) => {
    const nurse = await nurseModel.findById(req.query.id);
    if (!nurse) {
        res.json({ message: "nurse is not Found" })
    }
    res.status(200).json({
        success: true,
        reviews: nurse.reviews,
    });
};
exports.updateNurse=async(req,res)=>{
    let nurse = await nurseModel.findById(req.params.id);
    if (!nurse) {
        return res.status(500).json({
            success: false,
            message: "Nurse is not found !!"
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
    for (let i = 0; i < nurse.images.length; i++) {
      await cloudinary.v2.uploader.destroy(nurse.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "nurses",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
    nurse = await nurseModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    SendEmail({
        email: req.body.email,
        subject: "MKM Health Bridge",
        message: `Hello ${nurse.name}, Your profile is updated on MKM Health Bridge online `
    });
    res.status(200).json({
        success: true,
        nurse,
    });
}