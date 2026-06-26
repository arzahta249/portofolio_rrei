const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'components', 'portfolio-site.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { regex: /bg-\[#fff7fb\]/g, replace: 'bg-background' },
  { regex: /text-\[#34212b\]/g, replace: 'text-foreground' },
  { regex: /text-\[#2b1722\]/g, replace: 'text-foreground-dark' },
  { regex: /bg-\[#2b1722\]/g, replace: 'bg-foreground-dark' },
  { regex: /text-\[#6f5361\]/g, replace: 'text-muted' },
  { regex: /bg-\[#ff5aa9\]/g, replace: 'bg-primary' },
  { regex: /text-\[#ff5aa9\]/g, replace: 'text-primary' },
  { regex: /hover:bg-\[#e83f92\]/g, replace: 'hover:bg-primary-hover' },
  { regex: /text-\[#d62a7c\]/g, replace: 'text-primary-text' },
  { regex: /text-\[#c52b75\]/g, replace: 'text-primary-dark' },
  { regex: /bg-\[#c52b75\]/g, replace: 'bg-primary-dark' },
  { regex: /border-\[#ffd3e7\]/g, replace: 'border-soft-border' },
  { regex: /border-\[#ffc3de\]/g, replace: 'border-soft-border' },
  { regex: /bg-\[#fff0f7\]/g, replace: 'bg-soft-bg' },
  { regex: /bg-\[#ffd2e8\]/g, replace: 'bg-soft-bg' },
  { regex: /bg-\[#bde9ff\]/g, replace: 'bg-accent' },
  { regex: /border-\[#f3abc9\]/g, replace: 'border-border-main' },
  { regex: /hover:border-\[#ff5aa9\]/g, replace: 'hover:border-primary' },
  { regex: /border-\[#ff9ccb\]/g, replace: 'border-primary' },
  { regex: /shadow-pink-200/g, replace: 'shadow-[color:var(--shadow-glow)]' },
  // Also any stray hex codes in inline styles if any (not heavily used but just in case)
];

replacements.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Refactoring complete!');
