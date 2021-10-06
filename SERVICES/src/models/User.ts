import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from "bcryptjs";


const UserSchema: Schema = new Schema({
        _id: Schema.Types.ObjectId,
        email: String,
        password: String,
        role: {
            type: Number,
            enum: [0, 1, 2],
            default: 0
        },
    },
);

export enum Role {
    Home, Company, Admin
}


export interface IUser {
    _id?: string;
    email: string;
    role: number;

}

export interface IUserAccount extends IUser {
    password: string;
}

export interface IUserAccountDocument extends IUserAccount, Document {
    _id: string;
}

export interface IUserDocument extends IUser, Document {
    _id: string;
}


export default mongoose.model<IUserAccountDocument>('users', UserSchema, 'users');
export const UserView = mongoose.model<IUserDocument>('userview', UserSchema, 'users');

