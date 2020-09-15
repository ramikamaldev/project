import { alacrity_encryption_key_model } from "../mongo-schemas/alacrity-encryption-key-coll-schema"
import { check_if_collection_exists_and_execute } from "../../../common-functions/utility-functions"

/**
 * create_or_update_encryption_key - This function utilises the create and findOneAndUpdate functionality of MongoDB.
 * It was implemented utilising both to handle the corner case of the collection not existing in the database, in this case the create functionality will create the collection, and insert in the document.
 * However, in all other circumstances the findOneAndUpdate functionality with upsert (insert if not exists), will suffice.
 * It passes the two functions to the check_if_collection_exists_and_execute - which determines whether the collection exists.
 * 
 * @param encryption_json 
 */
export async function create_or_update_encryption_key(id, encryption_key) {
    let create_encryption_key_document = function (resolve, reject, encryption_key) {
        alacrity_encryption_key_model.create({ document_id: id, encryption_key }).then(
            function (response) {
                return resolve(response);
            }).catch(
                function (err) {
                    return reject(err);
                })
    };
    let update_encryption_key_document = function (resolve, reject, encryption_key) {
        alacrity_encryption_key_model.findOneAndUpdate({ document_id: id }, { $set: { encryption_key } }, { upsert: true }).then(
            function (response) {
                return resolve(response);
            }).catch(
                function (err) {
                    return reject(err);
                })
    }
    return new Promise(function (resolve, reject) {
        check_if_collection_exists_and_execute(resolve, reject, alacrity_encryption_key_model, update_encryption_key_document, encryption_key, create_encryption_key_document);
    });
}

/**
 * retrieve_encryption_key - this function retrieves the document containing the encryption_key from the database, dependent on the id passed by the calling function.
 * @param id 
 */
export function retrieve_encryption_key(id) {
    return new Promise(async function (resolve, reject) {
        try {
            let encryption_key = await alacrity_encryption_key_model.find({ document_id: id }).exec();
            console.log("Retrieved encryption_key from database");
            return resolve(encryption_key);
        }
        catch (err) {
            console.log(err)
            return reject(err);
        }
    });
}