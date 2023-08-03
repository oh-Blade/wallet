
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import axios from 'axios';

// const { networks, Transaction, payments } = pkg;
const ECPair = ECPairFactory(ecc);

// 比特币网络配置
const network = bitcoin.networks.testnet; // 或者 networks.bitcoin (主网)

// 输入地址和私钥
const inputAddress = 'n27wuqct6CzfCisRxEXD6WkhR1NzCuz2z2';
const privateKey = 'cVWg67zUHaLSUSfZQpMYS7TJYVV4acmx3kxTsqjWegrF4KC8g1Mh';

// 输出地址和金额
const outputAddress = 'mutF1SpYVnrcp8yvxh4uxTiPhAHRB5t4XE';
const amount = 0.001; // 要发送的比特币数量

// 构建未签名交易
const buildPabt = async () => {
  const psbt = new bitcoin.Psbt();
  psbt.setVersion(1);

  // 获取 UTXO（未使用的输出）
  // const utxos = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${inputAddress}?unspentOnly=true`);
  // const utxo = utxos.data.txrefs[0];

  // // 添加输入
  // txb.addInput(utxo.tx_hash, utxo.tx_output_n);
  
  const nonWitnessUtxo = Buffer.from('fc41b08625d3e1dc4edd266a8aa7e308ed5581dc1decb92cba590de4511dfae0', 'hex');
  
  const mixin = { nonWitnessUtxo };
  const mixin2 = {};

  psbt.addInput({
    hash: 'fc41b08625d3e1dc4edd266a8aa7e308ed5581dc1decb92cba590de4511dfae0',
    index: 0,
    ...mixin
  }); // 添加输入，替换为实际交易的txid和vout索引
  psbt.addOutput({
    address: outputAddress,
    value: 1e5
  }).addOutput({
    address: inputAddress,
    value: 1e6
  }); // 添加输出
  return psbt.toBase64();
};

// 签名交易
const signTransaction = async (psbtBaseText, privateKey) => {
  
  const keyPair = ECPair.fromPrivateKey(privateKey, { network: network });
  const signer = bitcoin.Psbt.fromBase64(psbtBaseText);
  signer.signAllInputs(keyPair);
  
  return signer.toBase64();
};
//
// 广播交易  kFV3m9cPbnPEcZ
const broadcastTransaction = async (psbt) => {
  const txHex = psbt.extractTransaction().toHex();

  // const txHex = transaction.toHex();
  const broadcastUrl = 'https://api.blockcypher.com/v1/btc/test3/txs/push';
  try {
    const response = await axios.post(broadcastUrl, { tx: txHex });
    console.log('Transaction broadcasted:', response.data);
  } catch (error) {
    console.error('Failed to broadcast transaction:', error);
  }
};

// 发送比特币交易
const sendBitcoinTransaction = async () => {
  try {
    const psbtBaseText = await buildPabt();

    console.log("psbtBaseText: "+psbtBaseText);

    const signText = await signTransaction(psbtBaseText, privateKey);
    console.log("signText: "+signText)
    const final = bitcoin.Psbt.fromBase64(signText);

    await broadcastTransaction(final);
  } catch (error) {
    console.error('Failed to send Bitcoin transaction:', error);
  }
};

sendBitcoinTransaction();



/*************** */
// 导入依赖库
// const bitcoin = require('bitcoinjs-lib');
// const bip39 = require('bip39');
// const bip32 = require('bip32'); 
// const bcoin = require('bcoin');

// // 生成一个私钥
// const mnemonic = bip39.generateMnemonic(); 
// const seed = bip39.mnemonicToSeed(mnemonic);
// const root = bip32.fromSeed(seed);
// const keyPair = root.derivePath("m/44'/0'/0'/0/0");

// // 构建交易
// const tx = new bitcoin.TransactionBuilder();
// tx.setVersion(1);
// tx.addInput('1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA', 'fd1201c2a9050f3d33e884e2f4c617a7bb7b39a7bac7f0d78a045a5d4a03e4f3', 0); // 使用实际值
// tx.addOutput('1EYTGtG4LnFfiMvjJdsU7GMGCQvsRSjYhx', 0.8 * 1e8); // 0.8 BTC
// tx.sign(0, keyPair); 

// // 序列化交易并广播
// const txHex = tx.build().toHex();
// const client = new bcoin.http.Client();

// client.broadcast(txHex).then(response => {
//   console.log(response);
// });

