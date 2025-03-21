import mongoose, { Document, Schema } from "mongoose";
import Helper from "../utils/helper.utils";

/**
 * Interface to validate schema field construction
 */
export interface IUserSchema extends Document {
    name: string;
    email: string;
}

/**
 * Schema defination to store the document
 */
export const UserSchema: Schema = new Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
}, {
    // Assigning timestamps to the schema
    timestamps: true
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(UserSchema);

/**
 * Export as default schema with assigning interface validation
 */
const schemaModal = mongoose.model<IUserSchema>("user", UserSchema);

export default schemaModal;