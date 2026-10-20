import fs from 'fs';
import path from 'path';

const distPath = path.resolve('dist', 'index.html');
const rootHtmlPath = path.resolve('index.html');

if (!fs.existsSync(distPath)) {
  console.error('[postbuild] dist/index.html not found!');
  process.exit(1);
}

let content = fs.readFileSync(distPath, 'utf-8');

// ── Step 1: Find the REAL <script> tag in <head> ────────────────────────────
// vite-plugin-singlefile places exactly one <script type="module" crossorigin>
// in <head>. It is ALWAYS the first <script in the file.
// Its closing </script> is the LAST </script> before </body>.

const firstScriptStart = content.indexOf('<script');
if (firstScriptStart === -1) {
  console.error('[postbuild] No <script> tag found!');
  process.exit(1);
}

const bodyCloseIdx = content.lastIndexOf('</body>');
if (bodyCloseIdx === -1) {
  console.error('[postbuild] No </body> tag found!');
  process.exit(1);
}

// The real closing tag of the head script is the last </script> before </body>
const lastScriptClose = content.lastIndexOf('</script>', bodyCloseIdx);
if (lastScriptClose === -1 || lastScriptClose < firstScriptStart) {
  console.error('[postbuild] Could not locate closing </script>!');
  process.exit(1);
}

const SCRIPT_CLOSE_LEN = '</script>'.length;

// ── Step 2: Extract the full script block ───────────────────────────────────
let scriptBlock = content.substring(firstScriptStart, lastScriptClose + SCRIPT_CLOSE_LEN);

// Remove type="module" and crossorigin attributes so it runs in file:// context
scriptBlock = scriptBlock.replace(/\s*type="module"/g, '');
scriptBlock = scriptBlock.replace(/\s*crossorigin/g, '');

// ── Step 3: Remove the script block from its current position (head) ────────
content =
  content.substring(0, firstScriptStart) +
  content.substring(lastScriptClose + SCRIPT_CLOSE_LEN);

// ── Step 4: Insert script AFTER <div id="root"></div>, before </body> ───────
const rootDivTag = '<div id="root"></div>';
const rootDivIdx = content.indexOf(rootDivTag);

if (rootDivIdx === -1) {
  console.error('[postbuild] <div id="root"></div> not found!');
  process.exit(1);
}

const insertAfter = rootDivIdx + rootDivTag.length;
content =
  content.substring(0, insertAfter) +
  '\n    ' + scriptBlock + '\n' +
  content.substring(insertAfter);

// ── Step 5: Persist ─────────────────────────────────────────────────────────
fs.writeFileSync(distPath, content, 'utf-8');
fs.writeFileSync(rootHtmlPath, content, 'utf-8');

const kb = Math.round(content.length / 1024);
console.log(`[postbuild] Done! index.html → ${kb} KB`);
console.log('[postbuild] Script block moved after <div id="root"> and type="module" removed.');
console.log('[postbuild] Files written: dist/index.html, index.html');
