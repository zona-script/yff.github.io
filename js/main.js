// note: USDT, USDC decimal = 6
var ethconnected = false;
var ethaddress = "0x";
var balance = 0;
var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/19604bf9e7ba42f38c88e2b167736ddb'));
var cattowerAddress = "0x3009D5D3d5740a018588Cd98A4a2b66754673c48"; // cattower
var yffAddress = "0x8Be6a6158f6B8a19fe60569C757d16e546C2296D"; // YFF Finance
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
    ["0xcfc378f8422ad253c3dadfe636fc3a6fc6611fcb", "UNISWAP YFF/ETH", "https://uniswap.info/pair/0xcfc378f8422ad253c3dadfe636fc3a6fc6611fcb", 5, 0, 0],
    ["0x6d37eb2364f8bb28002bd404cf301fa8106dcb14", "UNISWAP NYAN/USDT", "https://uniswap.info/pair/0x6d37eb2364f8bb28002bd404cf301fa8106dcb14", 3, 0, 0],
    ["0xce84867c3c02b05dc570d0135103d3fb9cc19433", "UNISWAP SUSHI/ETH", "https://uniswap.info/pair/0xce84867c3c02b05dc570d0135103d3fb9cc19433", 1, 0, 0],
    ["0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", "UNISWAP ETH/USDT", "https://uniswap.info/pair/0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", 1, 0, 0],
    ["0x3041cbd36888becc7bbcbc0045e3b1f144466f5f", "UNISWAP USDC/USDT", "https://uniswap.info/pair/0x3041cbd36888becc7bbcbc0045e3b1f144466f5f", 1, 0, 0],
    ["0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc", "UNISWAP USDC/ETH", "https://uniswap.info/pair/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc", 1, 0, 0],
    ["0xb20bd5d04be54f870d5c0d3ca85d82b34b836405", "UNISWAP DAI/USDT", "https://uniswap.info/pair/0xb20bd5d04be54f870d5c0d3ca85d82b34b836405", 1, 0, 0],
    ["0xa478c2975ab1ea89e8196811f51a7b7ade33eb11", "UNISWAP DAI/ETH", "https://uniswap.info/pair/0xa478c2975ab1ea89e8196811f51a7b7ade33eb11", 1, 0, 0]
];

var loadedpools = 0;
var totalPoolWeight = 14; // sum of weight
var uniswapABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
var erc20ABI = [{ "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];
var cattowerABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"constant":true,"inputs":[],"name":"DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"LPtoken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"earned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"initreward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastTimeRewardApplicable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastUpdateTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"notifyRewardAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"periodFinish","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerTokenStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardDistribution","type":"address"}],"name":"setRewardDistribution","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"starttime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userRewardPerTokenPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"yff","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
var tokenABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"_minter","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"governance","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"minters","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_minter","type":"address"}],"name":"removeMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_governance","type":"address"}],"name":"setGovernance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

function updateYield() {
  var tctx = new web3.eth.Contract(cattowerABI, cattowerAddress);
  tctx.methods.getCurrentRewardPerBlock().call( (e,r) => {
    var perblock = r;
    var annualblock = 365 * 86400 / 14; // approximation of 14 sec/block
    var annualreward = annualblock * perblock;
    var perpoolunit = annualreward / totalPoolWeight;


    var ctx0 = new web3.eth.Contract(uniswapABI, pools[0][0]);
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

    var ctx1 = new web3.eth.Contract(uniswapABI, pools[1][0]);
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

    var ctx2 = new web3.eth.Contract(uniswapABI, pools[2][0]);
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

    var ctx3 = new web3.eth.Contract(uniswapABI, pools[3][0]);
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

    var ctx4 = new web3.eth.Contract(uniswapABI, pools[4][0]);
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

    var ctx5 = new web3.eth.Contract(uniswapABI, pools[5][0]);
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

    var ctx6 = new web3.eth.Contract(uniswapABI, pools[6][0]);
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

    var ctx7 = new web3.eth.Contract(uniswapABI, pools[7][0]);
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
    var contract = new web3.eth.Contract(tokenABI, yffAddress);
    contract.methods.totalSupply().call(function(error, result) {
        result = result / Math.pow(10, 18);
        $('.supply span').animateNumbers(parseInt(result));
        $('.mcap span').animateNumbers(parseInt(result * prices.nyancatusdt));
    });
}

function getBalance(address) {
    var contract = new web3.eth.Contract(tokenABI, yffAddress);
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

function getUNISWAPPrice() {
    var ctx0 = new web3.eth.Contract(uniswapABI, pools[0][0]); // nyancat-eth
    var ctx1 = new web3.eth.Contract(uniswapABI, pools[3][0]); // usdc-eth
    var ctx2 = new web3.eth.Contract(uniswapABI, pools[1][0]); // nyancat-usdt
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
getUNISWAPPrice();

setInterval(function() {
    initpooldata(currentPagePoolID);
}, 30000);
