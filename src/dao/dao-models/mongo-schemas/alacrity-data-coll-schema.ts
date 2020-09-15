import { Schema, model } from "mongoose";

/**
 * This file creates the schema for the alacrity-encrypted-data collection.
 */
const alacrity_data_schema: Schema = new Schema(
    {
        "document_id": { type: String, required: true },
        "client_id": { type: String, required: false },
        "value": { type: Schema.Types.Mixed, required: true },
    }, { timestamps: { createdAt: 'created_at', updatedAt:"updated_at" } });

export const alacrity_data_model = model('alacrity-encrypted-data', alacrity_data_schema, 'alacrity-encrypted-data');