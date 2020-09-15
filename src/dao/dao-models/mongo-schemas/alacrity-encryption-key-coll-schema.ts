import { Schema, model } from "mongoose";

/**
 * This file creates the schema for the alacrity-encryption-key collection.
 */
const alacrity_encryption_key_schema: Schema = new Schema(
    {
        "document_id": { type: String, required: true },
        "encryption_key": { type: String, required: true },
    }, { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } });

export const alacrity_encryption_key_model = model('alacrity-encryption-key', alacrity_encryption_key_schema, 'alacrity-encryption-key');