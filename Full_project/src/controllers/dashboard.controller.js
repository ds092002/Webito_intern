import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id;

    const totalSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalSubscribers: { 
                    $sum: 1 
                }
            }
        }
    ]);

    const video = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: 'likes',
                localFields: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $project : {
                totalLikes: {
                    $soze: "$likes",
                },
                totalViews : "$views",
                totalVideos : 1
            }
        },
        {
            $group :{
                _id: null,
                totalVideos: {
                    $sum: 1
                },
                totalLikes: {
                    $sum: "$totalLikes"
                },
                totalViews: {
                    $sum: "$totalViews"
                }
            }
        }
    ]);

    const channelStats = {
        totalSubscribers: totalSubscribers[0]?.totalSubscribers || 0,
        totalVideos: video[0]?.totalVideos || 0,
        totalLikes: video[0]?.totalLikes || 0,
        totalViews: video[0]?.totalViews || 0
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channelStats,
                "channel stats fetched successfully"
            )
        );
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user?._id;

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            }
        },
        {
            $lookup: {
                from: 'likes',
                localFields: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                createAt: {
                    $dateToParts: {
                        date: "$createdAt"
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1  
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                "videoFile.url" : 1,
                "thumbnail.url" : 1,
                likesCount: 1,
                createdAt: {
                    $dateFromParts: {
                        year: "$createAt.year",
                        month: "$createAt.month",
                        day: "$createAt.day"
                    }
                },
                isPublished: 1
            }
        }
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "channel stats fetched successfully"
        )
    );
})

export {
    getChannelStats, 
    getChannelVideos
    }