Number.prototype.toFixedSpecial = function(n) {
    let str = this.toFixed(n);
    if (str.indexOf('e+') === -1)
        return str;
    str = str.replace('.', '').split('e+').reduce(function(p, b) {
        return p + Array(b - p.length + 2).join('0');
    });
    if (n > 0)
        str += '.' + Array(n + 1).join('0');
    return str;
}
;
let ethConnected = false;
let ethAddress = "0x";
let tokenValue = {
    withdraw: 0,
    staked: 0,
    balanceUni: 0,
    balanceYffc: 0,
};
const timeReloadData = 45;
const usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const chain = "mainnet";
const config = {
    ropsten: {
        provider: "https://ropsten.infura.io/v3/19604bf9e7ba42f38c88e2b167736ddb",
        tokenAddress: "0x58B92d7C176ccF1951CcAda2c1920A44b7441233",
        uniV2Address: "0xb319EE941b5aefb8Fe07EAAd3aB9da783AC38834",
        stakeAddressContract: "0x3009D5D3d5740a018588Cd98A4a2b66754673c48"
    },
    mainnet: {
        provider: "https://mainnet.infura.io/v3/19604bf9e7ba42f38c88e2b167736ddb",
        tokenAddress: "0x8Be6a6158f6B8a19fe60569C757d16e546C2296D",
        uniV2Address: "0xEa8091470479B457792F2F56a4E58C7329Bc1b1D",
        stakeAddressContract: "0x1806b797d00c4c8f6c92967B4def1D8c7d62F39e"
    }
};
const ticker = "yff";
const tokenName = "YFF";
const uniName = "Uniswap V2";
let web3;
const tokenAddress = config[chain].tokenAddress;
const uniAddress = config[chain].uniV2Address;
const stakeAddressContract = config[chain].stakeAddressContract;
const tokenABI = [{
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "_minter",
        "type": "address"
    }],
    "name": "addMinter",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }],
    "name": "allowance",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
    }],
    "name": "decreaseAllowance",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "governance",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
    }],
    "name": "increaseAllowance",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "minters",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
        "internalType": "string",
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "_minter",
        "type": "address"
    }],
    "name": "removeMinter",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "_governance",
        "type": "address"
    }],
    "name": "setGovernance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
        "internalType": "string",
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "sender",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}];
const stakeAbi = [{
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
    }],
    "name": "RewardAdded",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
    }],
    "name": "RewardPaid",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Staked",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Withdrawn",
    "type": "event"
}, {
    "constant": true,
    "inputs": [],
    "name": "DURATION",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "bpt",
    "outputs": [{
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "earned",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "exit",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "getReward",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "initreward",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "isOwner",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "lastTimeRewardApplicable",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "lastUpdateTime",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
    }],
    "name": "notifyRewardAmount",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "periodFinish",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "rewardPerToken",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "rewardPerTokenStored",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "rewardRate",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "rewards",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "_rewardDistribution",
        "type": "address"
    }],
    "name": "setRewardDistribution",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "stake",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "starttime",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "userRewardPerTokenPaid",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "yfi",
    "outputs": [{
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}];
const uniAbi = [{
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "owners",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "mintingFinished",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "lockTransfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_from",
        "type": "address"
    }, {
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_villains",
        "type": "address[]"
    }],
    "name": "addManyToBlacklist",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "INITIAL_SUPPLY",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
        "name": "",
        "type": "uint8"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_amount",
        "type": "uint256"
    }],
    "name": "mint",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_value",
        "type": "uint256"
    }],
    "name": "burn",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_villain",
        "type": "address"
    }],
    "name": "addToBlacklist",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_villain",
        "type": "address"
    }],
    "name": "removeFromBlacklist",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
    }, {
        "name": "_subtractedValue",
        "type": "uint256"
    }],
    "name": "decreaseApproval",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "name": "balance",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "finishMinting",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "isUnlocked",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }],
    "name": "newOwner",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "unlockTransfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }],
    "name": "deleteOwner",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
    }, {
        "name": "_addedValue",
        "type": "uint256"
    }],
    "name": "increaseApproval",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }, {
        "name": "_spender",
        "type": "address"
    }],
    "name": "allowance",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "root",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "blacklist",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "name": "_wallet",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "burner",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "Burn",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "to",
        "type": "address"
    }, {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Mint",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [],
    "name": "MintFinished",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "owner",
        "type": "address"
    }, {
        "indexed": true,
        "name": "spender",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "from",
        "type": "address"
    }, {
        "indexed": true,
        "name": "to",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}];
