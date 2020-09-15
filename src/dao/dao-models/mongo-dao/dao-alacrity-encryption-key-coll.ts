import { alacrity_encryption_key_model } from "../mongo-schemas/alacrity-encryption-key-coll-schema"
import { check_if_collection_exists_and_execute } from "../../../common-functions/utility-functions"

/**
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

export function retrieve_encryption_key(id) {
    return new Promise(async function (resolve, reject) {
        try {
            let encryption_key = await alacrity_encryption_key_model.find({ document_id: id }).exec();
            console.log(encryption_key)
            return resolve(encryption_key);
        }
        catch (err) {
            console.log(err)
            return reject(err);
        }
    });
}