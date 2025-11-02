#!/bin/bash
# Fix console logging in all framework +page.js files

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Adding DEBUG flag to all framework +page.js files...${NC}"

# Find all +page.js files in framework directories
find src/routes/frameworks -name "+page.js" -type f | while read file; do
  # Check if DEBUG_FRAMEWORK_LOADING already exists
  if grep -q "DEBUG_FRAMEWORK_LOADING" "$file"; then
    echo -e "  ⏭️  Skipping $file (already has DEBUG flag)"
    continue
  fi
  
  # Backup
  cp "$file" "$file.backup"
  
  # Add DEBUG flag after the first import block
  # Find the line after "export const csr = true;" and add the DEBUG flag
  sed -i '/export const csr = true;/a\
\
const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging' "$file"
  
  # Replace console.log with conditional logging
  sed -i "s/console\.log(/if (DEBUG_FRAMEWORK_LOADING) console.log(/g" "$file"
  sed -i "s/console\.warn(/if (DEBUG_FRAMEWORK_LOADING) console.warn(/g" "$file"
  # Keep console.error as is for actual errors
  
  echo -e "${GREEN}  ✅ Fixed $file${NC}"
done

echo -e "\n${GREEN}Done! All +page.js files updated.${NC}"
echo -e "${YELLOW}Note: Backups saved as +page.js.backup${NC}"
echo -e "To enable debug logging, set DEBUG_FRAMEWORK_LOADING = true in any file"
