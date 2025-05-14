const Razorpay = require("razorpay");

console.log("Initializing Razorpay with Key:", process.env.RAZORPAY_KEY);
console.log("Secret:", process.env.RAZORPAY_SECRET);

exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});