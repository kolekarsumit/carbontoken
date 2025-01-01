import { createThirdwebClient, defineChain, getContract } from "thirdweb";


const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
export const client=createThirdwebClient({
    clientId:CLIENT_ID as string,
});

export const chain=defineChain(11155111);

const contractAddress="0x8b4848d8dDD4504b328500579A1eF14fD9Ed631b";

const contractABI=[
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_industry",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_gov_add",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_comp_add",
        "type": "string"
      }
    ],
    "name": "add_company",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "companyAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCompany",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "industry_type",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "gov_id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "comp_address",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "Address",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "allocatedcarbon",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "remaining",
            "type": "uint256"
          }
        ],
        "internalType": "struct CarbonContract.Company[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_address",
        "type": "string"
      }
    ],
    "name": "getAllocatedCarbon",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_address",
        "type": "string"
      }
    ],
    "name": "getRemainingCarbon",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_address",
        "type": "string"
      }
    ],
    "name": "getYearMonthData",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_address",
        "type": "string"
      }
    ],
    "name": "getmycompany",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "industry_type",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "gov_id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "comp_address",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "Address",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "allocatedcarbon",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "remaining",
            "type": "uint256"
          }
        ],
        "internalType": "struct CarbonContract.Company",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mycomp",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_gov_id",
        "type": "uint256"
      }
    ],
    "name": "remove_company",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_address",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_yearMonth",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "storeYearMonthData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_govId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "stringaddress",
        "type": "string"
      }
    ],
    "name": "validateGovId",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]as const;


  export const CONTRACT=getContract({
    client:client,
    chain:chain,
    address:contractAddress,
    abi:contractABI,
  });