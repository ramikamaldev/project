import { alacrity_data_model } from "../mongo-schemas/alacrity-data-coll-schema"
import { check_if_collection_exists_and_execute } from "../../../common-functions/utility-functions"

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
                console.log(response);
                return resolve(response);
            }).catch(
                function (err) {
                    console.log(err);
                    return reject(err);
                })
    }
    return new Promise(function (resolve, reject) {
        check_if_collection_exists_and_execute(resolve, reject, alacrity_data_model, update_document_if_collection_exists, encrypted_json, create_document_if_collection_does_not_exist);
    });
}


export function retrieve_encrypted_document(regex_query) {
    
    return new Promise(async function (resolve, reject) {
        try {
            let encrypted_document = await alacrity_data_model.find({
                document_id:
                {
                    $regex: regex_query
                }
            })
                .exec();
            console.log(encrypted_document);
            return resolve(encrypted_document);
        }
        catch (err) {
            console.log(err);
            return reject(err);
        }
    });
}
