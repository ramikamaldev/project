import { alacrity_data_model } from "../mongo-schemas/alacrity-data-coll-schema"
import { check_if_collection_exists_and_execute } from "../../../common-functions/utility-functions"


/**
 * create_or_update_alacrity_entry - This function utilises the create and findOneAndUpdate functionality of MongoDB.
 * It was implemented utilising both to handle the corner case of the collection not existing in the database, in this case the create functionality will create the collection, and insert in the document.
 * However, in all other circumstances the findOneAndUpdate functionality with upsert (insert if not exists), will suffice.
 * It passes the two functions to the check_if_collection_exists_and_execute - which determines whether the collection exists.
 * 
 * @param encryption_json 
 */
export function create_or_update_alacrity_entry(id, encrypted_json) {
    let create_document_if_collection_does_not_exist = function (resolve, reject, encrypted_json) {
        alacrity_data_model.create({ document_id: id, value: encrypted_json }).then(
            function (response) {
                return resolve(response);
            }).catch(
                function (err) {
                    return reject(err);
                })
    };
    let update_document_if_collection_exists = function (resolve, reject, encrypted_json) {
        alacrity_data_model.findOneAndUpdate({ document_id: id }, { $set: { value: encrypted_json } }, { upsert: true }).then(
            function (response) {
                return resolve(response);
            }).catch(
                function (err) {
                    return reject(err);
                })
    }
    return new Promise(function (resolve, reject) {
        check_if_collection_exists_and_execute(resolve, reject, alacrity_data_model, update_document_if_collection_exists, encrypted_json, create_document_if_collection_does_not_exist);
    });
}

/**
 * retrieve_encrypted_document- This function retrieves the encrypted document the user requested, utilsing the regex_query passed through by the user.
 * @param regex_query 
 */
export function retrieve_encrypted_documents(regex_query) {
    return new Promise(async function (resolve, reject) {
        try {
            let encrypted_documents = await alacrity_data_model.find({
                document_id:
                {
                    $regex: regex_query
                }
            })
                .exec();
            console.log("Retrieved encrypted_documents from database");
            return resolve(encrypted_documents);
        }
        catch (err) {
            console.log(err);
            return reject(err);
        }
    });
}
