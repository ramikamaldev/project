import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import * as path from "path";

import { connect_to_project_mongodb } from "./common-functions/mongo-connect";
import { create_and_return_project_router } from "./routes/project-routes";
import {create_and_return_promise} from "./common-functions/utility-functions"
/**
 * The project_App class is the main class of the application. It handles instantiating the application infrastructure.
 */
class project_App {
    public server: express.Application;
    constructor() {
        this.server = express();
        dotenv.config({
            path: path.resolve(__dirname, "../config/config.env"),
        });
        this.instantiate_application_infrastructure();
    }

    /**
     * instantiate_application_infrastructure - This method instantiates the middleware, as well as launches the express server.
     */
    public async instantiate_application_infrastructure() {
        let result = connect_to_project_mongodb()
            .then(async function (result) {
                await project_app.instantiate_middleware();
                project_app.start_express();
            })
            .catch(function (error) {
                console.log(error);
            });
        return;
    }

    /**
     * instantiate_middleware - This method instantiates the middleware for the express server, 
     * by loading helmet (adding security headers),
     * bodyParser - to handle incoming request bodies,
     * instaniating the express-router, which contains the express routers,
     * and a test endpoint.
     * It wraps the function in a promise to allow for async/await functionality in the calling method.
     */
    public async instantiate_middleware() {
        let promise_function = function (resolve, reject) {
            this.server.use(helmet());
            this.server.use(bodyParser.json());
            let project_router = create_and_return_project_router();
            this.server.use(project_router);
            this.server.get("/test-server-routes", function (req, res) {
                res.send("Server is running correctly.");
            });
            return resolve(0);
        }.bind(this);
        this.create_promise(promise_function);
    }

    /**
     * start_express - This method instantiates the express server at the given DOTENV port - 5050.
     */
    public async start_express() {
        this.server.listen(process.env.PORT);
        console.log(
            `project Server Started! Listening on port: ${process.env.PORT}`
        );
    }

    /**
     * create_promise - This method returns a promise for the given promise_function, easing the binding of the this object.
     * @param promise_function 
     */
    public async create_promise(promise_function) {
        return new Promise(promise_function);
    }
}

let project_app: project_App;
/**
 * create_singleton_application - This function is of a singelton design pattern, allowing the application to be instantiated.
 */
function create_singleton_application() {
    if (!project_app) {
        console.log("Instantiating Singleton project Application");
        project_app = new project_App();
        return 0;
    } else {
        return 1;
    }
}

create_singleton_application();