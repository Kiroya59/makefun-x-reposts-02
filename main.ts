// makefun-x-reposts-02 entry (Node 22, standard library only).
//
// The entry is the posts themselves: posts of your own on X, all from one
// public account, each quoting or replying directly to a different one of
// make.fun's newest posts on x.com/makefunai, with make.fun (or @makefunai)
// and your play code in each post's own words. POSTS.json names those posts
// and the house reads their reposts, quotes and likes from X.
//
// All this program has to do is copy POSTS.json from the repository root
// to /output/POSTS.json, where the gate reads it. Nothing this program
// writes about the posts is scored: the score is 2 points for each repost
// and each quote and 1 point for each like of the posts POSTS.json names.
//
// The POSTS.json shipped here holds a placeholder address, so the gate
// refuses it as it stands. Replace it with your own posts' addresses
// (never make.fun's) before you submit; at most 15 posts, one per pool post.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const MAX_POSTS = 15;

const source = join(BOT_DIR, 'POSTS.json');
const target = join(OUTPUT_DIR, 'POSTS.json');

// Read first so a malformed POSTS.json fails loudly instead of copying
// a broken file into /output. The gate refuses more than 15 posts, so
// refuse them here too, with the same shape the gate expects:
// {"posts": ["https://x.com/<handle>/status/<id>", ...]}
const parsed = JSON.parse(readFileSync(source, 'utf8'));
if (!parsed || !Array.isArray(parsed.posts)) {
  console.error('POSTS.json must be an object with a "posts" array');
  process.exit(1);
}
if (parsed.posts.length > MAX_POSTS) {
  console.error(`POSTS.json names ${parsed.posts.length} posts, at most ${MAX_POSTS} allowed`);
  process.exit(1);
}
if (!parsed.posts.every((post) => typeof post === 'string' && post.length > 0)) {
  console.error('POSTS.json "posts" must hold non-empty URL strings');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`POSTS.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