async function connectWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        web3 = window.web3;
        let conn = await window.ethereum.enable();
        ethConnected = conn.length > 0;
        if (ethConnected) {
            ethAddress = conn[0]
        }
        updateConnectStatus();
        web3.eth.getAccounts().then(console.log);
        return true;
    }
}
function updateConnectStatus() {
    if (ethConnected) {
        $('body').addClass('web3')
    }
    getBalance(ethAddress)
}
function getSupply(price) {
    let result = 30000;
    $('.mcap span').animateNumbers(parseInt((result * price).toString()))
}
function getBalance(address) {
    let contract = new window.web3.eth.Contract(tokenABI,tokenAddress);
    contract.methods.balanceOf(address).call(function(error, result) {
        contract.methods.decimals().call(function(error, d) {
            result = result / Math.pow(10, d);
            tokenValue.balanceYffc = result;
            updateView();
        });
    });
}
function getUniBalance() {
    let contract = new window.web3.eth.Contract(uniAbi,uniAddress);
    contract.methods.balanceOf(ethAddress).call(function(error, result) {
        contract.methods.decimals().call(function(error, d) {
            tokenValue.balanceUni = result / Math.pow(10, d);
            updateView();
        });
    });
}
function hidepages() {
    $('main').hide()
}
function nav(classname) {
    hidepages();
    $('body').removeClass('approved');
    $('main.' + classname).show();
    if (classname.indexOf('stake') === 0) {
        $('main.stake').show()
    }
}
async function approveSpend() {
    await window.ethereum.enable();
    const contract = new window.web3.eth.Contract(uniAbi,uniAddress);
    await contract.methods.approve(stakeAddressContract, "100000000000000000000000000000000").send({
        from: ethAddress
    }).on('transactionHash', function(hash) {
        console.log('done');
        console.log(hash);
    }).on('error', function(error) {
        console.log(error);
    });
}
async function stake() {
    if (tokenValue.balanceUni <= 0)
        return;
    let valueDeposit = $("#stakedbalance").val();
    let valueDepositInt = parseInt(valueDeposit);
    if (valueDepositInt <= 0 || valueDepositInt > tokenValue.balanceUni)
        return;
    await window.ethereum.enable();
    const contract = new window.web3.eth.Contract(stakeAbi,stakeAddressContract);
    await contract.methods.stake((valueDepositInt * 1000000000).toString().split(".")[0] + "000000000").send({
        from: ethAddress
    }).on('transactionHash', function(hash) {
        console.log('done');
        console.log(hash);
    }).on('error', function(error) {
        console.log(error);
    });
}
async function unstake() {
    await window.ethereum.enable();
    const contract = new window.web3.eth.Contract(stakeAbi,stakeAddressContract);
    const balanceOf = await contract.methods.balanceOf(ethAddress).call();
    await contract.methods.withdraw(balanceOf).send({
        from: ethAddress
    }).on('transactionHash', function(hash) {
        console.log('done');
        console.log(hash);
    }).on('error', function(error) {
        console.log(error);
    });
}
async function checkApprove() {
    const contract = new window.web3.eth.Contract(uniAbi,uniAddress);
    const allowance = await contract.methods.allowance(ethAddress, stakeAddressContract).call();
    if (allowance !== "0") {
        $(".not-approved-spend").hide();
        $(".approved-spend").show()
    }
}
async function getStakingInformation() {
    const contract = new window.web3.eth.Contract(stakeAbi,stakeAddressContract);
    const staked = await contract.methods.earned(ethAddress).call();
    const amountAvailableToWithdraw = await contract.methods.balanceOf(ethAddress).call();
    tokenValue.staked = staked;
    tokenValue.withdraw = amountAvailableToWithdraw;
    updateView();
}
async function claimReward() {
    await window.ethereum.enable();
    const contract = new window.web3.eth.Contract(stakeAbi,stakeAddressContract);
    await contract.methods.getReward().send({
        from: ethAddress
    }).on('transactionHash', function(hash) {
        console.log('done');
        console.log(hash);
    }).on('error', function(error) {
        console.log(error);
    });
}
function updateView() {
    $('.walletbalance').text(tokenValue.balanceUni.toFixedSpecial(5) + ` ${uniName}`);
    $('.balanceyffc').text(tokenValue.balanceYffc.toFixedSpecial(5) + ` ${tokenName}`);
    $('.rewardbalance').text((parseInt(tokenValue.staked) / Math.pow(10, 18)).toFixedSpecial(5) + ` ${tokenName}`);
    $('.stakedbalance').text((parseInt(tokenValue.withdraw) / Math.pow(10, 18)).toFixedSpecial(7) + ` ${uniName}`);
}
function getCoinGecko() {
    try {
        $.ajax({
            "url": `https://api.coingecko.com/api/v3/simple/price?ids=yffc-finance&vs_currencies=usd`,
            "method": "GET",
        }).done(function(response) {
            let price = response["yffc-finance"]["usd"];
            updatePrice(price);
            getSupply(price);
        });
    } catch (e) {
        console.error(e);
        updatePrice(0);
        getSupply(0);
    }
}
function updatePrice(p) {
    $('.tokenprice').text('$' + (p.toFixedSpecial(5)));
}
function goToBuy() {
    window.open(`https://uniswap.info/pair/0xea8091470479b457792f2f56a4e58c7329bc1b1d`, '_blank');
}
async function init() {
    await connectWeb3().catch(e=>{
        console.log(e)
    }
    );
    await getUniBalance();
    await getStakingInformation();
    await checkApprove();
    getCoinGecko();
    setInterval(function() {
        getCoinGecko();
        try {
            getUniBalance();
            getStakingInformation();
            getBalance(ethAddress);
        } catch (e) {}
    }, timeReloadData * 1000);
}
init().catch();
