"use client";

import {
  ArrowUpRight,
  Coins,
  Copy,
  Gem,
  Hammer,
  Link2,
  LogOut,
  Pickaxe,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import type { Address } from "viem";
import {
  BASEMINER_ABI,
  BASEMINER_CONTRACT_ADDRESS,
  BUILDER_CODE_SUFFIX,
  ITEM_STYLES,
} from "@/lib/constants";

type InventoryItem = {
  itemType: bigint;
  name: string;
  rarity: bigint;
  timestamp: bigint;
};

const formatAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

const getInviteUrl = (address?: Address) => {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  if (address) url.searchParams.set("ref", address);
  return url.toString();
};

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const [localSpark, setLocalSpark] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const { address, chainId, isConnected } = useAccount();
  const {
    connectors,
    connect,
    error: connectError,
    isPending: isConnecting,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const {
    writeContractAsync,
    data: hash,
    isPending: isMining,
    error: mineError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const inventory = useReadContract({
    address: BASEMINER_CONTRACT_ADDRESS,
    abi: BASEMINER_ABI,
    functionName: "getInventory",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const totalMines = useReadContract({
    address: BASEMINER_CONTRACT_ADDRESS,
    abi: BASEMINER_ABI,
    functionName: "totalMines",
  });

  useEffect(() => {
    if (isSuccess) {
      inventory.refetch();
      totalMines.refetch();
    }
  }, [isSuccess, inventory, totalMines]);

  useEffect(() => {
    const shouldAutoConnect =
      typeof window !== "undefined" &&
      !window.localStorage.getItem("baseminer:manual-disconnect") &&
      !isConnected &&
      (navigator.userAgent.includes("Base") ||
        Boolean(window.ethereum?.isCoinbaseWallet));

    const connector = connectors.find(
      (item) =>
        item.type === "injected" &&
        (item.name.toLowerCase().includes("coinbase") ||
          item.name.toLowerCase().includes("injected"))
    );

    if (shouldAutoConnect && connector) {
      connect({ connector, chainId: base.id });
    }
  }, [connect, connectors, isConnected]);

  const items = useMemo(
    () => (inventory.data ?? []) as readonly InventoryItem[],
    [inventory.data]
  );
  const latest = items.at(-1);
  const inviteUrl = getInviteUrl(address);
  const referrer =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("ref")
      : null;

  const stats = useMemo(() => {
    const rareCount = items.filter((item) => Number(item.rarity) >= 3).length;
    const best = items.reduce(
      (highest, item) => Math.max(highest, Number(item.rarity)),
      0
    );
    return { rareCount, best };
  }, [items]);

  const openWallets = () => {
    setShowWallets(true);
  };

  const mine = async () => {
    setActionError("");

    if (!isConnected) {
      setActionMessage("Connect a wallet to start mining.");
      openWallets();
      return;
    }

    try {
      if (chainId && chainId !== base.id) {
        setActionMessage("Requesting Base network switch...");
        await switchChainAsync({ chainId: base.id });
      }

      setActionMessage("Open your wallet and confirm the mine transaction.");
      setLocalSpark(true);
      window.setTimeout(() => setLocalSpark(false), 800);

      const txHash = await writeContractAsync({
        address: BASEMINER_CONTRACT_ADDRESS,
        abi: BASEMINER_ABI,
        functionName: "mine",
        chainId: base.id,
        dataSuffix: BUILDER_CODE_SUFFIX,
      });

      setActionMessage(`Transaction sent: ${formatAddress(txHash)}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The mine transaction failed.";
      setActionError(message);
      setActionMessage("");
    }
  };

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const disconnectWallet = () => {
    window.localStorage.setItem("baseminer:manual-disconnect", "true");
    disconnect();
  };

  const visibleConnectors = connectors.filter(
    (connector, index, list) =>
      list.findIndex((item) => item.name === connector.name) === index
  );

  return (
    <main className="shell">
      <section className="mine-stage" aria-label="BaseMiner mine">
        <div className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <Pickaxe size={18} />
            </span>
            <div>
              <strong>BaseMiner</strong>
              <small>Collectible mining on Base</small>
            </div>
          </div>
          {isConnected ? (
            <button className="icon-button" onClick={disconnectWallet}>
              <LogOut size={17} />
              <span>{formatAddress(address)}</span>
            </button>
          ) : (
            <button className="icon-button" onClick={() => setShowWallets(true)}>
              <Wallet size={17} />
              <span>Connect</span>
            </button>
          )}
        </div>

        <div className="shaft">
          <div className="rope" />
          <div className={`claw ${localSpark ? "claw-drop" : ""}`}>
            <span />
            <span />
          </div>
          <div className="ore-field">
            <span className="ore stone">o</span>
            <span className="ore coal">*</span>
            <span className="ore gold">Au</span>
            <span className="ore diamond">&lt;&gt;</span>
            <span className="ore chest">?</span>
          </div>
        </div>

        <div className="reward-panel">
          <p className="eyebrow">Latest find</p>
          <h1>{latest ? latest.name : "Ready to swing"}</h1>
          <p>
            {latest
              ? `Rarity ${latest.rarity.toString()} collectible secured in your onchain inventory.`
              : "Mine once to reveal Stone, Gold Ore, Mystery Chest, or an ultra-rare Ancient Core."}
          </p>
          <button
            className="mine-button"
            onClick={mine}
            disabled={isMining || isConfirming || isSwitching}
          >
            {isConnected ? <Hammer size={22} /> : <Wallet size={22} />}
            <span>
              {!isConnected
                ? "Connect Wallet"
                : isMining || isConfirming
                  ? "Mining..."
                  : chainId && chainId !== base.id
                    ? "Switch to Base"
                    : "Mine Now"}
            </span>
          </button>
          {actionMessage ? <p className="status">{actionMessage}</p> : null}
          {actionError || mineError ? (
            <p className="error">{actionError || mineError?.message}</p>
          ) : null}
        </div>
      </section>

      <section className="dashboard" aria-label="Mining rewards">
        <div className="stat-grid">
          <div>
            <Coins size={18} />
            <strong>{items.length}</strong>
            <span>Total items</span>
          </div>
          <div>
            <Gem size={18} />
            <strong>{stats.rareCount}</strong>
            <span>Rare finds</span>
          </div>
          <div>
            <Sparkles size={18} />
            <strong>{stats.best}</strong>
            <span>Best rarity</span>
          </div>
        </div>

        <div className="invite-row">
          <div>
            <p className="eyebrow">Invite loop</p>
            <strong>Share your mine</strong>
            <span>
              {referrer
                ? `Arrived through ${formatAddress(referrer)}`
                : "Referral links keep every dig social."}
            </span>
          </div>
          <button onClick={copyInvite} disabled={!address}>
            {copied ? <Sparkles size={17} /> : <Copy size={17} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="inventory-head">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2>Your collectibles</h2>
          </div>
          <a
            href={`https://basescan.org/address/${BASEMINER_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
          >
            <ArrowUpRight size={16} />
            Contract
          </a>
        </div>

        <div className="inventory-grid">
          {items.length ? (
            [...items].reverse().map((item, index) => {
              const style = ITEM_STYLES[item.name] ?? ITEM_STYLES.Stone;
              return (
                <article className={`item-card ${style.tone}`} key={index}>
                  <div className="item-icon">{style.icon}</div>
                  <div>
                    <strong>{item.name}</strong>
                    <span>Rarity {item.rarity.toString()}</span>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-state">
              <Link2 size={22} />
              <strong>No collectibles yet</strong>
              <span>Connect a wallet and make your first swing.</span>
            </div>
          )}
        </div>

        <p className="fine-print">
          Items are onchain collectibles only. They have no financial value,
          yield, or token purchase requirement.
        </p>
        <p className="network-print">
          Network: Base Mainnet | Total mines:{" "}
          {totalMines.data?.toString() ?? "--"}
        </p>
      </section>

      {showWallets ? (
        <div className="modal-backdrop" onClick={() => setShowWallets(false)}>
          <div className="wallet-modal" onClick={(event) => event.stopPropagation()}>
            <div>
              <p className="eyebrow">Choose wallet</p>
              <h2>Connect to BaseMiner</h2>
            </div>
            <div className="wallet-list">
              {visibleConnectors.length ? (
                visibleConnectors.map((connector) => (
                  <button
                    key={connector.uid}
                    disabled={isConnecting}
                    onClick={() => {
                      window.localStorage.removeItem(
                        "baseminer:manual-disconnect"
                      );
                      connect(
                        { connector, chainId: base.id },
                        { onSuccess: () => setShowWallets(false) }
                      );
                    }}
                  >
                    <Wallet size={18} />
                    <span>{connector.name}</span>
                  </button>
                ))
              ) : (
                <p className="wallet-help">
                  No injected wallet was detected. Open BaseMiner inside
                  Coinbase Wallet, MetaMask, OKX, or Base App.
                </p>
              )}
            </div>
            {connectError ? (
              <p className="error">{connectError.message}</p>
            ) : null}
            <button className="ghost-button" onClick={() => setShowWallets(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
