import { Schema, model } from "mongoose";

const alacrity_encryption_key_schema: Schema = new Schema(
    {
        "document_id": { type: String, required: true },
        "encryption_key": { type: String, required: true },
        "timestamp": { type: Date, default: Date.now }
    });

export const alacrity_encryption_key_model = model('alacrity-encryption-key', alacrity_encryption_key_schema, 'alacrity-encryption-key');