import fs from 'fs';

const content = fs.readFileSync('dist/index.html', 'utf-8');
console.log('dist/index.html length:', content.length);

const parts = content.split('<script');
console.log('Number of <script tags:', parts.length - 1);

for (let i = 1; i < parts.length; i++) {
  const closeIdx = parts[i].indexOf('</script>');
  console.log(`Script ${i} starts with:`, parts[i].substring(0, 80));
  console.log(`Script ${i} length until </script>:`, closeIdx);
}

const bodyIdx = content.indexOf('<body');
const rootIdx = content.indexOf('<div id="root">');
console.log('<body index:', bodyIdx);
console.log('<div id="root"> index:', rootIdx);
