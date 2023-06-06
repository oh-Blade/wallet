
import pkg from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import axios from 'axios';

const { networks, Transaction, payments } = pkg;
const ECPair = ECPairFactory(ecc);

// 比特币网络配置
const network = networks.testnet; // 或者 networks.bitcoin (主网)

// 输入地址和私钥
const inputAddress = 'n27wuqct6CzfCisRxEXD6WkhR1NzCuz2z2';
const privateKey = 'cVWg67zUHaLSUSfZQpMYS7TJYVV4acmx3kxTsqjWegrF4KC8g1Mh';

// 输出地址和金额
const outputAddress = 'mutF1SpYVnrcp8yvxh4uxTiPhAHRB5t4XE';
const amount = 0.001; // 要发送的比特币数量

// 构建未签名交易
const buildTransaction = async () => {
  const txb = new Transaction();
  txb.version = 1;

  // 获取 UTXO（未使用的输出）
  // const utxos = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${inputAddress}?unspentOnly=true`);
  // const utxo = utxos.data.txrefs[0];

  // // 添加输入
  // txb.addInput(utxo.tx_hash, utxo.tx_output_n);

  const txnIdBuffer = Buffer.from('fc41b08625d3e1dc4edd266a8aa7e308ed5581dc1decb92cba590de4511dfae0', 'hex');
  txb.addInput(txnIdBuffer, 0); // 添加输入，替换为实际交易的txid和vout索引
  txb.addOutput(Buffer.from(outputAddress), Math.round(amount * 1e8)); // 添加输出
  return txb;
};

// 签名交易
const signTransaction = async (transaction, privateKey) => {
  const keyPair = ECPair.fromWIF(privateKey, network);
  transaction.sign(0, keyPair);
  return transaction;
};

// 广播交易
const broadcastTransaction = async (transaction) => {
  const txHex = transaction.toHex();
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
    const unsignedTransaction = await buildTransaction();
    const signedTransaction = await signTransaction(unsignedTransaction, privateKey);
    await broadcastTransaction(signedTransaction);
  } catch (error) {
    console.error('Failed to send Bitcoin transaction:', error);
  }
};

sendBitcoinTransaction();

