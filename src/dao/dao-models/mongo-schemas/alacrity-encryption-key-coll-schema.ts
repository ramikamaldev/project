import { Schema, model } from "mongoose";

/**
 * This file creates the schema for the project-encryption-key collection.
 */
const project_encryption_key_schema: Schema = new Schema(
    {
        "document_id": { type: String, required: true },
        "encryption_key": { type: String, required: true },
    }, { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } });

export const project_encryption_key_model = model('project-encryption-key', project_encryption_key_schema, 'project-encryption-key');