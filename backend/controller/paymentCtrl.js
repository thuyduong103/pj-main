const Razorpay = require("razorpay");

// Initialize Razorpay instance
const instance = new Razorpay({
  key_id: "rzp_test_sNEvA4ykI4Jnky",
  key_secret: "DgyOZLkj5BeunqSnvAbvpI8a",
});

const checkout = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate input
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount. Amount must be a positive number.",
      });
    }

    // Razorpay max amount in test mode (e.g., ₹1,00,00,000 = 1 crore paise)
    const MAX_AMOUNT = 10000000000; // Adjust based on your Razorpay account limit
    const amountInPaise = amount * 1;
    if (amountInPaise > MAX_AMOUNT) {
      return res.status(400).json({
        success: false,
        error: "Amount exceeds maximum allowed limit (₹1,00,00,000).",
      });
    }

    // Create Razorpay order
    const options = {
      amount: amountInPaise, // Amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`, // Unique receipt for tracking
    };

    const order = await instance.orders.create(options);

    // Return success response
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Checkout Error:", error);

    // Handle Razorpay-specific errors
    if (error.error?.code === "BAD_REQUEST_ERROR") {
      return res.status(400).json({
        success: false,
        error: error.error.description,
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: "Failed to create order. Please try again.",
    });
  }
};

const paymentVerification = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId } = req.body;

    // Validate input
    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        error: "Missing razorpayOrderId or razorpayPaymentId.",
      });
    }

    // In a production system, verify the payment signature here
    // Example: Use crypto module to verify Razorpay signature
    // For now, just return the received data
    res.status(200).json({
      success: true,
      razorpayOrderId,
      razorpayPaymentId,
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({
      success: false,
      error: "Payment verification failed. Please try again.",
    });
  }
};

module.exports = {
  checkout,
  paymentVerification,
};