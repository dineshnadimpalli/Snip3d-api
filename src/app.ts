import express, { Application, Request, Response, NextFunction } from 'express';
import "dotenv/config";
import bodyParser from 'body-parser';
import cors from 'cors';
// import Routes from './Routes';
// import Connect from './connect';
import { Network, Alchemy } from "alchemy-sdk";
import mongoose from 'mongoose';
import category from './models/categories';
import domain from './models/domains';
import axios from 'axios';

const settings = {
    apiKey: "Sutir0tQfRQsB0GRQERYNKB383HrsQaX",
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const app: Application = express();

const url = 'mongodb://127.0.0.1:27017/ens';
const connect = mongoose.connect(url)
connect
    .then(db => {
        console.log("✅ Connected to db")
    })
    .catch(err => {
        console.error(err)
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors())

app.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories = await category.find({})
        res.status(200).json(categories)
    } catch (err) {
        res.status(400).json({
            error: 'Error occurred while fetching data'
        })
    }
})

app.get('/categories/:slug', async (req: Request, res: Response) => {
    const {
        slug
    } = req.params
    try {
        const domains = await domain.find({ slug: slug })
        res.status(200).json(domains)
    } catch (err) {
        res.status(400).json({
            error: 'Error occurred while fetching data'
        })
    }
})

app.get('/getnfts/:address', async (req: Request, res: Response) => {
    try {
        const {
            address
        } = req.params
        const fetchedNFTs: any = await alchemy.nft.getNftsForOwner(address);

        res.status(200).json({
            accountNfts: fetchedNFTs
        })
    } catch (err) {
        res.status(400).json({
            error: 'Error occurred while fetching nfts'
        })
    }
})


app.get('/', (req: Request, res: Response) => {
    res.send('TS App is Running')
})

const PORT = process.env.PORT;

// Connect({ db });
// Routes({ app })



app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
})