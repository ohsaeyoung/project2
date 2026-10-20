import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const search = 'root';
let pos = 0;
while ((pos = html.indexOf(search, pos)) !== -1) {
  console.log(`Found 'root' at ${pos}: ${html.substring(Math.max(0, pos - 40), Math.min(html.length, pos + 80))}`);
  pos += search.length;
}
