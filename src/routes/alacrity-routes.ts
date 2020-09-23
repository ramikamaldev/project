import express from "express";
import { create_or_update_project_entry, create_or_update_encryption_key, retrieve_encryption_key, retrieve_encrypted_documents } from "../dao";
import { store_in_database, encrypt_project_data, decrypt_project_data, extract_data_with_matching_encryption_key_and_decrypt } from "../project-functionality/project-data-func"

/**
 * create_and_return_project_router - This function creates and returns an express router with the given endpoints and their associated functionality.
 */
export function create_and_return_project_router() {
    let router = express.Router();
    router.use("/storing-endpoint", store_data);
    router.use("/retrieval-endpoint", retrieve_data);
    //Root
    router.use("/", serve_home_page);
    return router;
}

/**
 * serve_home_page - This function serves a simple homepage at the root endpoint. 
 * @param req 
 * @param res 
 */
function serve_home_page(req: express.Request, res: express.Response) {
    return res.status(200).send("Hi Happy.");
}

/**
 *  store_data - this function serves the /storing-endpoint.
 *  It takes the req.body passed by the user, encrypts the data, then stores the data in the database.
 * @param req 
 * @param res 
 */
async function store_data(req: express.Request, res: express.Response) {
    try {
        let id = req.body.id;
        let unencrypted_json = req.body.value;
        let encryption_key = req.body.encryption_key;
        let encrypted_json = encrypt_project_data(unencrypted_json, encryption_key);
        await store_in_database(id, encrypted_json, encryption_key);
        console.log("Ending /storing-endpoint call");
        return res.status(200).send("Succesfully stored data in database.");
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error, please contact administrator.")
    }

}

/**
 *  retrieve_data - This function serves the /retrieval-endpoint.
 *  It takes the req.body passed by the user, builds a regex (to enable use of wildcards) to query the database using the ID passed by the user, to retrieve both the encryption_keys and data documents.
 *  It then extracts and decrypts the data with the matching encryption key, returning those with the matching encryption key to the user.
 * @param req 
 * @param res 
 */
async function retrieve_data(req: express.Request, res: express.Response) {
    try {
        let id = req.body.id;
        let encryption_key = req.body.decryption_key;
        id = id.replace("*", ".")
        let regex_query = new RegExp(`(${id})\\w`);
        let encrypted_jsons_array: any = await retrieve_encrypted_documents(regex_query);
        let stored_encryption_keys = await retrieve_encryption_key(regex_query);
        let decrypted_json_array = extract_data_with_matching_encryption_key_and_decrypt(encryption_key, stored_encryption_keys, encrypted_jsons_array);
        console.log("Ending /retrieval-endpoint call");
        return res.status(200).send(decrypted_json_array);
    }
    catch (err) {
        return res.status(500).send("Internal server error, please contact administrator");
    }

}
