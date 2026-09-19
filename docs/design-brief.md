# Konstellation Waitlist — Design Brief

This is everything you need to redesign the Konstellation waitlist website. The way the site *works* is already built and is fixed. How it *looks* is completely open — that's what we need from you.

Whenever a word in here is unfamiliar, there is a short glossary at the end.

---

## 1. What this is

**Konstellation** is a new blockchain network. It is not launched yet. This website is its waiting list: people leave their email address to get early access when the network opens.

The whole site is **one scrolling page** plus **one small thank-you page**. There is no login, no account, no dashboard. A visitor arrives, types their email, answers three optional questions, and leaves. Later they click a link in an email to confirm their address and see the thank-you page.

**Who visits:** software developers, people who run server infrastructure, and experienced crypto users. They are technical, sceptical, and tired of flashy crypto marketing. They trust things that look calm and precise.

**How it should feel:** dark, quiet, confident, well-engineered. Reference points: **Linear**, **Vercel**, **Raycast**, **Stripe's developer pages**. Please avoid the typical crypto look: no rainbow gradients, no glowing orbs or blobs, no 3D coins, no countdown timers, no "hurry, limited spots".

---

## 2. Rules that cannot change

These come from product and legal decisions. Please design within them.

1. **Phones first.** Design the phone layout first (375 px wide), then tablet and desktop. On a phone, the top of the page — headline, one line of description, the email box, the button, and the small security check box — must all be visible **without scrolling** on a typical phone screen (375 × 667).
2. **No links anywhere.** No menu, no footer links, no "Docs", no Twitter/Discord icons, no external links of any kind. The logo/wordmark is not clickable either. The only thing a visitor can do on this page is join the list.
3. **Email only.** The form asks for an email address and nothing else. Never add a "wallet address" field, even as optional.
4. **No numbers about the queue.** Do not show a queue position ("You're #1,204"), a referral link, an invite-a-friend feature, or a leaderboard. None of these exist.
5. **The three questions must clearly be optional.** After joining, the visitor sees three quick questions. Answering gets them earlier access, but skipping is always allowed and they stay on the list either way. The "Skip" option must be easy to see and obviously clickable. No tricks: no greyed-out skip, no guilt-trip wording ("No thanks, I don't want early access").
6. **The questions appear instantly, in the same spot the form was.** The moment a visitor submits their email, the form is replaced by the questions card — same place on the page, no page change, no pop-up, no loading screen. This instant hand-off is the heart of the design. A subtle fade or rise is fine; anything slow is not.
7. **The security check box is a third-party widget we cannot restyle.** It's a small box from Cloudflare that says "Verify you are human" (similar to a captcha). We can only choose light or dark and one of three sizes: a fixed 300 × 65 px box, a full-width box 65 px tall, or a compact 150 × 140 px square. Please leave room for it near the email field; it can take a second to appear, so the space should not jump when it does.
8. **Dark theme is required.** A light theme is optional — tell us if you're including one.
9. **Accessible by default.** Readable contrast, buttons big enough to tap on a phone (at least 44 px tall), a visible outline when navigating with a keyboard, and no animation that would bother someone who has turned off motion in their phone settings.
10. **Design with the real words.** All the text on the site is listed in section 6. Use it as-is in your mockups. If you think a line should be rewritten, please suggest it separately rather than changing it silently.

---

## 3. The pages

### 3.1 The main page (one long scrolling page)

From top to bottom:

1. **Top / hero** — wordmark, a small label ("Pre-launch waitlist"), the headline, one line of description, the email form with its button, and the security check box.
2. **Trust line** — one small reassuring sentence under the form. Sometimes it is followed by a count of how many people have confirmed (for example "1,204 confirmed on the list"). The count only shows once at least 50 people have confirmed, so please design the line **both with and without** the number.
3. **What Konstellation is** — three short blocks, each a title and two sentences.
4. **Where things stand** — a short timeline of five milestones. Two are marked "Shipped" (done), three are marked "Next" (upcoming). They need to look clearly different.
5. **Questions** — five frequently-asked questions that expand and collapse when tapped. One answer isn't written yet; assume two to four sentences.
6. **Second chance to join** — the email form again, near the bottom, with its own short heading, for people who scrolled all the way down.
7. **Footer** — one line of small text. No links.

### 3.2 The thank-you page

