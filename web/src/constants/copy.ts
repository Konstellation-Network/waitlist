/**
 * Every user-facing string on the site. Edit copy here, nowhere else.
 */

export const SITE = {
  name: "Konstellation",
  title: "Konstellation — Waitlist",
  description:
    "Early access to Konstellation, an EVM-compatible Layer 1 built on the Cosmos SDK.",
  chainId: "5667",
  token: "KASH",
} as const;

export const HERO = {
  eyebrow: "Pre-launch waitlist",
  headline: "An EVM chain with Cosmos underneath.",
  subhead:
    "Konstellation is an EVM-compatible Layer 1 built on the Cosmos SDK. Join the list for first access.",
} as const;

export const FORM = {
  emailLabel: "Email address",
  emailPlaceholder: "you@example.com",
  submit: "Join the waitlist",
  submitting: "Joining…",
  trustLine: "No spam. One confirmation email, then a short update every two weeks.",
  captchaMissing:
    "Turnstile is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in .env.local.",
  captchaWaiting: "Complete the check above to continue.",
  errors: {
    invalidEmail: "Enter a valid email address.",
    captcha: "The verification check failed. Please try again.",
    network: "Couldn't reach the server. Check your connection and try again.",
    generic: "Something went wrong. Please try again.",
  },
} as const;

export const SURVEY = {
  title: "You're in.",
  sentTo: "Confirmation sent to",
  pitch:
    "Answer three quick questions and you'll be in the first access wave.",
  optionalNote: "Optional — you're on the list either way.",
  q1: {
    label: "What brings you to Konstellation?",
    options: [
      { value: "building", label: "Building an app" },
      { value: "using", label: "Using apps & trading" },
      { value: "node", label: "Running a node" },
      { value: "curious", label: "Just curious" },
    ],
  },
  q2: {
    label: "Which chains do you use today?",
    hint: "Pick any that apply.",
    options: [
      "Ethereum",
      "Base",
      "BNB Chain",
      "Solana",
      "A Cosmos chain",
      "None yet",
    ],
  },
  q3: {
    label: "First thing you'd want to do here?",
    hint: "Optional",
    placeholder: "Deploy a contract, bridge from Base, run a validator…",
    maxLength: 200,
  },
  submit: "Submit & get priority",
  submitting: "Saving…",
  skip: "Skip — keep my spot as is",
  errors: {
    expired: "That took a while and the session expired — you're still on the list.",
    generic: "Couldn't save your answers. You're still on the list.",
  },
} as const;

export const DONE = {
  title: "You're on the list.",
  withSurvey: "Thanks — you're queued for the first access wave.",
  withoutSurvey: "Your spot is saved.",
  checkEmail:
    "Check your inbox and click the confirmation link to lock in your spot.",
  cadence: "We'll send a short progress update every two weeks. Nothing else.",
} as const;

export const SECONDARY_FORM = {
  title: "Get first access.",
  subhead: "Join the list and we'll tell you when your wave opens.",
  alreadyJoined: "You're on the list — check your email to confirm.",
} as const;

export const VERIFY_NOTICE = {
  expired: {
    title: "That link has expired.",
    body: "Confirmation links last 48 hours. Enter your email again and we'll send a fresh one.",
  },
  invalid: {
    title: "That link isn't valid.",
    body: "It may have already been used. If you haven't confirmed yet, sign up again below.",
  },
  dismiss: "Dismiss",
} as const;

export const STATS = {
  label: "confirmed on the list",
} as const;

export const ABOUT = {
  heading: "What Konstellation is",
  blocks: [
    {
      title: "EVM-compatible",
      body: "Deploy Solidity contracts with the tooling you already use — Hardhat, Foundry, MetaMask. No rewrites.",
    },
    {
      title: "Cosmos SDK underneath",
      body: "Fast finality, native IBC interoperability, and a sovereign validator set instead of a rollup sequencer.",
    },
    {
      title: "One network, one token",
      body: `KASH is the native gas and staking asset. Chain ID ${SITE.chainId}.`,
    },
  ],
} as const;

export const TIMELINE = {
  heading: "Where things stand",
  shippedLabel: "Shipped",
  nextLabel: "Next",
  items: [
    { state: "shipped", title: "Core chain", body: "Cosmos SDK base with the EVM module and JSON-RPC." },
    { state: "shipped", title: "Internal devnet", body: "Running continuously; contracts deploy with unmodified Ethereum tooling." },
    { state: "next", title: "Public testnet", body: "Faucet, explorer, and public RPC. Waitlist waves get access first." },
    { state: "next", title: "Validator onboarding", body: "Docs and genesis coordination for node operators." },
    { state: "next", title: "Mainnet", body: "Following a testnet period and external audit." },
  ],
} as const;

export const FAQ = {
  heading: "Questions",
  items: [
    {
      q: "What do I get by joining the waitlist?",
      a: "First access when the network opens, and a short progress update every two weeks. Completing the three-question survey after signup puts you in the first access wave.",
    },
    {
      q: "Is there a token?",
      a: "TODO_TOKEN_POLICY",
    },
    {
      q: "Do I need a wallet to sign up?",
      a: "No. Only an email address. We will never ask for a wallet address as part of the waitlist.",
    },
    {
      q: "Does it work with my existing Ethereum tools?",
      a: `Yes. Konstellation exposes standard Ethereum JSON-RPC, so Hardhat, Foundry, ethers, viem and browser wallets work as-is. Use chain ID ${SITE.chainId}.`,
    },
    {
      q: "How is my email used?",
      a: "Only for the confirmation email, the bi-weekly update, and your access invite. You can unsubscribe from any email.",
    },
  ],
} as const;

export const WELCOME = {
  title: "You're confirmed.",
  body: "Your email is verified and your spot on the Konstellation waitlist is locked in.",
  next: "Next: a short progress update every two weeks, and an access email when your wave opens.",
} as const;

export const FOOTER = {
  line: `© ${new Date().getFullYear()} Konstellation. Chain ID ${SITE.chainId} · ${SITE.token}`,
} as const;
