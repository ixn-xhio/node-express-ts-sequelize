import express, { Express } from "express";
import helmet from "helmet";
import config from "config";
import routes from "./routes";

const morgan = require ("morgan");
const cookieParser = require("cookie-parser");

const app: Express = express();

const env = process.env.NODE_ENV || "dev";
const port = config.get("PORT") || 3002;

console.log(env, port);

app.set("port", port);
app.use(express.json());
app.use(morgan(env));
app.use(cookieParser());

app.use(helmet());

/* 
*** App Router config
*/

routes(app);

export default app;
