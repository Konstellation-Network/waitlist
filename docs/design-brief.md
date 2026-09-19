# Konstellation Waitlist — Design Brief

## What it is

Konstellation is a new blockchain network that hasn't launched yet. This site is its waiting list: visitors leave an email address to get early access when the network opens. The way the site works is already built; we need a design for it.

**Audience:** developers and experienced crypto users. Technical, sceptical, and tired of hype.

**Feel:** dark, calm, precise. Think Linear, Vercel, Raycast. Please avoid the usual crypto look — no rainbow gradients, glowing orbs, 3D coins or countdown timers.

## The pages

**Main page** — one scrolling page, top to bottom:

1. Wordmark, headline, one-line description, and the email form (email field + "Join the waitlist" button). A small third-party "verify you are human" box from Cloudflare sits with the form; we can't restyle it, only pick light/dark and a size, so please leave room for it.
2. One reassuring line under the form (e.g. *"No spam. One confirmation email, then a short update every two weeks."*), sometimes followed by a count of confirmed signups.
3. Three short blocks explaining what Konstellation is.
4. A timeline of five milestones — two marked "Shipped", three marked "Next".
5. Five expandable FAQ items.
6. The email form again, near the bottom, for people who scrolled all the way.
7. A one-line footer.

**Thank-you page** — shown after someone clicks the confirmation link in their email. Just a success mark, a title, two short lines and the footer.

## The key interaction: what happens after joining

This is the heart of the design. The form goes through three moments, all **in the same spot on the page** — no page change, no pop-up:

1. **Form** — email field and button. The button is disabled until the human check passes. While sending it reads "Joining…".
2. **Three quick questions** — the moment the email is accepted, the form is replaced by a card:
   - "You're in." + "Confirmation sent to [email]"
   - A highlighted line: *"Answer three quick questions and you'll be in the first access wave."* with a note that it's optional.
   - Q1, pick one of four: Building an app / Using apps & trading / Running a node / Just curious
   - Q2, pick any of six pills: Ethereum / Base / BNB Chain / Solana / A Cosmos chain / None yet
   - Q3, an optional short text box (200 characters, with a counter)
   - A main button **"Submit & get priority"** (enabled once Q1 is answered) and a plain **"Skip"** link. Both lead to the done card.
3. **Done** — "You're on the list." plus a line telling them to check their inbox for the confirmation link and that updates come every two weeks.

When the visitor joins from one of the two forms, the other one collapses to a single line: *"You're on the list — check your email to confirm."*

A few things that can go wrong (an invalid or throwaway email, the human check failing, too many sign-ups from one network, no connection) currently show a brief pop-up message. Designing these as a small message under the field instead is fine too.

## Rules

- **No links anywhere.** No menu, no footer links, no social icons. The wordmark isn't clickable. Joining the list is the only action on the page.
- **Email only.** Never add a wallet-address field.
- **No queue numbers, referral links or leaderboards** — they don't exist.
- **Skipping the questions must be obviously allowed.** The Skip link needs to be as easy to find as the button, and the wording should never guilt anyone.
- **Dark theme is required**; a light theme is a bonus.
- All the site's wording is fixed and lives in one file we can share. Use it as-is; if you'd like to change a line, suggest it separately.

## What we'd like back

- Figma mockups of the main page (with the form in each of its three moments), the thank-you page, and one example error message.
- The components used, with their hover / focus / disabled / selected looks.
- Your colours, type sizes and spacing as a simple list, so our developer can map them to code.

## Questions for us

- Is there a logo, brand colour or typeface we must use? (Currently a text-only wordmark, the Geist typeface, and neutral dark greys with a soft blue accent.)
- Do you want a light theme?
- Error messages: under the field, or as pop-ups?
