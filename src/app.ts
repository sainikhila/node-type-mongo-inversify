import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import * as bodyParser from "body-parser";
import DbConnection from "./db/connection.db";
import { RegisterRoutes } from "../build/routes";

const app = express();

DbConnection.initConnection().then(() => {
    DbConnection.setAutoReconnect();

    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    app.use(bodyParser.json());

    app.use(async (req: ExRequest, res: ExResponse, next: NextFunction) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
        res.header("Access-Control-Expose-Headers", "Content-Length");
        res.header(
            "Access-Control-Allow-Headers",
            "Accept, Authorization, Content-Type, X-Requested-With, Range"
        );
        if (req.method === "OPTIONS") {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    RegisterRoutes(app);

    app.use((err: any, req: ExRequest, res: ExResponse) => {
        res.status(err.status || 500).json({
            message: err.message || "An unknown error occurred",
        });
    });

    app.get("/", async function (req, res) {
        res.send("Session Api up and running!");
    });

});

export default app;