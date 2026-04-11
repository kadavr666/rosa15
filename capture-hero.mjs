#!/usr/bin/env node
/**
 * Captures the rotating hero animation from a project page and exports as MP4.
 * Usage: node capture-hero.mjs <url> [output.mp4]
 * Example: node capture-hero.mjs http://localhost:4321/project/my-project hero.mp4
 */

import { execSync } from 'child_process';
import { mkdirSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import puppeteer from 'puppeteer';

const url = process.argv[2];
const output = resolve(process.argv[3] || 'hero.mp4');

if (!url) {
    console.error('Usage: node capture-hero.mjs <url> [output.mp4]');
    process.exit(1);
}

const FPS = 30;
const DURATION = 16; // seconds per full rotation
const TOTAL_FRAMES = FPS * DURATION;

const framesDir = join(tmpdir(), `hero-frames-${Date.now()}`);
mkdirSync(framesDir);

console.log(`Opening ${url}…`);

const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
});

const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle0' });
await page.waitForSelector('.hero-card');

// Hide logo and any fixed UI elements, flatten 3D to remove renderer lighting flicker
await page.addStyleTag({ content: `
    .fixed-logo, .mobile-logo, .supporter-logo { display: none !important; }
    .hero-container { perspective: none !important; }
    .hero-card { transform-style: flat !important; }
` });

// Get the bounding box of the hero container
const clip = await page.evaluate(() => {
    const el = document.querySelector('.hero-container');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const pad = 20;
    return {
        x: Math.max(0, r.left - pad),
        y: Math.max(0, r.top - pad),
        width: r.width + pad * 2,
        height: r.height + pad * 2,
    };
});

if (!clip) {
    console.error('Could not find .hero-container on page');
    await browser.close();
    process.exit(1);
}

// Round to even numbers (required by h264)
clip.width = Math.floor(clip.width / 2) * 2;
clip.height = Math.floor(clip.height / 2) * 2;

console.log(`Capturing ${TOTAL_FRAMES} frames at ${FPS}fps (${DURATION}s)…`);
console.log(`Hero area: ${Math.round(clip.width)}×${Math.round(clip.height)}px`);

// Stop CSS animation and control rotation manually, frame by frame
await page.evaluate(() => {
    const card = document.querySelector('.hero-card');
    card.style.animation = 'none';
    card.style.transform = 'rotateY(0deg)';
});

for (let i = 0; i < TOTAL_FRAMES; i++) {
    const angle = (i / TOTAL_FRAMES) * 360;

    await page.evaluate((a) => {
        const card = document.querySelector('.hero-card');
        card.style.transform = `rotateY(${a}deg)`;
    }, angle);

    // Wait for the browser to fully paint the frame
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

    const filename = join(framesDir, `frame-${String(i).padStart(5, '0')}.png`);
    await page.screenshot({ clip, path: filename });

    if (i % 30 === 0) process.stdout.write(`\r  frame ${i}/${TOTAL_FRAMES}`);
}
console.log(`\r  ${TOTAL_FRAMES}/${TOTAL_FRAMES} frames captured`);

await browser.close();

console.log(`Assembling MP4…`);
execSync(
    `/opt/homebrew/bin/ffmpeg -y -framerate ${FPS} -i "${join(framesDir, 'frame-%05d.png')}" ` +
    `-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ` +
    `-c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "${output}"`,
    { stdio: 'inherit' }
);

rmSync(framesDir, { recursive: true });

console.log(`\nDone! Saved to: ${output}`);
