import { Schema, model } from "mongoose";

const alacrity_data_schema: Schema = new Schema(
    {
        "document_id": { type: String, required: true },
        "client_id": {type:String, required:true},
        "value": { type: Schema.Types.Mixed, required: true },
        "timestamp": { type: Date, default: Date.now }
    });

export const alacrity_data_model = model('alacrity-data', alacrity_data_schema, 'alacrity-data');