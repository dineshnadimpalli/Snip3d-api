import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Domain = new Schema({
    category: {
        type: String,
        required: true,
        index: true
    },
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
    token: {
        type: String,
        required: true,
        index: true
    }
});

const domain = mongoose.model("Domain", Domain);

export default domain