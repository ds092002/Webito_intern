import { Router } from "express";
import {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getPlaylistById,
    getUserPlaylists,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT, upload.none()); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylist);

router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

export default router;