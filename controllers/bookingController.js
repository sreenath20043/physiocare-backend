 const Booking = require('../models/bookingModal')
const Stripe = require("stripe");

// Initialize Stripe with proper error handling
let stripe;
try {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.error("Stripe initialization failed:", error.message);
  stripe = {
    checkout: {
      sessions: {
        create: async () => {
          throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.");
        }
      }
    }
  };
}



//get all bookings

exports.doctorBooking = async (req, res) => {
  console.log("Inside doctor booking controller");
  console.log("Request body:", req.body);
  console.log("User ID from JWT:", req.userId);

  const {doctorId, username, email, number, session, date, time, description, status } = req.body;

  try {
    // Validate required fields
    if (!doctorId || !username || !email || !number || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert doctorId to ObjectId if it's a string
    const mongoose = require('mongoose');
    const doctorObjectId = mongoose.Types.ObjectId.isValid(doctorId) ? 
      new mongoose.Types.ObjectId(doctorId) : doctorId;

    const newBooking = new Booking({
      userId: req.userId,
      doctorId: doctorObjectId,
      username,
      email,
      number,
      session,
      date,
      time,
      description,
      status: "PAID",
    });

    console.log("New booking to save:", newBooking);
    await newBooking.save();
    console.log("Booking saved successfully");
    
    res.status(201).json({ message: "Booking success", newBooking });
  } catch (err) {
    console.error("Error in doctorBooking:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getAllBooking = async (req, res) => {

   const userId = req.userId
  try {
    const bookings = await Booking.find({userId}).populate("doctorId");
    console.log(`Found ${bookings.length} bookings for user ${userId}`);
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error getting user bookings:", err);
    res.status(500).json(err);
  }
};

// Get all bookings for admin
exports.getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("userId")
      .populate("doctorId");
    console.log(`Found ${bookings.length} total bookings for admin`);
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error getting all bookings for admin:", err);
    res.status(500).json({ message: "Error fetching all bookings", error: err.message });
  }
};

// GET DOCTOR BOOKINGS
exports.getDoctorBookings = async (req, res) => {
  try {
    console.log("Getting bookings for doctorId:", req.doctorId);
    const bookings = await Booking.find({ doctorId: req.doctorId })
      .populate("userId");

    console.log(`Found ${bookings.length} bookings for doctor ${req.doctorId}`);
    res.status(200).json(bookings);

  } catch (error) {
    console.error("Error getting doctor bookings:", error);
    res.status(500).json({
      message: "Failed to fetch doctor bookings",
      error: error.message
    });
  }
};


//cancel booking
exports.cancelBooking = async(req,res)=>{
    try{
        const { bookingId } = req.params
        const cancelledBooking = await Booking.findByIdAndDelete(bookingId)
        if(cancelledBooking){
            res.status(200).json({message:'Booking cancelled successfully', cancelledBooking})
        }else{
            res.status(404).json({message:'Booking not found'})
        }
    }
    catch(err){
        res.status(500).json({message:'Error cancelling booking',error : err.message});
    }
}

 //payment
exports.createCheckoutSession = async (req, res) => {
  const { doctorId, fees, bookingData } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Doctor Appointment" },
            unit_amount: fees * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/paymentsucces",
      cancel_url: "http://localhost:5173/paymenterror",
      metadata: {
        doctorId,
        bookingData: JSON.stringify(bookingData),
      },
    });

    res.json({ url: session.url }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 

