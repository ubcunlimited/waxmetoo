import { readFileSync } from 'fs';

const content = readFileSync('client/src/lib/blogPosts.ts', 'utf8');
// Extract slug and title pairs
const matches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"][\s\S]*?title:\s*['"]([^'"]+)['"]/g)];
const noSuffix = matches.filter(m => {
  const title = m[2];
  return !title.match(/[|—–\-]\s*Wax Me Too/i);
});
console.log('Posts WITHOUT brand suffix in title:', noSuffix.length);
noSuffix.forEach(m => console.log('  slug:', m[1], '| title:', m[2]));