Shown after a visitor clicks the confirmation link in their email. It contains only: a success mark, a title, two short sentences, and the footer. No form, no links. It should feel like a calm full stop, not another landing page.

### 3.3 Things that are *not* part of this project

- The emails themselves (they are plain text on purpose).
- Any admin or internal screens (there are none).

---

## 4. The email form and what happens after — the important part

The form goes through **three moments**, all in the same spot on the page:

> **1. Form** → visitor submits email → **2. Three questions** → visitor answers or skips → **3. Done**

The form exists in two places (top of page and near the bottom). When a visitor submits from one of them, that one turns into the questions card; the other one shrinks to a single quiet line: *"You're on the list — check your email to confirm."*

### Moment 1 — The form

- An email field (placeholder text: *you@example.com*) and a button: **Join the waitlist**.
- The security check box sits next to or under the field. **The button stays disabled until the visitor has passed the security check**, so please design a clear "not yet" look for the button. If they try to submit early, a small helper line appears: *Complete the check above to continue.*
- While sending: the button reads **Joining…** and both the field and button look inactive.
- If something goes wrong, a short message pops up briefly (a "toast" — a small notification, usually at the top of the screen, that disappears on its own). The possible messages are listed in section 6.2. *(You may propose showing the message under the field instead of as a toast — either works for us.)*

### Moment 2 — The three questions (replaces the form instantly)

What the card contains, top to bottom:

