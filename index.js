const fs = require("fs");
const IconService = require("icon-sdk-js");
const SCORES = require("./src/scores");
const { getKeystore, getPreps } = require("./src/utils");

const {
  CallBuilder,
  IcxTransactionBuilder,
  CallTransactionBuilder
} = IconService.default.IconBuilder;

const IconConverter = IconService.default.IconConverter;
const IconWallet = IconService.default.IconWallet;
const SignedTransaction = IconService.default.SignedTransaction;

const port = 9080;
const API_NODE = `http://localhost:${port}/api/v3`;
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

console.log("keystore files");
console.log(godKs);
console.log(node0Ks);
console.log(node1Ks);
console.log(node2Ks);
console.log(node3Ks);

async function main() {
  // get preps
}
