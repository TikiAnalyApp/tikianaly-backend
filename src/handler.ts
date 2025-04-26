import serverless from "serverless-http";
import app from "./index"; 

export const main = serverless(app);
