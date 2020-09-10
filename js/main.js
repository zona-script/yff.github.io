// note: USDT, USDC decimal = 6
var ethconnected = false;
var ethaddress = "0x";
var balance = 0;
var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/ee0c9f94261149ab92eefdecbef45d28'));
var cattowerAddress = "0x6124Acd96Fb6Ae67B912f0F2B7765Ae1b08552F4"; // cattower
var tokenAddress = "0xbb14b9b385ca3bd3668bba114b555b3a3e1fa705"; // nyancat token
var currentPageToken = "0x";
var currentPagePoolID = 0;
var currentPageWalletBalance = 0;
var currentPageStaked = 0;
var currentPageReward = 0;
var prices = {
    nyancatusdt: -1,
    nyancateth: -1,
    ethusdt: -1
};
//contract,name,url,weight,yield
var pools = [
    ["0x28b5e0090ff9c1192e1134135deb17e0b1c1cdbf", "SUSHISWAP NYAN/ETH", "https://sushiswap.vision/pair/0x28b5e0090ff9c1192e1134135deb17e0b1c1cdbf", 5, 0, 0],
    ["0x6d37eb2364f8bb28002bd404cf301fa8106dcb14", "SUSHISWAP NYAN/USDT", "https://sushiswap.vision/pair/0x6d37eb2364f8bb28002bd404cf301fa8106dcb14", 3, 0, 0],
    ["0x795065dcc9f64b5614c407a6efdc400da6221fb0", "SUSHISWAP SUSHI/ETH", "https://sushiswap.vision/pair/0x795065dcc9f64b5614c407a6efdc400da6221fb0", 1, 0, 0],
    ["0x06da0fd433c1a5d7a4faa01111c044910a184553", "SUSHISWAP ETH/USDT", "https://sushiswap.vision/pair/0x06da0fd433c1a5d7a4faa01111c044910a184553", 1, 0, 0],
    ["0xd86a120a06255df8d4e2248ab04d4267e23adfaa", "SUSHISWAP USDC/USDT", "https://sushiswap.vision/pair/0xd86a120a06255df8d4e2248ab04d4267e23adfaa", 1, 0, 0],
    ["0x397ff1542f962076d0bfe58ea045ffa2d347aca0", "SUSHISWAP USDC/ETH", "https://sushiswap.vision/pair/0x397ff1542f962076d0bfe58ea045ffa2d347aca0", 1, 0, 0],
    ["0x055cedfe14bce33f985c41d9a1934b7654611aac", "SUSHISWAP DAI/USDT", "https://sushiswap.vision/pair/0x055cedfe14bce33f985c41d9a1934b7654611aac", 1, 0, 0],
    ["0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f", "SUSHISWAP DAI/ETH", "https://sushiswap.vision/pair/0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f", 1, 0, 0]
];

