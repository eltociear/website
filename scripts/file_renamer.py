#!/usr/bin/env python3
"""
File Renaming Script for Global Governance Framework Project
Converts files from current naming to zero-padded, consistent format

Usage:
  This script standardizes filenames in the format: [number]-[text]-by-[ainame].md
  to zero-padded format: [2-digit-number]-[ainame]-[action].md

  Basic usage:
    ./file_renamer.py [directory] [--execute]
    
  Options:
    directory    Path to directory containing files (default: current directory)
    --execute    Actually rename files (default is dry run)
    
  Examples:
    # Dry run (show what would be changed)
    ./file_renamer.py ./documents
    
    # Actually rename files
    ./file_renamer.py ./documents --execute
    
  File pattern examples:
    Before: 1-initial-ideas-by-claude.md
    After:  01-claude-ideation.md
    
    Before: 12-feedback-by-gpt4.md
    After:  12-gpt4-feedback.md
"""

import os
import re
import sys
from pathlib import Path

def extract_file_info(filename):
    """Extract sequence number, AI name, and action from filename."""
    # Remove .md extension
    name = filename.replace('.md', '')
    
    # Pattern to match: number-text-by-ainame
    pattern = r'^(\d+)-(.+)-by-(.+)$'
    match = re.match(pattern, name)
    
    if match:
        sequence = int(match.group(1))
        action_text = match.group(2)
        ai_name = match.group(3)
        
        # Normalize AI names to lowercase
        ai_name_normalized = ai_name.lower()
        
        # Map action text to standardized actions
        action_mapping = {
            'initial-ideas': 'ideation',
            'initial-outline': 'outline',
            'review': 'review',
            'revision': 'revision',
            'comment': 'comment',
            'feedback': 'feedback',
            'analysis': 'analysis',
            'critique': 'critique',
            'refinement': 'refinement'
        }
        
        # Find the best match for action
        action = action_mapping.get(action_text, action_text.replace('-', '_'))
        
        return sequence, ai_name_normalized, action
    
    return None, None, None

def generate_new_filename(sequence, ai_name, action):
    """Generate new filename with zero-padding."""
    # Use 2-digit padding (can be changed to 3 if you expect >99 files)
    padded_sequence = f"{sequence:02d}"
    return f"{padded_sequence}-{ai_name}-{action}.md"

def rename_files(directory_path='.', dry_run=True):
    """Rename files in the specified directory."""
    directory = Path(directory_path)
    
    if not directory.exists():
        print(f"Directory '{directory_path}' does not exist.")
        return
    
    # Find all .md files that match the pattern
    md_files = [f for f in directory.glob('*.md') if f.is_file()]
    
    if not md_files:
        print("No .md files found in the directory.")
        return
    
    rename_operations = []
    
    for file_path in md_files:
        filename = file_path.name
        sequence, ai_name, action = extract_file_info(filename)
        
        if sequence is not None:
            new_filename = generate_new_filename(sequence, ai_name, action)
            new_path = directory / new_filename
            
            if filename != new_filename:
                rename_operations.append((file_path, new_path, filename, new_filename))
        else:
            print(f"Skipping '{filename}' - doesn't match expected pattern")
    
    if not rename_operations:
        print("No files need renaming.")
        return
    
    # Sort operations by sequence number for cleaner output
    rename_operations.sort(key=lambda x: extract_file_info(x[2])[0])
    
    print(f"{'DRY RUN - ' if dry_run else ''}Found {len(rename_operations)} files to rename:")
    print("-" * 60)
    
    for old_path, new_path, old_name, new_name in rename_operations:
        print(f"{old_name} → {new_name}")
        
        if not dry_run:
            try:
                old_path.rename(new_path)
                print(f"  ✓ Renamed successfully")
            except Exception as e:
                print(f"  ✗ Error renaming: {e}")
    
    if dry_run:
        print("\nThis was a dry run. Use --execute to actually rename files.")

def main():
    """Main function to handle command line arguments."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Rename Global Governance Framework files with proper zero-padding'
    )
    parser.add_argument(
        'directory', 
        nargs='?', 
        default='.', 
        help='Directory containing files to rename (default: current directory)'
    )
    parser.add_argument(
        '--execute', 
        action='store_true', 
        help='Actually rename files (default is dry run)'
    )
    
    args = parser.parse_args()
    
    dry_run = not args.execute
    
    print("Global Governance Framework File Renamer")
    print("=" * 40)
    print(f"Directory: {os.path.abspath(args.directory)}")
    print(f"Mode: {'DRY RUN' if dry_run else 'EXECUTE'}")
    print()
    
    rename_files(args.directory, dry_run)

if __name__ == "__main__":
    main()
