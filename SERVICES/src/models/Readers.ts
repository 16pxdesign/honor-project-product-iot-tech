import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";

const ReaderSchema: Schema = new Schema({
        date: Date,
        type: String,
        reader_id: String,
        active: {type: Boolean, default: true}
    },
);


export interface IReader {
    _id?: string;
    reader_id: string;
    date: Date;
    type: number;
    active: boolean;

}


export interface IReaderDocument extends Document {
    _id: string;
}

export default mongoose.model<IReaderDocument>('readers', ReaderSchema, 'readers');
