const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'globals.css');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { regex: /background: #ff9ccb;/g, replace: 'background: var(--primary);' },
  { regex: /color: #2b1722;/g, replace: 'color: var(--foreground-dark);' },
  { regex: /border-color: #ff9ccb;/g, replace: 'border-color: var(--primary);' },
  { regex: /rgb\(255 156 203 \/ 0\.3\)/g, replace: 'var(--shadow-glow)' },
  { regex: /rgb\(255 156 203 \/ 0\.48\)/g, replace: 'var(--shadow-glow)' },
  { regex: /rgb\(255 156 203 \/ 0\.32\)/g, replace: 'var(--shadow-glow)' },
  { regex: /rgb\(255 156 203 \/ 0\.72\)/g, replace: 'var(--shadow-glow)' },
  { regex: /rgb\(43 23 34 \/ 0\.08\)/g, replace: 'rgb(0 0 0 / 0.08)' },
  { regex: /rgb\(43 23 34 \/ 1\)/g, replace: 'var(--foreground-dark)' },
  { regex: /scrollbar-color: #ff9ccb/g, replace: 'scrollbar-color: var(--primary)' },
  { regex: /rgb\(255 47 109 \/ 0\.55\)/g, replace: 'var(--primary)' }, // record glow
  { regex: /rgb\(255 47 109 \/ 0\)/g, replace: 'transparent' },
  { regex: /background: #ff2f6d;/g, replace: 'background: var(--primary-text);' },
];

replacements.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('globals.css refactoring complete!');
