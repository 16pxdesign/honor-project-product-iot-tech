export interface IUser {
    _id: string;
    email: string;
    role: number;
}

export interface IReader {
    _id: string;
    reader_id: string;
    date: Date;
    active: boolean;
}

export interface IProduct {
    _id?: string,
    product_id: String,
    product_name: String,
    product_id_type?: String,
    price?: String,
}


export interface ITransaction {
    _id: string
    user_id: String,
    transaction_id: String,
    products: [IProduct?],
    date: Date,
    approved: boolean,
    reason?: [String]
}

