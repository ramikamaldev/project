import { alacrity_data_model } from "../mongo-schemas/alacrity-data-coll-schema"
import { check_if_collection_exists_and_execute } from "../../../common-functions/utility-functions"

export function create_or_update_alacrity_entry(alacrity_json) {
    let create_document = function (resolve, reject, alacrity_data_json) {
        alacrity_data_model.create(alacrity_json).then(
            function (response) {
                return resolve(response);
            }).catch(
                function (err) {
                    console.log("rejecting");
                   return reject(err);
                })
    };
    let update_document = function (resolve, reject, alacrity_data_json) {
        alacrity_data_model.updateOne({ document_id: alacrity_data_json["id"] }, { $set: { alacrity_data_json } }, { upsert: true }).then(
            function (response) {
                return resolve(response);
            }).catch(
                function (err) {
                   return reject(err);
                })
    }
    return new Promise(function (resolve, reject) {
        check_if_collection_exists_and_execute(resolve, reject, alacrity_data_model, update_document, alacrity_json, create_document);
    })
}
