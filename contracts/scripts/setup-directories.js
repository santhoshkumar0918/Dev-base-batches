const fs = require('fs');
const path = require('path');

// Define directory structure
const dirs = [
  'contracts',
  'contracts/interfaces',
  'contracts/libraries',
  'deployments',
  'scripts',
  'test'
];

// Create directories if they don't exist
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
});

// Create a placeholder for deployments
const deploymentsReadme = path.join(__dirname, '..', 'deployments', 'README.md');
if (!fs.existsSync(deploymentsReadme)) {
  fs.writeFileSync(
    deploymentsReadme,
    '# Deployments\n\nThis directory contains deployment artifacts for different networks.\n'
  );
  console.log('Created deployments README.md');
}

console.log('Directory setup complete!');