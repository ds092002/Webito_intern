import express from "express";
import {
    createOrder,
    renderProductPage
} from "../controller/payment.controller.js" 

const paymentRouter = express.Router();

paymentRouter.get('/', renderProductPage);
paymentRouter.post('/createOrder', createOrder);

export default paymentRouter;