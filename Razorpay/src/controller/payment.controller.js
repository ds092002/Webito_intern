import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const {
    RAZORPAY_ID_KEY, 
    RAZORPAY_SECRET_KEY
} = process.env;

// Initialize Razorpay instance with your keys
const instance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

// Function to render the product page with Razorpay key
export const renderProductPage = (req, res) => {
    res.render(
        'product', 
        {
            key_id : RAZORPAY_ID_KEY
        }
    )
};

// Create a order 

export const createOrder = async(req, res) => {
    try {
        const {
            amount,
            currency = 'INR',
            receipt
        } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: `Please enter amount , amount is required`});
        }

        const options = {
            amount: amount * 100,
            currency,
            receipt : receipt || `receipt_${Date.now()}`
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order_id: order.id,
            amount: options.amount,
            currency: options.currency,
          });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}