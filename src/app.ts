import express, { Application, Request, Response, NextFunction } from 'express';
import "dotenv/config";
import bodyParser from 'body-parser';
import cors from 'cors';
// import Routes from './Routes';
// import Connect from './connect';
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
    apiKey: "Sutir0tQfRQsB0GRQERYNKB383HrsQaX",
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


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
const db = 'mongodb://mongo:27017/test';

// Connect({ db });
// Routes({ app })



app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
})