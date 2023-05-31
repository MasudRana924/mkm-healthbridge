const express = require("express");
const { createUser, getAllUsers, loginUser, logout, forgotPassword, getUserDetails, updatePassword, updateProfile,getSingleUser, updateUserRole, deleteUser, verifyEmail, resetPassword, updateAvatar } = require("../Controllers/user");
const { createDoctor, getAllDoctors, getDoctors, updateDoctor, deleteDoctor, doctorDetails, createDoctorReview,getDoctorReviews, deleteReview } = require("../Controllers/doctor");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { newAppointment, getSingleAppointment, myAppointment, getAllAppointments, updateBooking, deleteAppointment } = require("../Controllers/appointment");
const { createNurse, getAllNurses, getNurses, nurseDetails, createNursesReview, getNurseReviews, updateNurse } = require("../Controllers/nurse");
const { newHireNurse, getSingleHireNurse, myHireNurse, getAllHireNurse, updateHireNurse, deleteHireNurse } = require("../Controllers/hireNurse");
const router = express.Router();

// users routes
router.route("/register").post(createUser);
router.route("/activation").post(verifyEmail);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/currentUserDetails").get(isAuthenticatedUser, getUserDetails);
router.route("/updatePassword").put(isAuthenticatedUser, updatePassword);
router.route("/update/currentUserdetails").put(isAuthenticatedUser, updateProfile);
router.route("/update/avatar").put(isAuthenticatedUser, updateAvatar);
router.route("/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
.get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
.put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
.delete( deleteUser);


// doctors routes
router.route("/doctor").post(isAuthenticatedUser, authorizeRoles("admin"), createDoctor);
router.route("/doctors").get(getAllDoctors);
router.route("/admin/doctors").get(isAuthenticatedUser, authorizeRoles("admin"), getDoctors);
router.route("/doctor/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updateDoctor);
router.route("/doctor/:id").deleteisAuthenticatedUser, authorizeRoles("admin"),(deleteDoctor);
router.route("/doctor/:id").get(doctorDetails);
router.route("/create/review").put( isAuthenticatedUser,createDoctorReview);
router.route("/doctors/reviews").get(isAuthenticatedUser, getDoctorReviews);
router.route("/doctors/reviews").delete(isAuthenticatedUser, deleteReview);

// appointment routes 
router.route("/new/appointment").post(isAuthenticatedUser, newAppointment);
router.route("/appointment/:id").get(isAuthenticatedUser, getSingleAppointment);
router.route("/mybooking").get(isAuthenticatedUser, myAppointment);
router.route("/getall/appointment").get(isAuthenticatedUser, authorizeRoles("admin"), getAllAppointments);
router.route("/admin/appointment/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateBooking)
router.route("/admin/appointment/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteAppointment);

// nurses routes
router.route("/create/nurse").post(isAuthenticatedUser, authorizeRoles("admin"), createNurse);
router.route("/get/nurses").get(getAllNurses);
router.route("/admin/nurses").get(isAuthenticatedUser, authorizeRoles("admin"), getNurses);
router.route("/nurse/:id").get(nurseDetails);
router.route("/create/nurse/review").put( isAuthenticatedUser,createNursesReview);
router.route("/nurses/reviews").get(isAuthenticatedUser, getNurseReviews);

// hire nurse
router.route("/new/hire/nurse").post(isAuthenticatedUser, newHireNurse);
router.route("/hire/nurse/:id").get(isAuthenticatedUser, getSingleHireNurse);
router.route("/my/hire").get(isAuthenticatedUser, myHireNurse);
router.route("/getall/hire/nurse").get(isAuthenticatedUser, authorizeRoles("admin"), getAllHireNurse);
router.route("/admin/hire/nurse/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateHireNurse)
router.route("/admin/hire/nurse/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteHireNurse);
router.route("/nurse/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updateNurse);





module.exports = router;