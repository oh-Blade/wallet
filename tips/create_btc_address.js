import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';

import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
const bip32 = BIP32Factory(ecc);

import util from 'ethereumjs-util';

//设置生成测试or正式环境的钱包
const network = bitcoin.networks.bitcoin
var mnemonic = bip39.generateMnemonic()
console.log("助记词：", mnemonic)
// 计算seed:
//2.将助记词转成seed
//与ETH一样的seed
const getSeed = async () => {
  let seed = await bip39.mnemonicToSeed(mnemonic)
  console.log("seed：" + util.bufferToHex(seed))
  return seed
}

const obtainAccount = async () => {
  let seed = await getSeed()
  const root = bip32.fromSeed(seed, network)
  for (let i = 0; i < 5; i++) {
    let path = "m/44'/0'/0'/0/" + i;
    let keyPair = root.derivePath(path)

    console.log("BTC私钥：", keyPair.toWIF())

    console.log("BTC公钥：", keyPair.publicKey.toString("hex"))

    let address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: network })

    console.log("BTC地址：", address.address, "\n")
  }

}
obtainAccount();
