import express from "express";
import { create_or_update_alacrity_entry, create_or_update_encryption_key, retrieve_encryption_key } from "../dao"

/**
 * 
 */
export function create_and_return_alacrity_router() {
    let router = express.Router();
    router.use("/happy", root_function);
    //Protect these endpoints. 
    router.use("/storing-endpoint", store_data);
    router.use("/retrieval-endpoint", retrieve_data);
    //Root
    router.use("/", serve_home_page);
    return router;
}

/**
 * 
 * @param req 
 * @param res 
 */
function root_function(req: express.Request, res: express.Response) {
    return res.status(200).send(`hi, happy :)\n${req.body}`);
}

/**
 * 
 * @param req 
 * @param res 
 */
async function store_data(req: express.Request, res: express.Response) {
}

/**
 * 
 * @param req 
 * @param res 
 */
function retrieve_data(req: express.Request, res: express.Response) {
}