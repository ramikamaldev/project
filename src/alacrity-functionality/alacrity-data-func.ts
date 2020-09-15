/**
* This file contains most of the alacrity functionality. 
*/

import { create_or_update_alacrity_entry, create_or_update_encryption_key, retrieve_encryption_key, retrieve_encrypted_documents } from "../dao"
import { AES } from 'crypto-js';

/**
 * decrypt_alacrity_data - this function takes in the encrypted_json_parameter object supplied by the calling function, and utilises the encryption_key to decrypt the encrypted_json.
 * @param encrypted_json_param 
 * @param encryption_key 
 */
export function decrypt_alacrity_data(encrypted_json_param: any, encryption_key: string) {
    let decrypted_json = {};
    decrypted_json = { value: encrypted_json_param.value, document_id: encrypted_json_param.document_id };
    for (const key in encrypted_json_param["value"]) {
        if (encrypted_json_param["value"].hasOwnProperty(key)) {
            const encrypted_element = encrypted_json_param["value"][key];
            let decrypted_element = AES.decrypt(encrypted_element as string, encryption_key).toString();
            decrypted_json["value"][key] = decrypted_element;
        }
    }
    return decrypted_json;
}

/**
 * encrypt_alacrity_data - this function utilises AES to encrypt the data, with the key passed by the user.
 * @param unencrypted_json 
 * @param encryption_key 
 */
export function encrypt_alacrity_data(unencrypted_json: Object, encryption_key: string) {
    let encrypted_json = {};
    Object.assign(encrypted_json, unencrypted_json);
    for (const key in unencrypted_json) {
        if (unencrypted_json.hasOwnProperty(key)) {
            const unencrypted_element = unencrypted_json[key];
            let encrypted_element = AES.encrypt(unencrypted_element.toString(), encryption_key).toString();
            encrypted_json[key] = encrypted_element;
        }
    }
    return encrypted_json;
}

/**
 * store_in_database - this function stores the alacrity_data and encryption_key in to their respective collections.
 */
export function store_in_database(id, encrypted_json, encryption_key) {
    return new Promise(async function (resolve, reject) {
        try {
            await create_or_update_alacrity_entry(id, encrypted_json);
            console.log("Stored alacrity_data in database.");
            await create_or_update_encryption_key(id, encryption_key);
            console.log("Stored encryption_key in database.");
            return resolve(true);
        }
        catch (err) {
            return reject(err);
        }
    })
}

/**
 * retrieve_from_database - this function retrieves the encryption_key and encrypted_documents from the database, passing them back to the calling function.
 * @param id 
 */
export function retrieve_from_database(id) {
    return new Promise(async function (resolve, reject) {
        try {
            let encryption_key = await retrieve_encryption_key(id);
            let encrypted_json = await retrieve_encrypted_documents(id);
            return resolve({ encryption_key, encrypted_json });
        }
        catch (err) {
            return reject(err);
        }
    });
}

/**
 * 
 * extract_data_with_matching_encryption_key_and_decrypt - this function matches the document with the document_id from the encrypted_jsons_data_array to the document_id in the stored_encryption_keys array
 * once determined which documents match each other, the passed in encryption_key is checked with the stored_encryption_keys, if it matches, the document is decrypted and pushed into the decrypted_jsons_array.
 * Once complete the array is passed back to the calling function.
 * @param encryption_key 
 * @param stored_encryption_keys 
 * @param encrypted_jsons_array 
 */
export function extract_data_with_matching_encryption_key_and_decrypt(encryption_key, stored_encryption_keys, encrypted_jsons_array) {
    let decrypted_jsons_array = [];
    for (let i = 0; i < encrypted_jsons_array.length; i++) {
        encryption_key_loop: for (let j = 0; j < stored_encryption_keys.length; j++) {
            if (encrypted_jsons_array[i]["document_id"] === stored_encryption_keys[j]["document_id"]) {
                if (encryption_key === stored_encryption_keys[j]["encryption_key"]) {
                    let decrypted_json = decrypt_alacrity_data(encrypted_jsons_array[i], encryption_key);
                    decrypted_jsons_array.push(decrypted_json);
                    break encryption_key_loop;
                }
                else {
                    console.log(`Encryption key supplied by the user does not match that stored in the database. document_id: ${encrypted_jsons_array[i]["document_id"]}`)
                }
            }
        }
    }
    return decrypted_jsons_array;
}