import fs from 'fs';

const content = fs.readFileSync('dist/index.html', 'utf-8');
const scriptStart = content.indexOf('<script');
const scriptEnd = content.indexOf('</script>');
console.log('scriptStart:', scriptStart, 'tag:', content.substring(scriptStart, scriptStart + 50));
console.log('scriptEnd:', scriptEnd);
