const IconService = require("icon-sdk-js");
const SCORES = require("./src/scores");
const crypto = require("crypto");
const {
  getIcxBalance,
  getKeystore,
  getPreps,
  prepDetails,
  registerPRepNodePublicKey,
  registerPrep,
  saveResult,
  sendIcx,
  setBond,
  setBonderList,
  setDelegation,
  setStake,
  sleep,
  getTxResult
} = require("./src/utils");

const {
  // CallBuilder,
  IcxTransactionBuilder,
  CallTransactionBuilder
} = IconService.default.IconBuilder;

const { hostname, nid } = SCORES.useNetwork;

const IconConverter = IconService.default.IconConverter;
const IconWallet = IconService.default.IconWallet;
const SignedTransaction = IconService.default.SignedTransaction;

const port = 9082;
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
// const godKsLoaded = IconWallet.loadKeystore(godKs, 'gochain');
const node0KsLoaded = IconWallet.loadKeystore(node0Ks, "gochain");
const node1KsLoaded = IconWallet.loadKeystore(node1Ks, "gochain");
const node2KsLoaded = IconWallet.loadKeystore(node2Ks, "gochain");
const node3KsLoaded = IconWallet.loadKeystore(node3Ks, "gochain");

const balance = 10000000;
const toStake = 9000000;
const toVote = 5000000;
const toBond = 4000000;
const bonderlist = [
  node0KsLoaded.getAddress(),
  node1KsLoaded.getAddress(),
  node2KsLoaded.getAddress(),
  node3KsLoaded.getAddress()
];
const lineBreak = "******************************************";
async function main() {
  try {
    // get preps
    const preps = await getPreps(hostname, false, port);
    console.log(preps);

    // if no preps are registered in the network
    // initiate decentralization process.
    if (preps.preps.length === 0) {
      // Step #1: send balance from god wallet to each node
      await fundNode(node0Ks, balance);
      console.log(lineBreak, balance);
      await fundNode(node1Ks, balance);
      console.log(lineBreak, balance);
      await fundNode(node2Ks, balance);
      console.log(lineBreak, balance);
      await fundNode(node3Ks, balance);
      console.log(lineBreak);

      // Step #2: Registering preps
      await registerNode(node0Ks);
      console.log(lineBreak);
      await registerNode(node1Ks);
      console.log(lineBreak);
      await registerNode(node2Ks);
      console.log(lineBreak);
      await registerNode(node3Ks);
      console.log(lineBreak);

      // Step #3: stake on each wallet
      await stakeNode(node0Ks, toStake);
      await stakeNode(node1Ks, toStake);
      await stakeNode(node2Ks, toStake);
      await stakeNode(node3Ks, toStake);
      await sleep(5000);

      // Step #4: vote on each wallet
      await voteNode(node0Ks, toVote);
      await voteNode(node1Ks, toVote);
      await voteNode(node2Ks, toVote);
      await voteNode(node3Ks, toVote);
      await sleep(5000);

      // Step #5: bond on each wallet
      await bondNode(node0Ks, toBond);
      await bondNode(node1Ks, toBond);
      await bondNode(node2Ks, toBond);
      await bondNode(node3Ks, toBond);
      await sleep(5000);

      // Step #5: bond on each wallet
      await registerPubKey(node0Ks);
      await registerPubKey(node1Ks);
      await registerPubKey(node2Ks);
      await registerPubKey(node3Ks);
      await sleep(5000);

      const a = await getPreps(hostname, false, port);
      console.log(a);
      saveResult(a);
    } else {
      // if preps are already registered in the network;
      console.log("Preps are already registered in the network");
      console.log(preps);
      saveResult(preps);
    }
  } catch (err) {
    console.log("Error running main script");
    console.log(err);
  }
}

main();

async function fundNode(nodeKs, balance) {
  const walletLoaded = IconWallet.loadKeystore(nodeKs, "gochain");
  console.log(
    `sending balance from god wallet to node ${walletLoaded.getAddress()}`
  );
  const tx0 = await sendIcx(
    walletLoaded.getAddress(),
    godKs,
    balance,
    iconService,
    nid,
    IcxTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
  console.log(`Balance sent. TxHash: ${tx0}`);
  await sleep(5000);
  // fetch balance from chain
  console.log("fetching node wallet balance from chain");
  const tx0Balance = await getIcxBalance(
    hostname,
    false,
    port,
    walletLoaded.getAddress()
  );
  console.log(`Balance: ${tx0Balance}`);
}

async function registerNode(nodeKs) {
  const walletLoaded = IconWallet.loadKeystore(nodeKs, "gochain");
  const localPrepDetails = { ...prepDetails };
  localPrepDetails.name = localPrepDetails.name + "-" + crypto.randomUUID();
  localPrepDetails.nodeAddress = walletLoaded.getAddress();

  console.log(`Registering Prep => ${localPrepDetails.name}`);
  const prep = await registerPrep(
    nodeKs,
    localPrepDetails,
    SCORES.mainnet.governance,
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
  console.log(`Registration result txHash: ${prep}`);
}

async function stakeNode(nodeKs, amount) {
  const walletLoaded = IconWallet.loadKeystore(nodeKs, "gochain");

  console.log(`Staking wallet Prep => ${walletLoaded.getAddress()}`);
  const stake = await setStake(
    amount,
    nodeKs,
    SCORES.mainnet.governance,
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
  console.log(`Staking result txHash: ${stake}`);
}

async function voteNode(nodeKs, amount) {
  const walletLoaded = IconWallet.loadKeystore(nodeKs, "gochain");

  console.log(`voting wallet Prep => ${walletLoaded.getAddress()}`);
  const vote = await setDelegation(
    amount,
    nodeKs,
    SCORES.mainnet.governance,
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
  console.log(`voting result txHash: ${vote}`);
}

async function bondNode(nodeKs, amount) {
  const walletLoaded = IconWallet.loadKeystore(nodeKs, "gochain");
  // setbonderlist
  console.log("Setting bonderlist");
  const bonderlistResult = await setBonderList(
    nodeKs,
    bonderlist,
    SCORES.mainnet.governance,
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
  console.log(`Result of setting bonderlist. txHash ${bonderlistResult}`);
  sleep(5000);

  // setbond
  console.log(`bonding wallet Prep => ${walletLoaded.getAddress()}`);
  const bond = await setBond(
    amount,
    nodeKs,
    SCORES.mainnet.governance,
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
  console.log(`bonding result txHash: ${bond}`);
}

async function registerPubKey(nodeKs) {
  const walletLoaded = IconWallet.loadKeystore(nodeKs, "gochain");
  const pubKey = walletLoaded.getPublicKey(true);
  const address = walletLoaded.getAddress();
  console.log(`PubKey: ${pubKey}`);
  const txResult = await registerPRepNodePublicKey(
    nodeKs,
    pubKey,
    address,
    SCORES.mainnet.governance,
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
  console.log(`Result of pubKey registration. txHash ${txResult}`);
  sleep(5000);
  const txResult2 = await getTxResult(txResult, hostname, false, port);
  console.log("TxResult2");
  console.log(txResult2);
}
