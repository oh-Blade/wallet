import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';

import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
const bip32 = BIP32Factory(ecc);

import util from 'ethereumjs-util';

//设置生成测试or正式环境的钱包
const network = bitcoin.networks.testnet // 主网 bitcoin.networks.bitcoin

//生成助记词
var mnemonic = bip39.generateMnemonic();

// 根据助记词导入钱包
// var mnemonic = 'rice plunge cake awake rain floor roof minor acquire uncle fish cliff'; //bip39.generateMnemonic()

console.log("助记词：", mnemonic)
// 计算seed:
//2.将助记词转成seed
//与ETH一样的seed
const getSeed = async () => {
  let seed = await bip39.mnemonicToSeed(mnemonic)
  console.log("seed：" + util.bufferToHex(seed))
  return seed
}
/**
 * 生成助记词 私钥 公钥 钱包地址
 */
const obtainAccount = async () => {
  let seed = await getSeed()
  const root = bip32.fromSeed(seed, network)
  for (let i = 0; i < 5; i++) {
    //主网
    // let path = "m/44'/0'/0'/0/" + i;
    let path = "m/44'/1'/0'/0/" + i;
    let keyPair = root.derivePath(path)

    console.log("BTC私钥：", keyPair.toWIF())

    console.log("BTC公钥：", keyPair.publicKey.toString("hex"))

    let address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: network })

    console.log("BTC地址：", address.address, "\n")
  }

}
obtainAccount();


/**
 * 助记词： rice plunge cake awake rain floor roof minor acquire uncle fish cliff
seed：0xfd27fd8af3f44ed7ba118ce6979aac4d6ac26bceae1a689eacc83ecde0900bc5c33b92761c48925f60f777de208e1250aaf99749d80a6e819ff424ca6a76ee81
BTC私钥： cVWg67zUHaLSUSfZQpMYS7TJYVV4acmx3kxTsqjWegrF4KC8g1Mh
BTC公钥： 03a91261ecf32e509c963cc2341fdf24e2236dff9e85189199caacea95fee5ad45
BTC地址： n27wuqct6CzfCisRxEXD6WkhR1NzCuz2z2    //0.01142969

BTC私钥： cUAbM5hgip3TbRAMPC9xEGxJtB8KDuzLFxxeSWURZCaBJUNxp85e
BTC公钥： 03cb7b2e27e74b5ffe78d910a4ac9a1e8cf172da12a5e162d5ddc69f6edb2b28ca
BTC地址： mhStNAkTzpPEstEEav5d83dPfp6rePeTTd 

BTC私钥： cW1fGQsBNpSgEpLs8jPxtDEvLnpbqwtA3cquC7kVyPkWwovYjZGp
BTC公钥： 03fc930786ad55cda67b2186d8dc5eb24db2a58ac8ed9fa21743943ad4b29cf3d2
BTC地址： mg2P7A4VbTGpaAk1xzFx2m2x1Q6RNGZWLt 

BTC私钥： cUAQs9RBiu9gHntVsEC8p8QhGyczGKiGFjj4CSj4d7w4s42LMLDa
BTC公钥： 03da6a8bfe657c4feb32a323ede4ca1bdf3479c51aa1f00a0f65530a40a636d1f3
BTC地址： miyXBcmt8FygWQorBYFc6ozj3f5BEPR5jo 

BTC私钥： cUENgWPrqdj8jgMprtQBHZEY8FbKrgJ2s2XvLZ9rfRokRfKdu18u
BTC公钥： 02e45c36162e25c9822445f9f6e8a4c5bfd114362c9f91f9963df00f67faa83ed4
BTC地址： mjo2D6rgwkrRpJr8XhC4hbAiYT7UiKU5Tr
 */


/**
 * 助记词： repair water joy antique camera mango surprise deliver awesome satoshi accuse critic
seed：0x67394bc27a067af4362ad3a2424c98ff862c0f3930a9c87812a5ef46ed3a9ee8633940d03ae62de4713cb3fa2081e069df991e5e0292a6c0a5240d483709f916
BTC私钥： cNPkdbtJCPzE3WSJGmRKW4mmV1A2kVVTP7NumM1GY3maCzutvwfr
BTC公钥： 034b41da41acbd2e8497ce7690442f2d2f43cba6784e9e46e7ba7072fe4e0d7f05
BTC地址： mutF1SpYVnrcp8yvxh4uxTiPhAHRB5t4XE 

BTC私钥： cSdRxKByK9TuCANd7n2wsbvZwZy4VC3T1buXjToBszRp45SNhV3k
BTC公钥： 0381411efc4853c8b769478351ec75d82b469ac4d26ad9a85a7cb114c2ee703cc2
BTC地址： mgnho3SVZKfcUe3rfjoBjJZ8AC5HhbRxnq 

BTC私钥： cNxqFAi5YJeUZPES1iw4QKL13eSAEenn7gx4ATPAzrn4PhmcMg1C
BTC公钥： 027cdefcdb4fdf3d090ad67412206a32448bf46dbc65ab9135701188f1f49b8f88
BTC地址： myRBt9bGBNLfmiJFF6iZ9HH7yfpQopmU6T 

BTC私钥： cTS2esP2LUUxtKwvjcMZQPyPYmvCDQ1irWTwwzjD64wmFNCoDpGm
BTC公钥： 02d3ae2f41a4d8f6cfaebe765c8403af2bba14014ba04a38357adc12bd3fc8a6f1
BTC地址： n3wQFNVYN6GUyVjo8aNM5xQoAeF13vPNQf 

BTC私钥： cVEv3gpaj1T5p6LrW5sxMw5Ajc2Lv3BxT3ZjJPi2PWsBYQR31ufN
BTC公钥： 02b56afb8a584bb7a2662e6fe9714df29d4f7f5b3b2318ac4c4d826655ab37d6f4
BTC地址： mh8rXv7TaPHwLbaLiFeE485PKuBUMRoUy1
 */