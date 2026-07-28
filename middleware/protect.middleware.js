import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../utils/appError.js";

dotenv.config();

const getAccessTokenSecret = () => {
    return process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
}

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError("Not authorized, token missing", 401));
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, getAccessTokenSecret());

        req.user = decoded;
        return next();
    } catch (error) {
        return next(new AppError("Not authorized, token invalid or expired", 401));
    }
}

export default protect;
