const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    console.error(err);

    return res.status(statusCode).json({
        success: false,
        status,
        message: err.message || "Internal server error"
    });
};

export default errorMiddleware;