1. Title: **You're in.**
2. *Confirmation sent to* **[the visitor's email]**
3. A highlighted box that sells the questions: *"Answer three quick questions and you'll be in the first access wave."* with a smaller line: *"Optional — you're on the list either way."*
4. **Question 1 — pick one** (this one is required to press Submit):
   *What brings you to Konstellation?* — four tappable choices: **Building an app** · **Using apps & trading** · **Running a node** · **Just curious**
5. **Question 2 — pick any number, or none:**
   *Which chains do you use today?* (hint: *Pick any that apply.*) — six small pill-shaped toggles: **Ethereum** · **Base** · **BNB Chain** · **Solana** · **A Cosmos chain** · **None yet**
6. **Question 3 — optional free text, 200 characters max**, with a live counter like *0/200*:
   *First thing you'd want to do here?* (hint: *Optional*) — placeholder: *Deploy a contract, bridge from Base, run a validator…*
7. Two actions: a main button **Submit & get priority** (disabled until Question 1 is answered; reads **Saving…** while sending) and a plain text link **Skip — keep my spot as is**. Both lead to Moment 3. The Skip link must be just as easy to find as the button.

Please design: the button's disabled / ready / sending looks; a choice that is unselected / hovered / selected; a pill that is off / on; the text box when focused; the counter when close to the limit.

Two things that can go wrong here:
- The visitor took more than 30 minutes and their session timed out → a toast says *"That took a while and the session expired — you're still on the list."* and the card moves to Moment 3 (the "skipped" version).
- Any other problem → a toast says *"Couldn't save your answers. You're still on the list."* and the card stays put so they can try again.

### Moment 3 — Done

Two slightly different versions, depending on whether they answered or skipped:

- Title: **You're on the list.**
- Then either *"Thanks — you're queued for the first access wave."* (answered) or *"Your spot is saved."* (skipped)
- *"Check your inbox and click the confirmation link to lock in your spot."*
- *"We'll send a short progress update every two weeks. Nothing else."*

Important: at this point their email is **not confirmed yet** — that happens when they click the link. So the design should say "you're on the list", not "you're confirmed".

---

## 5. Every situation the design needs to cover

Think of these as the frames we need to see.

**Main page**
- Normal view (form in Moment 1)
- Form in Moment 2 (questions), including the bottom form shrunk to one line
- Form in Moment 3, both versions (answered / skipped)
- A notice at the top when the visitor came back from an **expired** confirmation link (links stop working after 48 hours). It sits just above the form and can be dismissed with an × button. Wording in 6.6.
- The same notice for a confirmation link that is **not valid** (already used, or mistyped).
- An error toast, for reference.
- Trust line with and without the confirmed-count.

**Thank-you page**
- One view.

**What can go wrong when joining** (each shows as a short message; wording in 6.2):
- The email address isn't valid.
- The email is from a throwaway/disposable email service (we reject those).
- The security check didn't pass.
- Too many sign-ups from the same network in one hour (we cap it at five).
- No internet connection.
- Something unexpected on our side.

After any of these, the security check box resets and the visitor has to pass it again before retrying.

---

## 6. All the words on the site (use these exactly)

### 6.1 Top of page
- Wordmark: **Konstellation** — small tag next to it: *5667* (the network's ID number; keep it small and technical)
- Browser tab title: *Konstellation — Waitlist*
- Small label: *Pre-launch waitlist*
- Headline: **An EVM chain with Cosmos underneath.**
- Description: *Konstellation is an EVM-compatible Layer 1 built on the Cosmos SDK. Join the list for first access.*

### 6.2 The form
- Field placeholder: *you@example.com*
- Button: **Join the waitlist** → while sending: **Joining…**
- Trust line: *No spam. One confirmation email, then a short update every two weeks.* — optionally followed by *[number] confirmed on the list.*
- Helper when the security check isn't done: *Complete the check above to continue.*
- Error messages:
  - *Enter a valid email address.*
  - *Please enter a valid email address.* (same situation, wording comes from our server)
  - *Disposable email addresses are not accepted. Please use a permanent address.*
  - *Verification failed. Please refresh the page and try again.*
  - *Too many signups from your network. Please try again in an hour.*
  - *Couldn't reach the server. Check your connection and try again.*
  - *Something went wrong. Please try again.*

### 6.3 The three questions
- Title: **You're in.**
- *Confirmation sent to* **[email]**
- Highlight: *Answer three quick questions and you'll be in the first access wave.* / *Optional — you're on the list either way.*
- Q1: *What brings you to Konstellation?* — **Building an app** · **Using apps & trading** · **Running a node** · **Just curious**
- Q2: *Which chains do you use today?* · *Pick any that apply.* — **Ethereum** · **Base** · **BNB Chain** · **Solana** · **A Cosmos chain** · **None yet**
- Q3: *First thing you'd want to do here?* · *Optional* — placeholder: *Deploy a contract, bridge from Base, run a validator…* — counter *0/200*
- Button: **Submit & get priority** → while sending: **Saving…**
- Link: **Skip — keep my spot as is**
- Error messages: *That took a while and the session expired — you're still on the list.* / *Couldn't save your answers. You're still on the list.*

### 6.4 Done
- **You're on the list.**
- *Thanks — you're queued for the first access wave.* **or** *Your spot is saved.*
- *Check your inbox and click the confirmation link to lock in your spot.*
- *We'll send a short progress update every two weeks. Nothing else.*

### 6.5 Second form near the bottom
- Heading: **Get first access.**
- Line: *Join the list and we'll tell you when your wave opens.*
- When already joined from the top form, this whole block becomes one line: *You're on the list — check your email to confirm.*

### 6.6 Notice at the top of the page (after a bad confirmation link)
- Expired — **That link has expired.** *Confirmation links last 48 hours. Enter your email again and we'll send a fresh one.*
- Not valid — **That link isn't valid.** *It may have already been used. If you haven't confirmed yet, sign up again below.*
- The × button is labelled *Dismiss* for screen readers.

### 6.7 What Konstellation is
- Heading: **What Konstellation is**
- **EVM-compatible** — *Write smart contracts in Scriipture (Typescript) that compiles to solidity. And deployed to the Konstellation network.* *(this line is still being edited by us — design for two sentences of similar length)*
- **Cosmos SDK underneath** — *Fast finality, native IBC interoperability, and a sovereign validator set instead of a rollup sequencer.*
- **One network, one token** — *KASH is the native gas and staking asset. Chain ID 5667.*

### 6.8 Where things stand
- Heading: **Where things stand** — badges: *Shipped* / *Next*
- Shipped — **Core chain** — *Cosmos SDK base with the EVM module and JSON-RPC.*
- Shipped — **Internal devnet** — *Running continuously; contracts deploy with unmodified Ethereum tooling.*
- Next — **Public testnet** — *Faucet, explorer, and public RPC. Waitlist waves get access first.*
- Next — **Validator onboarding** — *Docs and genesis coordination for node operators.*
- Next — **Mainnet** — *Following a testnet period and external audit.*
*(We may still revise these lines; the number of items and the two states will stay the same.)*

### 6.9 Questions
- Heading: **Questions**
1. **What do I get by joining the waitlist?** — *First access when the network opens, and a short progress update every two weeks. Completing the three-question survey after signup puts you in the first access wave.*
2. **Is there a token?** — *(answer not written yet — assume two to four sentences)*
3. **Do I need a wallet to sign up?** — *No. Only an email address. We will never ask for a wallet address as part of the waitlist.*
4. **Does it work with my existing Ethereum tools?** — *Yes. Konstellation exposes standard Ethereum JSON-RPC, so Hardhat, Foundry, ethers, viem and browser wallets work as-is. Use chain ID 5667.*
5. **How is my email used?** — *Only for the confirmation email, the bi-weekly update, and your access invite. You can unsubscribe from any email.*

### 6.10 Thank-you page
- **You're confirmed.**
- *Your email is verified and your spot on the Konstellation waitlist is locked in.*
- *Next: a short progress update every two weeks, and an access email when your wave opens.*

### 6.11 Footer
- *© 2026 Konstellation. Chain ID 5667 · KASH*

---

## 7. The building blocks we need designed

So the design covers everything the page uses:

| Element | Where it appears | Looks we need |
| --- | --- | --- |
| Wordmark with small ID tag | Top of page, thank-you page | one |
| Small label ("Pre-launch waitlist") | Top of page | one |
| Headline, section heading, block title | Everywhere | — |
| Body text, secondary (muted) text, technical (monospace) text | Everywhere | — |
| Email field | Form (two places) | empty, focused, filled, inactive |
| Main button | Form, questions | normal, hover, focused, disabled, sending |
| Text link that acts as a button | Skip, dismiss × | normal, hover, focused |
| Pick-one choice button | Question 1 | unselected, hover, selected |
| Pill toggle | Question 2 | off, hover, on |
| Text box with character counter | Question 3 | empty, focused, near the limit, at the limit |
| Card / panel | Questions, done, bottom form, "what it is" blocks | one |
| Highlight box | Inside the questions card | one |
| Dismissible notice | Top of page, bad-link cases | two wordings |
| Toast (brief pop-up message) | Errors | error style only |
| Space reserved for the security check box | Form (two places) | empty (loading), filled (65 px tall) |
| Expand/collapse question | Questions section | closed, open, hover |
| Timeline item | Where things stand | shipped, next |
| Success mark | Done card, thank-you page | one |
| Footer line | Both pages | one |

---

## 8. What we'd like to receive

1. **Figma file, dark theme**, at phone (375), tablet (768) and desktop (1440) widths, showing:
   - the main page as it first loads
   - the form in each of its three moments (the questions card, and both versions of "done"), with the bottom form shrunk to one line
   - the main page with the "expired link" notice at the top
   - the thank-you page
   - one example toast
2. **A component set** with every look listed in section 7.
3. **Your colours, type sizes, spacing and corner radii written down as a simple list** (e.g. "Background #0A0B0D, Surface #0F1114, Text #E9EAEC…"). Our developer will turn that list into code, so names like *background / surface / border / text / muted text / accent / success / danger* are ideal.
4. Where the security check box goes and which of its three sizes you chose.
5. A note on the transition from the form to the questions card: how long, what kind of movement, and what to do for people who have motion turned off.
6. Optional: light theme; a refined wordmark or favicon.
7. If you suggest wording changes: a separate list of *current → proposed*.

---

## 9. Questions for us — please ask before you start

- Do we have a logo, brand colour or typeface you must use? (Right now: text-only wordmark, the Geist typeface, neutral dark greys with a soft blue accent.)
- Do you want a light theme?
- Error messages: under the field, or as pop-up toasts?
- Should the "confirmed on the list" count be shown at all?
- Final wording for the token question and the "what it is" / timeline lines.

---

## Glossary

- **Blockchain / network** — a shared online ledger run by many computers. Konstellation is one.
- **EVM-compatible** — works with the same developer tools as Ethereum, the most widely used blockchain. It's a selling point for developers.
- **Cosmos SDK** — the toolkit Konstellation is built on. Another selling point; no need to explain it visually.
- **Chain ID 5667** — the network's numeric identifier. Developers recognise it; it's shown as a small technical detail.
- **KASH** — the network's currency.
- **Node / validator** — a computer that helps run the network. "Running a node" is one of the visitor types.
- **Testnet / mainnet** — the practice version of the network and the real one.
- **Security check / Turnstile** — Cloudflare's "prove you're human" box, like a captcha but usually no puzzle.
- **Toast** — a small message that pops up briefly (usually top or bottom of screen) and goes away by itself.
- **First access wave** — the first group of people let in when the network opens. Answering the three questions and confirming your email puts you in it.
