/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  ChargingStationManager,
  ChargingStationManagerInterface,
} from "../../contracts/ChargingStationManager";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "stationId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "availableSlots",
        type: "uint256",
      },
    ],
    name: "AvailabilityUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "stationId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    name: "ChargingStationAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "stationId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "slotNumber",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "SlotOccupied",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "stationId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "slotNumber",
        type: "uint256",
      },
    ],
    name: "SlotReleased",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_location",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_latitude",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_longitude",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalSlots",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_chargingSpeed",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_pricePerKwh",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "_amenities",
        type: "string[]",
      },
    ],
    name: "addChargingStation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "chargingSlots",
    outputs: [
      {
        internalType: "uint256",
        name: "stationId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "slotNumber",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isOccupied",
        type: "bool",
      },
      {
        internalType: "address",
        name: "currentUser",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "estimatedEndTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "chargingStations",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "latitude",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "longitude",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalSlots",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableSlots",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "chargingSpeed",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pricePerKwh",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllChargingStations",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "location",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "latitude",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "longitude",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSlots",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "availableSlots",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "chargingSpeed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pricePerKwh",
            type: "uint256",
          },
          {
            internalType: "string[]",
            name: "amenities",
            type: "string[]",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
        ],
        internalType: "struct ChargingStationManager.ChargingStation[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_stationId",
        type: "uint256",
      },
    ],
    name: "getAvailableSlots",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_stationId",
        type: "uint256",
      },
    ],
    name: "getChargingStation",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "location",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "latitude",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "longitude",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSlots",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "availableSlots",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "chargingSpeed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pricePerKwh",
            type: "uint256",
          },
          {
            internalType: "string[]",
            name: "amenities",
            type: "string[]",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
        ],
        internalType: "struct ChargingStationManager.ChargingStation",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentStationId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_stationId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_slotNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_estimatedEndTime",
        type: "uint256",
      },
    ],
    name: "occupySlot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_stationId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_slotNumber",
        type: "uint256",
      },
    ],
    name: "releaseSlot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "stationExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_stationId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isActive",
        type: "bool",
      },
    ],
    name: "updateStationAvailability",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60808060405234607a57331560645760008054336001600160a01b0319821681178355916001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a360006001556115ef90816100808239f35b631e4fbdf760e01b600052600060045260246000fd5b600080fdfe6080604052600436101561001257600080fd5b60003560e01c80630801dfd014610fc95780631989ab3914610f605780632240fcaa14610f42578063420a7ce814610de6578063568c30af146106e15780635b0964871461066b5780635cea8f3914610604578063617b01a61461042a578063715018a6146103d15780638da5cb5b146103a8578063c1807dd0146101c2578063ddfce73f14610191578063f03c10db146101485763f2fde38b146100b657600080fd5b34610143576020366003190112610143576004356001600160a01b03811690819003610143576100e4611590565b801561012d57600080546001600160a01b03198116831782556001600160a01b0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a3005b631e4fbdf760e01b600052600060045260246000fd5b600080fd5b346101435760203660031901126101435760043580600052600460205261017660ff60406000205416611396565b60005260026020526020600660406000200154604051908152f35b34610143576020366003190112610143576004356000526004602052602060ff604060002054166040519015158152f35b34610143576060366003190112610143576004356024358160005260046020526101f360ff60406000205416611396565b8015158061038d575b156103525781600052600360205260406000208160005260205260ff6002604060002001541661030d5760008281526003602081815260408084208585528252808420600280820180546001600160a81b0319163360081b610100600160a81b0316176001179055429482019490945560443560049091015585845291905290206006018054909181156102f7577f420b870d440d7db7ee2ded68bc8813f1328fb588efa2a106f71fc89135e5ba4692602092600019019055604051903390857f26a7a75a6d2c934e9e583b5010b89f0de885ec5aeaedc498534cda7337f4ee42600080a483600052600282526006604060002001548152a2005b634e487b7160e01b600052601160045260246000fd5b60405162461bcd60e51b815260206004820152601860248201527f536c6f7420697320616c7265616479206f6363757069656400000000000000006044820152606490fd5b60405162461bcd60e51b815260206004820152601360248201527224b73b30b634b21039b637ba10373ab6b132b960691b6044820152606490fd5b508160005260026020526005604060002001548111156101fc565b34610143576000366003190112610143576000546040516001600160a01b039091168152602090f35b34610143576000366003190112610143576103ea611590565b600080546001600160a01b0319811682556001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a3005b346101435761043836611380565b81600052600460205261045260ff60406000205416611396565b81600052600360205260406000208160005260205260ff60026040600020015416156105c85781600052600360205260406000208160005260205260018060a01b0360026040600020015460081c16331480156105b4575b156105635760008281526003602081815260408084208585528252808420600281810180546001600160a81b0319169055938101859055600401849055858452918152912060060180547f420b870d440d7db7ee2ded68bc8813f1328fb588efa2a106f71fc89135e5ba469391906105219061143e565b905560405190847f04145c0f85cc2163d3ed67b1f10cff2405681555bcd3d2f7aff90907e7f3764a600080a383600052600282526006604060002001548152a2005b60405162461bcd60e51b815260206004820152602360248201527f4e6f7420617574686f72697a656420746f2072656c65617365207468697320736044820152621b1bdd60ea1b6064820152608490fd5b506000546001600160a01b031633146104aa565b60405162461bcd60e51b815260206004820152601460248201527314db1bdd081a5cc81b9bdd081bd8d8dd5c1a595960621b6044820152606490fd5b34610143576020366003190112610143576004356106206113db565b5080600052600460205261063b60ff60406000205416611396565b60005260026020526106676106536040600020611477565b60405191829160208352602083019061120b565b0390f35b346101435761067936611380565b90600052600360205260406000209060005260205260c0604060002080549060018101549060028101546004600383015492015492604051948552602085015260ff81161515604085015260018060a01b039060081c166060840152608083015260a0820152f35b34610143576101003660031901126101435760043567ffffffffffffffff811161014357610713903690600401611311565b60243567ffffffffffffffff811161014357610733903690600401611311565b60e435919060843567ffffffffffffffff8411610143573660238501121561014357836004013561076381611368565b946107716040519687611104565b8186526024602087019260051b820101903682116101435760248101925b828410610db657505050506107a2611590565b6107ad60015461143e565b938460015584604051916107c0836110e7565b81835260208301868152604084019186835260608501604435815260808601606435815260a0870188815260c088019089825260e089019260a43584526101008a019460c43586526101208b019687526101408b019860018a526101608c0198338a526101808d019b428d52600052600260205260406000209c518d5560018d01905180519067ffffffffffffffff8211610acc5761085f83546110ad565b601f8111610d84575b50602090601f8311600114610d1d5761089a929160009183610b51575b50508160011b916000199060031b1c19161790565b90555b51805160028d019167ffffffffffffffff8211610acc576108be83546110ad565b601f8111610ceb575b50602090601f8311600114610c84576108f8929160009183610b515750508160011b916000199060031b1c19161790565b90555b5160038b01555160048a01555160058901555160068801555160078701555160088601555180516009860191680100000000000000008211610acc578254828455808310610c06575b50602001916000526020600020916000905b828210610ae25750505050600b92916109a991610986600a870192511515839060ff801983541691151516179055565b518154610100600160a81b03191660089190911b610100600160a81b0316179055565b5191015560015b81811115610a2257847fc83d4b361f043aadfcfabb8af19fc5c5447c2672a54a8c69548df59278e0469c610a0f86610a1d878560005260046020526040600020600160ff198254161790556040519384936040855260408501906111ca565b9083820360208501526111ca565b0390a2005b6040519060c082019180831067ffffffffffffffff841117610acc57610ac7926040528681526004602082018381526040830160008152610ab860608501916000835260808601926000845260a0870194600086528d60005260036020526040600020896000526020526040600020975188555160018801556109866002880192511515839060ff801983541691151516179055565b5160038401555191015561143e565b6109b0565b634e487b7160e01b600052604160045260246000fd5b805180519067ffffffffffffffff8211610acc57610b0086546110ad565b601f8111610bc9575b50602090601f8311600114610b5c5792610b4283600195946020948796600092610b515750508160011b916000199060031b1c19161790565b87555b01940191019092610956565b015190503880610885565b90601f1983169187600052816000209260005b818110610bb15750936020936001969387969383889510610b98575b505050811b018755610b45565b015160001960f88460031b161c19169055388080610b8b565b92936020600181928786015181550195019301610b6f565b610bf690876000526020600020601f850160051c81019160208610610bfc575b601f0160051c0190611579565b8e610b09565b9091508190610be9565b8360005282602060002091820191015b818110610c235750610944565b80610c30600192546110ad565b80610c3d575b5001610c16565b601f81118314610c535750600081555b8e610c36565b610c71908260005283601f6020600020920160051c82019101611579565b8060005260006020812081835555610c4d565b90601f1983169184600052816000209260005b818110610cd35750908460019594939210610cba575b505050811b0190556108fb565b015160001960f88460031b161c19169055388080610cad565b92936020600181928786015181550195019301610c97565b610d1790846000526020600020601f850160051c81019160208610610bfc57601f0160051c0190611579565b386108c7565b90601f1983169184600052816000209260005b818110610d6c5750908460019594939210610d53575b505050811b01905561089d565b015160001960f88460031b161c19169055388080610d46565b92936020600181928786015181550195019301610d30565b610db090846000526020600020601f850160051c81019160208610610bfc57601f0160051c0190611579565b38610868565b833567ffffffffffffffff811161014357602091610ddb839260243691870101611311565b81520193019261078f565b3461014357600036600319011261014357600154610e0381611368565b90610e116040519283611104565b808252601f19610e2082611368565b0160005b818110610f2b57505060015b81811115610ea057826040518091602082016020835281518091526040830190602060408260051b8601019301916000905b828210610e7157505050500390f35b91936001919395506020610e908192603f198a8203018652885161120b565b9601920192018594939192610e62565b80600052600460205260ff6040600020541680610f10575b610ecb575b610ec69061143e565b610e30565b8060005260026020526040600020906000198101918183116102f757610ec692610ef7610f0892611477565b610f01828861144d565b528561144d565b509050610ebd565b5080600052600260205260ff600a6040600020015416610eb8565b602090610f366113db565b82828701015201610e24565b34610143576000366003190112610143576020600154604051908152f35b3461014357604036600319011261014357600435602435801515810361014357610fc791610f8c611590565b806000526004602052610fa660ff60406000205416611396565b6000526002602052600a6040600020019060ff801983541691151516179055565b005b3461014357602036600319011261014357600435600052600260205260206040600020805490610ffb60018201611126565b61100760028301611126565b9160038101549260048201546005830154600684015490600785015492611063600887015495611055600b600a8a0154990154996101806040519e8f9e8f90815201526101808d01906111ca565b908b820360408d01526111ca565b60608a0198909852608089015260a088015260c087015260e086015261010085015260ff8116151561012085015260081c6001600160a01b03166101408401526101608301520390f35b90600182811c921680156110dd575b60208310146110c757565b634e487b7160e01b600052602260045260246000fd5b91607f16916110bc565b6101a0810190811067ffffffffffffffff821117610acc57604052565b90601f8019910116810190811067ffffffffffffffff821117610acc57604052565b906040519182600082549261113a846110ad565b80845293600181169081156111a85750600114611161575b5061115f92500383611104565b565b90506000929192526020600020906000915b81831061118c57505090602061115f9282010138611152565b6020919350806001915483858901015201910190918492611173565b90506020925061115f94915060ff191682840152151560051b82010138611152565b919082519283825260005b8481106111f6575050826000602080949584010152601f8019910116010190565b806020809284010151828286010152016111d5565b908151815261124061122e60208401516101a060208501526101a08401906111ca565b604084015183820360408501526111ca565b91606081015160608301526080810151608083015260a081015160a083015260c081015160c083015260e081015160e083015261010081015161010083015261012081015192828103610120840152835180825260208201916020808360051b8301019601926000915b8383106112e457505050610140808401511515908501525050610160808201516001600160a01b0316908301526101809081015191015290565b9091929396602080611302600193601f198682030187528b516111ca565b990193019301919392906112aa565b81601f820112156101435780359067ffffffffffffffff8211610acc5760405192611346601f8401601f191660200185611104565b8284526020838301011161014357816000926020809301838601378301015290565b67ffffffffffffffff8111610acc5760051b60200190565b6040906003190112610143576004359060243590565b1561139d57565b60405162461bcd60e51b815260206004820152601660248201527514dd185d1a5bdb88191bd95cc81b9bdd08195e1a5cdd60521b6044820152606490fd5b604051906113e8826110e7565b60006101808382815260606020820152606060408201528260608201528260808201528260a08201528260c08201528260e082015282610100820152606061012082015282610140820152826101608201520152565b60001981146102f75760010190565b80518210156114615760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b90604051611484816110e7565b80928054825261149660018201611126565b60208301526114a760028201611126565b60408301526003810154606083015260048101546080830152600581015460a0830152600681015460c0830152600781015460e083015260088101546101008301526009810180546114f881611368565b916115066040519384611104565b818352602083019060005260206000206000915b83831061155c5750505050610120830152600a81015460ff8116151561014084015260081c6001600160a01b0316610160830152600b01546101809190910152565b60016020819261156b85611126565b81520192019201919061151a565b818110611584575050565b60008155600101611579565b6000546001600160a01b031633036115a457565b63118cdaa760e01b6000523360045260246000fdfea264697066735822122050adfa9b26301be0df3bab1b5eb0e73d05f55f2df836c85ee12eaa4a7390230864736f6c634300081c0033";

type ChargingStationManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ChargingStationManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ChargingStationManager__factory extends ContractFactory {
  constructor(...args: ChargingStationManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      ChargingStationManager & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): ChargingStationManager__factory {
    return super.connect(runner) as ChargingStationManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ChargingStationManagerInterface {
    return new Interface(_abi) as ChargingStationManagerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ChargingStationManager {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ChargingStationManager;
  }
}
