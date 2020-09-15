import * as fs from "fs";
import { create_and_return_promise } from "../common-functions/utility-functions"
import { create_or_update_alacrity_entry, create_or_update_encryption_key, retrieve_encryption_key, retrieve_encrypted_document } from "../dao"
import { AES } from 'crypto-js';

export function decrypt_alacrity_data(encrypted_json_param: any, encryption_key: string) {
    let decrypted_json_array = [];
    let decrypted_json = {};
    decrypted_json = { value: encrypted_json_param.value, document_id: encrypted_json_param.document_id };
    for (const key in encrypted_json_param["value"]) {
        if (encrypted_json_param["value"].hasOwnProperty(key)) {
            const encrypted_element = encrypted_json_param["value"][key];
            let decrypted_element = AES.decrypt(encrypted_element as string, encryption_key).toString();
            decrypted_json["value"][key] = decrypted_element;
        }
    }
    decrypted_json_array.push(decrypted_json);
    console.log(decrypted_json_array);
    return decrypted_json_array;
}

export function encrypt_alacrity_data(unencrypted_json: Object, encryption_key: string) {
    let encrypted_json = {};
    Object.assign(encrypted_json, unencrypted_json);
    for (const key in unencrypted_json) {
        console.log(key);
        if (unencrypted_json.hasOwnProperty(key)) {
            const unencrypted_element = unencrypted_json[key];
            let encrypted_element = AES.encrypt(unencrypted_element.toString(), encryption_key).toString();
            encrypted_json[key] = encrypted_element;
        }
    }
    return encrypted_json;
}

export async function store_in_database(id, encrypted_json, encryption_key) {
    try {
        await create_or_update_alacrity_entry(id, encrypted_json);
        await create_or_update_encryption_key(id, encryption_key);
        return true;
    }
    catch (err) {
        return err;
    }
}

export function retrieve_from_database(id) {
    return new Promise(async function (resolve, reject) {
        try {
            let encryption_key = await retrieve_encryption_key(id);
            let encrypted_json = await retrieve_encrypted_document(id);
            resolve({ encryption_key, encrypted_json });
        }
        catch (err) {
            reject(err);
        }
    });
}


export function extract_data_with_matching_encryption_key_and_decrypt(encryption_key, stored_encryption_keys, encrypted_jsons_array) {
    let decrypted_jsons_array = [];
    for (let i = 0; i < encrypted_jsons_array.length; i++) {
        encryption_key_loop: for (let j = 0; j < stored_encryption_keys.length; j++) {
            if (encrypted_jsons_array[i]["document_id"] === stored_encryption_keys[j]["document_id"]) {
                if (stored_encryption_keys[j]["encryption_key"] === encryption_key) {
                    let decrypted_json = decrypt_alacrity_data(encrypted_jsons_array[i], encryption_key);
                    decrypted_jsons_array.push(decrypted_json);
                    break encryption_key_loop;
                }
            }
        }
    }
    return decrypted_jsons_array;
}