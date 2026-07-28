import express from "express";
import connectDb from "./config/db.js"
import router from "./routes/V1/index.routes.js";
import notFound from "./middleware/notFound.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cors from "cors"
import morgan from "morgan"
const app = express()

connectDb()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.get("/me", (req, res) => {
    res.status(200).json({
        message : "ok"
    })
})
app.use("/api", router)
app.use(notFound)
app.use(errorMiddleware)

app.listen(8000, (req, res) => {
    console.log("Server running on port 8000")
})
