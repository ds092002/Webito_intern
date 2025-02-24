import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    updateTweet,
    getUserTweets,
} from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.use(verifyJWT, upload.none()); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;
