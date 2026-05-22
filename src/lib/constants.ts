export const BASEMINER_CONTRACT_ADDRESS =
  "0x0169384a37e8A5967109f0B1c56Ee75c2e9DEC09" as const;

export const BUILDER_CODE_SUFFIX =
  "0x62635f73746f657a6469640b0080218021802180218021802180218021" as const;

export const BASEMINER_ABI = [
  {
    type: "function",
    name: "mine",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "getInventory",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "itemType", type: "uint256" },
          { name: "name", type: "string" },
          { name: "rarity", type: "uint256" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getMyInventory",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "itemType", type: "uint256" },
          { name: "name", type: "string" },
          { name: "rarity", type: "uint256" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "totalMines",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "Mined",
    anonymous: false,
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "itemName", type: "string", indexed: false },
      { name: "rarity", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const ITEM_STYLES: Record<string, { icon: string; tone: string }> = {
  Stone: { icon: "o", tone: "common" },
  Coal: { icon: "*", tone: "common" },
  "Iron Ore": { icon: "Fe", tone: "uncommon" },
  "Silver Ore": { icon: "Ag", tone: "uncommon" },
  "Gold Ore": { icon: "Au", tone: "rare" },
  Diamond: { icon: "<>", tone: "epic" },
  "Mystery Chest": { icon: "?", tone: "legendary" },
  "Ancient Core": { icon: "@", tone: "mythic" },
};
