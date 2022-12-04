import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export type CategoryType = {
    name: string,
    slug: string,
    description: string,
    twitter: string,
    chat: string,
    website: string,
    logo: string
}

const Category = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    slug: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String
    },
    twitter: {
        type: String
    },
    chat: {
        type: String
    },
    website: {
        type: String
    },
    logo: {
        type: String
    },
});

const category = mongoose.model("Category", Category);


export default category