import express from 'express';

export const ThrowError = (res, statusCode, msg) => {
    return res.status(statusCode ?? 500).json({ msg: msg ?? `Internal Server Error`, data: null });
};