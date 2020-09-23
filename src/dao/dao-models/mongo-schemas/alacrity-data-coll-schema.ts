import { Schema, model } from "mongoose";

/**
 * This file creates the schema for the project-encrypted-data collection.
 */
const project_data_schema: Schema = new Schema(
    {
        "document_id": { type: String, required: true },
        "client_id": { type: String, required: false },
        "value": { type: Schema.Types.Mixed, required: true },
    }, { timestamps: { createdAt: 'created_at', updatedAt:"updated_at" } });

export const project_data_model = model('project-encrypted-data', project_data_schema, 'project-encrypted-data');