const IconService = require("icon-sdk-js");
const SCORES = require("./src/scores");
const crypto = require("crypto");
const { getKeystore,
  getPreps,
  sendIcx,
  getIcxBalance,
  sleep,
  registerPrep,
  prepDetails
} = require("./src/utils");

const {
  CallBuilder,
  IcxTransactionBuilder,
  CallTransactionBuilder
} = IconService.default.IconBuilder;

const {
  hostname,
  nid
} = SCORES.useNetwork;

const IconConverter = IconService.default.IconConverter;
const IconWallet = IconService.default.IconWallet;
const SignedTransaction = IconService.default.SignedTransaction;

const port = 9080;
const API_NODE = `http://${hostname}:${port}/api/v3`;
const httpProvider = new IconService.default.HttpProvider(API_NODE);
const iconService = new IconService.default(httpProvider);

const walletsPath = {
  god: "./wallets/godWallet.json",
  node0: "./wallets/ks0.json",
  node1: "./wallets/ks1.json",
  node2: "./wallets/ks2.json",
  node3: "./wallets/ks3.json"
};

const godKs = getKeystore(walletsPath.god);
const node0Ks = getKeystore(walletsPath.node0);
const node1Ks = getKeystore(walletsPath.node1);
const node2Ks = getKeystore(walletsPath.node2);
const node3Ks = getKeystore(walletsPath.node3);
// load keystore files
const godKsLoaded = IconWallet.loadKeystore(godKs, 'gochain');
const node0KsLoaded = IconWallet.loadKeystore(node0Ks, 'gochain');
const node1KsLoaded = IconWallet.loadKeystore(node1Ks, 'gochain');
const node2KsLoaded = IconWallet.loadKeystore(node2Ks, 'gochain');
const node3KsLoaded = IconWallet.loadKeystore(node3Ks, 'gochain');

const lineBreak = "******************************************";
async function main() {
  try {
    // get preps
    const preps = await getPreps(hostname, false, port);
    console.log(preps);

    if (preps.preps.length === 0) {
      // if no preps are registered in the network
      // initiate decentralization process.
      // Step #1: send balance from god wallet to each node
      // await fundNode(node0Ks);
      // console.log(lineBreak);
      // await fundNode(node1Ks);
      // console.log(lineBreak);
      // await fundNode(node2Ks);
      // console.log(lineBreak);
      // await fundNode(node3Ks);
      // console.log(lineBreak);

      // Register prep
      await registerNode(node0Ks);
    } else {
      // if preps are already registered in the network;
      console.log("Preps are already registered in the network")
      console.log(preps);
    }
  } catch (err) {
    console.log('Error running main script')
    console.log(err);
  }
}

main();

async function fundNode(nodeKs) {
const walletLoaded = IconWallet.loadKeystore(nodeKs, 'gochain');
  console.log(`sending balance from god wallet to node ${walletLoaded.getAddress()}`)
  const tx0 = await sendIcx(
    walletLoaded.getAddress(),
    godKs,
    10000000,
    iconService,
    nid,
    IcxTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
  console.log(`Balance sent. TxHash: ${tx0}`)
  await sleep(5000);
  // fetch balance from chain
  console.log('fetching node wallet balance from chain');
  const tx0Balance = await getIcxBalance(
    hostname,
    false,
    port,
    walletLoaded.getAddress()
  )
  console.log(`Balance: ${tx0Balance}`);
}

async function registerNode(nodeKs) {
const walletLoaded = IconWallet.loadKeystore(nodeKs, 'gochain');
  const localPrepDetails = { ...prepDetails };
  localPrepDetails.name = localPrepDetails.name + "-" + crypto.randomUUID();
  localPrepDetails.nodeAddress = walletLoaded.getAddress();

  console.log('Registering Prep');
  const prep = await registerPrep(
    nodeKs,
    localPrepDetails,
    SCORES.mainnet.governance,
    nid,
    iconService,
    IcxTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
  console.log(`Registration result txHash: ${prep}`)
}

async function stakeNode(nodeWallet) {
  //
}

async function voteNode(nodeWallet) {
  //
}

async function bondNode(nodeWallet) {
  //
}
