/**
 * Every user-facing string on the site. Edit copy here, nowhere else.
 */

export const SITE = {
  name: "Konstellation",
  title: "Konstellation — Waitlist",
  description:
    "Konstellation is a blockchain network built for applications that need to move value quickly and cheaply, anywhere in the world. Join the waitlist.",
  chainId: "5667",
  token: "KASH",
} as const;

export const WORDMARK = {
  label: "konstellation",
} as const;

export const JOIN = {
  title: "Join Our Waitlist",
  subtitle: "Be the first in line, be part of greatness",
} as const;

export const FORM = {
  emailLabel: "Email address",
  emailPlaceholder: "Your email address",
  submit: "Join the waitlist",
  submitting: "Joining…",
  alreadyJoined: "You're on the list — check your email to confirm your spot.",
  captchaMissing:
    "Turnstile is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in .env.local.",
  errors: {
    invalidEmail: "Enter a valid email address.",
    captchaMissing: "Complete the check above before joining.",
    captchaExpired: "Verification expired — please try again.",
  },
} as const;

export const TOASTS = {
  network: "Can't reach the server. Check your connection and try again.",
  rateLimited: "Too many attempts. Please wait a minute and try again.",
  server: "Something went wrong on our end. Please try again.",
} as const;

export const WORLD_CHAIN = {
  marker: "02",
  heading: "The New World Chain",
  body: "Built for a world that moves without borders. Konstellation Network brings together fast, scalable infrastructure and an open ecosystem where people, applications and assets move freely.",
} as const;

export const TIMELINE = {
  marker: "03",
  heading: "Where Things Stand",
  shippedLabel: "Shipped",
  nextLabel: "Next",
  items: [
    {
      state: "shipped",
      title: "Core network",
      body: "Running on devnet, with contracts deploying and blocks being produced.",
    },
    {
      state: "next",
      title: "Public testnet",
      body: "Open endpoints and a faucet. Waitlist waves get access first.",
    },
    {
      state: "next",
      title: "Mainnet",
      body: "Following a testnet period and an external audit.",
    },
  ],
} as const;

export const FAQ = {
  marker: "04",
  heading: "Need To Know!",
  items: [
    {
      q: "What is Konstellation?",
      a: "Konstellation is a blockchain network built for applications that need to move value quickly and cheaply, anywhere in the world. KASH is its native token.",
    },
    {
      q: "What do I get by joining the waitlist?",
      a: "You'll be first to hear when access opens, and everyone who answers the three questions after signing up goes into the first access wave.",
    },
    {
      q: "Is there a token?",
      a: "TODO_TOKEN_POLICY",
    },
    {
      q: "Do I need a wallet to sign up?",
      a: "No. Joining takes an email address and nothing else. We never ask for a wallet address or any private key.",
    },
    {
      q: "When does it launch?",
      a: "The network is running on devnet now, with a public testnet next. Waitlist members hear about each milestone first.",
    },
    {
      q: "How is my email used?",
      a: "Only for waitlist updates — a short progress note roughly every two weeks. We don't sell or share it, and every email has an unsubscribe link.",
    },
  ],
} as const;

export const CLOSING = {
  marker: "05",
} as const;

export const HERO = {
  marker: "01",
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
    label: "What Chain Do You Use Today?",
    hint: "Pick any that apply.",
    options: ["Ethereum", "Base", "BNB Chain", "Solana", "Cosmos", "None yet"],
  },
  q3: {
    label: "First Thing You'd Want To Do Here?",
    hint: "Optional",
    placeholder: "Deploy a contract, bridge from Base, run a validator…",
    maxLength: 200,
  },
  submit: "Submit & Get Priority",
  submitting: "Saving…",
  skip: "Skip – Keep My Spot As It Is",
  errors: {
    generic: "Couldn't save your answers. Try again, or skip — your spot is already saved.",
  },
} as const;

export const DONE = {
  title: "You're On The List.",
  sentTo: (email: string) => `Confirmation sent to ${email}.`,
  firstWave: "You're in the first access wave.",
  checkEmail: "Click the link in that email to lock in your spot.",
  cadence: "We'll send a short progress update every two weeks. Nothing else.",
  timedOut:
    "You're on the list. The survey timed out, but you're all set — we'll be in touch.",
  close: "Done",
} as const;

export const VERIFY_NOTICE = {
  expired:
    "That confirmation link has expired. Join again below and we'll send a fresh one.",
  invalid:
    "That confirmation link isn't valid. Join again below and we'll send a new one.",
  dismiss: "Dismiss",
} as const;

export const WELCOME = {
  marker: "01",
  title: "You're Confirmed.",
  body: "Your spot on the Konstellation waitlist is locked in.",
  next: "We'll be in touch when your access wave opens. Until then, expect a short progress update every two weeks.",
} as const;

export const FOOTER = {
  line: `© ${new Date().getFullYear()} Konstellation. Chain ID ${SITE.chainId} · ${SITE.token}`,
} as const;
