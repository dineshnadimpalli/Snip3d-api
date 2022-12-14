const Web3 = require("web3");
const ENS = require("web3-eth-ens");
const dotenv = require("dotenv");

dotenv.config();

// Replace with the address of the ENS registry contract
const ensRegistryAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";

// Replace with the name of the ENS domain to fetch the floor price for
const domain = "0xswarnava.eth";

async function getFloorPrice(web3, ens, domain) {
  // Look up the resolver contract address for the ENS domain
  const resolverAddress = await ens.resolver(domain);
  console.log("=====resolverAddress====", resolverAddress);
  // Check if the domain has a resolver contract
  if (resolverAddress === null) {
    throw new Error("The domain does not have a resolver contract");
  }

  // Create an instance of the resolver contract
  const resolver = new web3.eth.Contract(resolver.ABI, resolverAddress);

  // Call the auctionStarted() function of the resolver contract to check if an auction is in progress
  const auctionStarted = await resolver.methods.auctionStarted(domain).call();

  // Check if an auction is in progress
  if (auctionStarted) {
    // If an auction is in progress, the floor price is the current highest bid
    return await resolver.methods.highestBid(domain).call();
  } else {
    // If no auction is in progress, the floor price is the minimum value of the bids in the last closed auction
    // Call the previousAuction() function of the resolver contract to get the last closed auction
    const previousAuction = await resolver.methods
      .previousAuction(domain)
      .call();

    // Check if there was a previous auction
    if (
      previousAuction.winner === "0x0000000000000000000000000000000000000000"
    ) {
      // If there was no winner, the floor price is the minimum value of the bids
      return previousAuction.bid;
    } else {
      // If there was a winner, there is no floor price
      return null;
    }
  }
}

async function main() {
  const API_KEY = process.env.ALCHEMY_API_KEY;
  const HttpProvider = `https://eth-mainnet.g.alchemy.com/v2/Sutir0tQfRQsB0GRQERYNKB383HrsQaX`;
  console.log("=====HttpProvider====", HttpProvider);
  // Connect to the Ethereum network
  const web3 = new Web3(new Web3.providers.HttpProvider(HttpProvider));

  // Create an instance of the ENS registry contract
  const ens = new ENS(web3, ensRegistryAddress);
  // Fetch the floor price of the ENS domain
  const floorPrice = await getFloorPrice(web3, ens, domain);

  if (floorPrice === null) {
    console.log("No floor price available");
  } else {
    console.log(`Floor price: ${floorPrice} wei`);
  }
}

main();
