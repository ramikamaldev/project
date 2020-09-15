import express from "express";
import { create_or_update_alacrity_entry, create_or_update_encryption_key, retrieve_encryption_key, retrieve_encrypted_document } from "../dao";
import { store_in_database, encrypt_alacrity_data, decrypt_alacrity_data, extract_data_with_matching_encryption_key } from "../alacrity-functionality/alacrity-data-func"

/**
 * 
 */
export function create_and_return_alacrity_router() {
    let router = express.Router();
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
function serve_home_page(req: express.Request, res: express.Response) {
    return res.status(200).send("Hi Happy.");
}

/**
 * 
 * @param req 
 * @param res 
 */
async function store_data(req: express.Request, res: express.Response) {
    let id = req.body.id;
    let unencrypted_json = req.body.value;
    let encryption_key = req.body.encryption_key;
    let encrypted_json = encrypt_alacrity_data(unencrypted_json, encryption_key);
    let store_in_database_result = store_in_database(id, encrypted_json, encryption_key);
    return res.status(200).send("Succesfully stored data in database");
}

/**
 * 
 * @param req 
 * @param res 
 */
async function retrieve_data(req: express.Request, res: express.Response) {
    let id = req.body.id;
    let encryption_key = req.body.decryption_key;
    id = id.replace("*", ".")
    let regex_query = new RegExp(`(${id})\\w`);
    let encrypted_jsons_array: any = await retrieve_encrypted_document(regex_query);
    let stored_encryption_keys = await retrieve_encryption_key(regex_query);
    let decrypted_json_array = extract_data_with_matching_encryption_key(encryption_key, stored_encryption_keys, encrypted_jsons_array);
    return res.status(200).send(decrypted_json_array);
}
