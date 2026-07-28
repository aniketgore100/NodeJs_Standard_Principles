import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import AppError from "../utils/appError.js"
dotenv.config();

export const register = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new AppError("Name, email and password are required", 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            id: user._id
        },
    });
}


const getAccessTokenSecret = () => {
    return process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
}

const getRefreshTokenSecret = () => {
    return process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
}


const getCookieValue = (req, cookieName) => {
    const cookieHeader = req.headers?.cookie;
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";").reduce((acc, pair) => {
        const [key, ...rest] = pair.trim().split("=");
        acc[key] = decodeURIComponent(rest.join("="));
        return acc;
    }, {});

    return cookies[cookieName] || null;
}


const generateAccessToken = (user) => {
    const accessToken = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        getAccessTokenSecret(),
        {
            expiresIn: "2m"
        }
    )
    return accessToken;
}


const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        {
            id: user._id,
            type: "refresh"
        },
        getRefreshTokenSecret(),
        {
            expiresIn: "20m"
        }
    )
    return refreshToken;
}



export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }


    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);


    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 1000
    })

    return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken: token,
        user: {
            id: user._id,
        },
    });
}


export const refreshAccessToken = async (req, res, next) => {
    const refreshToken = getCookieValue(req, "refreshToken");

    if (!refreshToken) {
        throw new AppError("Refresh token is missing", 401);
    }

    const decoded = jwt.verify(refreshToken, getRefreshTokenSecret());

    if (decoded.type !== "refresh") {
        throw new AppError("Invalid refresh token", 401);
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new AppError("User not found", 401);
    }

    if (!user.refreshToken || user.refreshToken !== refreshToken) {
        throw new AppError("Refresh token is not valid for this user", 401);
    }

    const accessToken = generateAccessToken(user);

    return res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken
    });
}


export const getUserInfo = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError("Please provide user Id", 400);
    }

    const user = await User.findById(id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return res.status(200).json({
        success: true,
        message: "User retrieved",
        user
    });
}
