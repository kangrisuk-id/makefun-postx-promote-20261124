// A working post-x-promote-make-your-own-bounty-01 entry (Node 22, standard library only): it copies POST.json from the
// repository root to /output/POST.json, where the gate reads it. That is all the program has to do. The entry is the
// post itself: one post of your own on X that quotes make.fun's make-your-own-bounty post
// (https://x.com/makefunai/status/2124915864336236646) or links to it, a photo of its own attached, make.fun or the
// @makefunai tag and your play code in its text; POST.json names the post, and the house reads its replies, reposts and
// quotes from X. Nothing this program writes about the post is scored.
//
// The POST.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate reads the post's address out of POST.json, so refuse to hand in
// anything that does not name a real X post: the starter ships a placeholder
// (<handle>/<id>) that must never reach the output folder.
function checkedPostUrl(botDir: string): string {
  const raw = readFileSync(join(botDir, 'POST.json'), 'utf8');
  const url = (JSON.parse(raw) as { url?: unknown }).url;
  if (typeof url !== 'string' || !/^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/.test(url)) {
    throw new Error(`POST.json does not name an X post address: ${String(url)}`);
  }
  return url;
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const url = checkedPostUrl(BOT_DIR);
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
  console.log(`POST.json handed in: ${url}`);
} catch (err) {
  console.error(`POST.json could not be handed in from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
