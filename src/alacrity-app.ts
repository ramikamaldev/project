import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import * as path from "path";

import { connect_to_alacrity_mongodb } from "./common-functions/mongo-connect";
import { create_and_return_alacrity_router } from "./routes/alacrity-routes";

class Alacrity_App {
    public server: express.Application;
    constructor() {
        this.server = express();
        dotenv.config({
            path: path.resolve(__dirname, "../config/config.env"),
        });
        this.instantiate_application_infrastructure();
    }

    public async instantiate_application_infrastructure() {
        let result = connect_to_alacrity_mongodb()
            .then(async function (result) {
                // console.log(configurApp)
                await alacrity_app.instantiate_middleware();
                alacrity_app.start_express();
            })
            .catch(function (error) {
                //TODO: If the promise was rejected, throw the error and terminate.
                console.log(error);
            });
        return;
    }

    public async instantiate_middleware() {
        let promise_function = function (resolve, reject) {
            this.server.use(helmet());
            this.server.use(bodyParser.json());
            let alacrity_router = create_and_return_alacrity_router();
            this.server.use(alacrity_router);
            this.server.get("/test-server-routes", function (req, res) {
                res.send("Server is running correctly.");
            });
            return resolve(0);
        }.bind(this);
        this.create_promise(promise_function);
    }

    public async start_express() {
        this.server.listen(process.env.PORT);
        console.log(
            `Alacrity Server Started! Listening on port: ${process.env.PORT}`
        );
    }

    public async create_promise(promise_function) {
        return new Promise(promise_function);
    }
}

let alacrity_app: Alacrity_App;
function create_singleton_application() {
    if (!alacrity_app) {
        console.log("Instantiating Singleton Alacrity Application");
        alacrity_app = new Alacrity_App();
        return 0;
    } else {
        return 1;
    }
}

create_singleton_application();