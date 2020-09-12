import { alacrity_encryption_key_model } from "../mongo-schemas/alacrity-encryption-key-coll-schema"
import { check_if_collection_exists_and_execute } from "../../../common-functions/utility-functions"

/**
 * 
 * @param encyrption_json 
 */
export function create_or_update_encryption_key(encryption_json) {
    let create_encryption_key_document = function (resolve, reject, encryption_json) {
        alacrity_encryption_key_model.create(encryption_json).then(
            function (response) {
                return resolve(response);
            }).catch(
                function (err) {
                    console.log("rejecting");
                    return reject(err);
                })
    };
    let update_encryption_key_document = function (resolve, reject, consignment_order) {
        alacrity_encryption_key_model.updateOne({ document_id: encryption_json["id"] }, { $set: { encryption_json } }, { upsert: true }).then(
            function (response) {
                return resolve(response);
            }).catch(
                function (err) {
                    return reject(err);
                })
    }
    return new Promise(function (resolve, reject) {
        check_if_collection_exists_and_execute(resolve, reject, alacrity_encryption_key_model, update_encryption_key_document, encryption_json, create_encryption_key_document);
    })
}

export function retrieve_encryption_key() {

}