var loadedpools = 0;
var totalPoolWeight = 14; // sum of weight
var sushiswapABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sync","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
var erc20ABI = [{ "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];
var cattowerABI = [{"inputs":[{"internalType":"contract NyanCatToken","name":"_nyan","type":"address"},{"internalType":"uint256","name":"_startBlock","type":"uint256"},{"internalType":"uint256","name":"_nyanswapBlock","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BONUS_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IERC20","name":"_lpToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"bonusEndBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCurrentHalvFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentRewardPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getHalvFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"getMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getRewardPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"halvingPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"migrate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"migrator","outputs":[{"internalType":"contract IMigratorTower","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nyan","outputs":[{"internalType":"contract NyanCatToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nyanPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nyanswapBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingNyan","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IERC20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accNyanPerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IMigratorTower","name":"_migrator","type":"address"}],"name":"setMigrator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
var tokenABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

function updateYield() {
  var tctx = new web3.eth.Contract(cattowerABI, cattowerAddress);
  tctx.methods.getCurrentRewardPerBlock().call( (e,r) => {
    var perblock = r;
    var annualblock = 365 * 86400 / 14; // approximation of 14 sec/block
    var annualreward = annualblock * perblock;
    var perpoolunit = annualreward / totalPoolWeight;


    var ctx0 = new web3.eth.Contract(sushiswapABI, pools[0][0]);
    ctx0.methods.getReserves().call(function(err, result1) {
        ctx0.methods.totalSupply().call(function(err, result2) {
            ctx0.methods.balanceOf(cattowerAddress).call(function(err, result3) {
                var totalSupply = result2
                var stakedSupply = result3
                var percentageOfSupplyInPool = result3 / result2;
                pools[0][4] = (((perpoolunit / (result1['_reserve0'] * 2 / Math.pow(10, 18))) * 100 * pools[0][3]) / percentageOfSupplyInPool);
                pools[0][5] = (result1['_reserve0'] * 2 / Math.pow(10, 18) * percentageOfSupplyInPool);
                //$('.pool0yield').animateNumbers(parseInt(pools[0][4]) + '%');
                loadedPool();
            });
        });
    });

    var ctx1 = new web3.eth.Contract(sushiswapABI, pools[1][0]);
    ctx1.methods.getReserves().call(function(err, result1) {
        ctx1.methods.totalSupply().call(function(err, result2) {
            ctx1.methods.balanceOf(cattowerAddress).call(function(err, result3) {
                var totalSupply = result2;
                var stakedSupply = result3;
                var percentageOfSupplyInPool = result3 / result2;;
                pools[1][4] = (((perpoolunit / (result1['_reserve0'] * 2 / Math.pow(10, 18))) * 100 * pools[1][3]) / percentageOfSupplyInPool);
                pools[1][5] = (result1['_reserve0'] * 2 / Math.pow(10, 18) * percentageOfSupplyInPool);
                //$('.pool1yield').animateNumbers(parseInt(pools[1][4]) + '%');
                loadedPool();
            });
        });
    });

    var ctx2 = new web3.eth.Contract(sushiswapABI, pools[2][0]);
    ctx2.methods.getReserves().call(function(err, result1) {
        ctx2.methods.totalSupply().call(function(err, result2) {
            ctx2.methods.balanceOf(cattowerAddress).call(function(err, result3) {
                var totalSupply = result2;
                var stakedSupply = result3;
                var percentageOfSupplyInPool = result3 / result2;
                pools[2][4] = (((perpoolunit * prices["nyancateth"]) / ((result1["_reserve1"] * 2) / Math.pow(10, 18))) * 100 * pools[2][3]) / percentageOfSupplyInPool;
                pools[2][5] = ((prices["ethusdt"] * result1["_reserve1"] * 2) / Math.pow(10, 18)) * percentageOfSupplyInPool;
                //$('.pool2yield').animateNumbers(parseInt(pools[2][4]) + '%');
                loadedPool();
            });
        });
    });

    var ctx3 = new web3.eth.Contract(sushiswapABI, pools[3][0]);
    ctx3.methods.getReserves().call(function(err, result1) {
        ctx3.methods.totalSupply().call(function(err, result2) {
            ctx3.methods.balanceOf(cattowerAddress).call(function(err, result3) {
                var totalSupply = result2;
                var stakedSupply = result3;
                var percentageOfSupplyInPool = stakedSupply / totalSupply;
                pools[3][4] = (((perpoolunit * prices['nyancateth'] / (result1['_reserve0'] * 2 / Math.pow(10, 18))) * 100 * pools[3][3]) / percentageOfSupplyInPool);
                pools[3][5] = (prices['ethusdt'] * result1["_reserve0"] * 2 / Math.pow(10, 18) * percentageOfSupplyInPool);
                //$('.pool3yield').animateNumbers(parseInt(pools[3][4]) + '%');
                loadedPool()
            });
        });
    });

    var ctx4 = new web3.eth.Contract(sushiswapABI, pools[4][0]);
    ctx4.methods.getReserves().call(function(err, result1) {
        ctx4.methods.totalSupply().call(function(err, result2) {
            ctx4.methods.balanceOf(cattowerAddress).call(function(err, result3) {
                var totalSupply = result2;
                var stakedSupply = result3;
                var percentageOfSupplyInPool = stakedSupply / totalSupply;
                pools[4][4] = (((perpoolunit * prices['nyancatusdt'] / (result1['_reserve0'] * 2 / Math.pow(10, 6))) * 100 * pools[4][3]) / percentageOfSupplyInPool);
                pools[4][5] = (result1['_reserve0'] * 2 / Math.pow(10, 6) * percentageOfSupplyInPool);
                //$('.pool4yield').animateNumbers(parseInt(pools[4][4]) + '%');
                loadedPool()
            });
        });
    });

    var ctx5 = new web3.eth.Contract(sushiswapABI, pools[5][0]);
    ctx5.methods.getReserves().call(function(err, result1) {
        ctx5.methods.totalSupply().call(function(err, result2) {
            ctx5.methods.balanceOf(cattowerAddress).call(function(err, result3) {
                var totalSupply = result2;
                var stakedSupply = result3;
                var percentageOfSupplyInPool = stakedSupply / totalSupply;
                pools[5][4] = (((perpoolunit * prices['nyancateth'] / (result1['_reserve1'] * 2 / Math.pow(10, 18))) * 100 * pools[5][3]) / percentageOfSupplyInPool);
                pools[5][5] = (prices['ethusdt'] * result1['_reserve1'] * 2 / Math.pow(10, 18) * percentageOfSupplyInPool);
                //$('.pool5yield').animateNumbers(parseInt(pools[5][4]) + '%');
                loadedPool();
            });
        });
    });

    var ctx6 = new web3.eth.Contract(sushiswapABI, pools[6][0]);
    ctx6.methods.getReserves().call(function(err, result1) {
        ctx6.methods.totalSupply().call(function(err, result2) {
            ctx6.methods.balanceOf(cattowerAddress).call(function(err, result3) {
                var totalSupply = result2;
                var stakedSupply = result3;
                var percentageOfSupplyInPool = stakedSupply / totalSupply;
                pools[6][4] = (((perpoolunit * prices['nyancatusdt'] / (result1['_reserve0'] * 2 / Math.pow(10, 18))) * 100 * pools[6][3]) / percentageOfSupplyInPool);
                pools[6][5] = (result1['_reserve0'] * 2 / Math.pow(10, 18) * percentageOfSupplyInPool);
                //$('.pool6yield').animateNumbers(parseInt(pools[6][4]) + '%');
                loadedPool()
            });
        });
    });

    var ctx7 = new web3.eth.Contract(sushiswapABI, pools[7][0]);
    ctx7.methods.getReserves().call(function(err, result1) {
        ctx7.methods.totalSupply().call(function(err, result2) {
            ctx7.methods.balanceOf(cattowerAddress).call(function(err, result3) {
                var totalSupply = result2;
                var stakedSupply = result3;
                var percentageOfSupplyInPool = stakedSupply / totalSupply;
                pools[7][4] = (((perpoolunit * prices['nyancateth'] / (result1['_reserve1'] * 2 / Math.pow(10, 18))) * 100 * pools[7][3]) / percentageOfSupplyInPool);
                pools[7][5] = (prices['ethusdt'] * result1['_reserve1'] * 2 / Math.pow(10, 18) * percentageOfSupplyInPool);
                //$('.pool7yield').animateNumbers(parseInt(pools[7][4]) + '%');
                loadedPool();
            });
        });
    });
  });
}

async function connectWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        var conn = await window.ethereum.enable();

        ethconnected = conn.length > 0;
        if (ethconnected) {
            ethaddress = conn[0];
        }
        updateConnectStatus();
        return true;
    }
}

function updateConnectStatus() {
    if (ethconnected) {
        $('body').addClass('web3');
    }
    getBalance(ethaddress);

}

function getSupply() {
    var contract = new web3.eth.Contract(tokenABI, tokenAddress);
    contract.methods.totalSupply().call(function(error, result) {
        result = result / Math.pow(10, 18);
        $('.supply span').animateNumbers(parseInt(result));
        $('.mcap span').animateNumbers(parseInt(result * prices.nyancatusdt));
    });
}

function getBalance(address) {
    var contract = new web3.eth.Contract(tokenABI, tokenAddress);
    contract.methods.balanceOf(address).call(function(error, result) {
        contract.methods.decimals().call(function(error, d) {
            result = result / Math.pow(10, d);
            $('.balance').text(result.toFixedSpecial(2));
            balance = result;
        });
    });
}

function hidepages() {
    $('main').hide();
}

function nav(classname) {
    hidepages();
    $('body').removeClass('approved');
    $('main.' + classname).show();
    if (classname.indexOf('pool') === 0) {
        initpooldata(parseInt(classname.slice(-1)));
        $('main.pool').show();
    }
}

function initpooldata(id) {
    $('.farmname').text(pools[id][1] + ' pool');
    currentPageToken = pools[id][0];
    currentPagePoolID = id;
    //get yield balance

    //get staked balance
    //if larger than zero, approved


    var contract = new web3.eth.Contract(cattowerABI, cattowerAddress);
    contract.methods.userInfo(currentPagePoolID, ethaddress).call(function(error, result) {
        currentPageStaked = result[0];
        result[0] = (result[0] / Math.pow(10, 18)).toFixedSpecial(7);
        $('.stakedbalance').text(result[0]);
    });

    var pagetoken = new web3.eth.Contract(erc20ABI, currentPageToken);
    pagetoken.methods.allowance(ethaddress, cattowerAddress).call(function(error, result) {
        if (result > 0) {
            $('body').addClass('approved');
        }
    });

    contract.methods.pendingNyan(currentPagePoolID, ethaddress).call(function(error, result) {
        currentPageReward = result;
        result = (result / Math.pow(10, 18)).toFixedSpecial(3);
        $('.rewardbalance').animateNumbers(result);

    });

    //get wallet balance
    var contract2 = new web3.eth.Contract(erc20ABI, currentPageToken);
    contract2.methods.balanceOf(ethaddress).call(function(error, result) {
        contract2.methods.decimals().call(function(error, d) {
            currentPageWalletBalance = result;
            result = (result / Math.pow(10, d)).toFixedSpecial(7);
            $('.walletbalance').text(result);
        });
    });
}

function approveSpend() {
    var contract = new web3.eth.Contract(erc20ABI, currentPageToken);

    contract.methods.approve(cattowerAddress, "10000000000000000000000000000000000000000000000000000000").send({ from: ethaddress },
        function(err, transactionHash) {
            //some code
            alert('Please wait until the approve transaction confirm to stake your pool token. You can refresh the page to update');


            var subscription = web3.eth.subscribe('pendingTransactions', function(error, result) {
                    if (!error)
                        addToPool();
                })
                .on("data", function(transaction) {
                });

            $('body').addClass('approved');
        });
}

function addToPool() {
    var contract = new web3.eth.Contract(cattowerABI, cattowerAddress);
    var amount = prompt('Amount to stake', (currentPageWalletBalance - 1000000) / Math.pow(10, 18)); // to fix round error due to JS

    contract.methods
        .deposit(currentPagePoolID, (amount * Math.pow(10, 18) - 100).toFixedSpecial(0))
        .send({ from: ethaddress },
            function(err, transactionHash) {
            });
}

function claimReward() {
    var contract = new web3.eth.Contract(cattowerABI, cattowerAddress);
    contract.methods.deposit(currentPagePoolID, 0).send({ from: ethaddress },
        function(err, transactionHash) {
        });
}

function removeFromPool() {
    var contract = new web3.eth.Contract(cattowerABI, cattowerAddress);
    var amount = prompt('Amount to withdraw', (currentPageStaked - 1000000) / 10 ** 18); // to fix round error due to JS
    contract.methods.withdraw(currentPagePoolID, (amount * Math.pow(10, 18)).toFixedSpecial(0)).send({ from: ethaddress },
        function(err, transactionHash) {
        });
}

function getSushiSwapPrice() {
    var ctx0 = new web3.eth.Contract(sushiswapABI, pools[0][0]); // nyancat-eth
    var ctx1 = new web3.eth.Contract(sushiswapABI, pools[3][0]); // usdc-eth
    var ctx2 = new web3.eth.Contract(sushiswapABI, pools[1][0]); // nyancat-usdt
    try {
        ctx0.methods.getReserves().call(function(err, result1) {
            ctx1.methods.getReserves().call(function(err, result2) {
              ctx2.methods.getReserves().call(function(err, result3) {
                var nyancateth = result1._reserve1 / result1._reserve0;
                prices.nyancateth = nyancateth;
                var ethusdt = result2._reserve1 / result2._reserve0 * Math.pow(10, 18 - 6); // cause USDT uses 6 decimal
                prices.ethusdt = ethusdt;
                var nyancatusdt = result3._reserve1 / result3._reserve0 * Math.pow(10, 18 - 6); // cause USDT uses 6 decimal
                prices.nyancatusdt = nyancatusdt;
                getSupply();
                updatePrice(prices.nyancatusdt);
              });
            });
        });
    } catch (e) {
        console.error(e);
    }
}

function loadedPool() {
    loadedpools++;
    if (loadedpools > 5) {
        var tvl = 0;
        for (var i = 0; i < pools.length; i++) {
            tvl = tvl + pools[i][5] * prices.nyancatusdt;
        }

        var realtvl = 0;
        for (var i = 0; i < pools.length; i++) {
            if (i != 3 && i != 4 && i != 5) {
                realtvl = realtvl + pools[i][5] * prices.nyancatusdt;
            }

        }
        $('.tvl span').animateNumbers(parseInt(tvl));
    }
}

function updatePrice(p) {
    $('.tokenprice').text('$' + (p.toFixedSpecial(7)));
    updateYield();
}

function getlptoken(id) {
    if (typeof id === 'undefined') {
        window.open(pools[currentPagePoolID][2]);
    } else {
        window.open(pools[id][2]);
    }
}

function init() {
    connectWeb3();
}

init();
Number.prototype.toFixedSpecial = function(n) {
    var str = this.toFixed(n);
    if (str.indexOf('e+') === -1)
        return str;

    // if number is in scientific notation, pick (b)ase and (p)ower
    str = str.replace('.', '').split('e+').reduce(function(p, b) {
        return p + Array(b - p.length + 2).join(0);
    });

    if (n > 0)
        str += '.' + Array(n + 1).join(0);

    return str;
};
getSushiSwapPrice();

setInterval(function() {
    initpooldata(currentPagePoolID);
}, 30000);
