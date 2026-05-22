# BaseMiner

BaseMiner is a mobile-first Base mini app mining game. Players connect a wallet,
press one primary button, and call the deployed `mine()` contract function to
receive a random onchain collectible such as Stone, Gold Ore, Mystery Chest, or
Ancient Core.

Items are collectibles only. They have no financial value, yield, or token
purchase requirement.

## Stack

- Next.js App Router
- TypeScript
- Wagmi
- Viem
- Base Mainnet

## Attribution

- Offchain: `base:app_id` is hardcoded in `src/app/layout.tsx`.
- Onchain: the builder code suffix is configured in `src/lib/wagmi.ts` and is
  also passed explicitly in the `writeContract` call.

## Development

```bash
npm install
npm run dev
```
