import http from "http";
import "reflect-metadata";
import express, { NextFunction, Request } from "express";
import dotenv from "dotenv";
import adminRoute from "./routes/adminRoutes";
import userRoute from "./routes/userRoutes";
import { getDbConnection } from "./dbConfig";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


interface CustomRequest extends Request {
  db?: any;
}


app.use(async (req: CustomRequest, res, next) => {
  try {
    req.db = await getDbConnection();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (_, res) => {
  res.send("Welcome to the Tikianaly API");
});

app.use("/api/v1/admin", adminRoute);  
app.use("/api/v1/", userRoute);


app.use((error: any, req: express.Request, res: express.Response, next: NextFunction) => {
  res.status(error.status || 500).json({
    error: {
      message: `Tikianaly API says: ${error.message}`,
    },
  });
});


const startServer = async () => {
  
  try {
    await getDbConnection();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server Running here 👉 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed due to database error:", error);
  }
};

startServer();

export default app;
