import express, { Application } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import cookieParser from "cookie-parser";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://garden-ally-client.vercel.app"],
    credentials: true,
  })
);

// application routes
app.use("/api/", router);

app.get("/", (req, res) => {
  res.send("Garden Ally server running!!");
});

// middleware to handle invalid routes (404 Not Found route)
app.use(notFound);

// Global Error Handler middlewares
app.use(globalErrorHandler);

export default app;
