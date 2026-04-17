#!/usr/bin/env python3
"""
CSS Refactoring Script
Splits monolithic style.css into modular, maintainable files
Following ITCSS (Inverted Triangle CSS) architecture
"""

import re
import os

# Read the original CSS file
with open('style.css', 'r') as f:
    css_content = f.read()

# Define section markers and their target files
sections = {
    # Navigation component
    'navigation.css': {
        'start': '/* Navigation */',
        'end': '/* Hero Section */',
        'path': 'components/navigation.css'
    },
    # Hero page
    'hero.css': {
        'start': '/* Hero Section */',
        'end': '/* About Section */',
        'path': 'pages/hero.css'
    },
    # About page
    'about.css': {
        'start': '/* About Section */',
        'end': '/* Skills Section */',
        'path': 'pages/about.css'
    },
    # Skills page
    'skills.css': {
        'start': '/* Skills Section */',
        'end': '/* Achievements Section */',
        'path': 'pages/skills.css'
    },
    # Achievements page
    'achievements.css': {
        'start': '/* Achievements Section */',
        'end': '/* Projects Section */',
        'path': 'pages/achievements.css'
    },
    # Projects page
    'projects.css': {
        'start': '/* Projects Section */',
        'end': '/* Experience Section */',
        'path': 'pages/projects.css'
    },
    # Experience page
    'experience.css': {
        'start': '/* Experience Section */',
        'end': '/* Resume Section */',
        'path': 'pages/experience.css'
    },
    # Resume page
    'resume.css': {
        'start': '/* Resume Section */',
        'end': '/* Contact Section */',
        'path': 'pages/resume.css'
    },
    # Contact page
    'contact.css': {
        'start': '/* Contact Section */',
        'end': '/* Footer */',
        'path': 'pages/contact.css'
    },
    # Footer layout
    'footer.css': {
        'start': '/* Footer */',
        'end': '/* Achievement Modal */',
        'path': 'layout/footer.css'
    },
    # Modals component
    'modals.css': {
        'start': '/* Achievement Modal */',
        'end': '/* Responsive Design */',
        'path': 'components/modals.css'
    },
    # Responsive utilities
    'responsive.css': {
        'start': '/* Responsive Design */',
        'end': None,  # Goes to end of file
        'path': 'utilities/responsive.css'
    }
}

def extract_section(content, start_marker, end_marker=None):
    """Extract a section of CSS between two markers"""
    start_idx = content.find(start_marker)
    if start_idx == -1:
        return None
    
    if end_marker:
        end_idx = content.find(end_marker, start_idx)
        if end_idx == -1:
            return content[start_idx:]
        return content[start_idx:end_idx]
    else:
        return content[start_idx:]

def write_section(path, content, header):
    """Write CSS section to file with proper header"""
    full_content = f"""/**
 * {header}
 * Auto-generated from style.css refactoring
 */

{content.strip()}
"""
    with open(path, 'w') as f:
        f.write(full_content)
    print(f"✓ Created {path}")

# Process each section
for name, config in sections.items():
    section_content = extract_section(
        css_content,
        config['start'],
        config['end']
    )
    
    if section_content:
        # Remove the start marker from content
        section_content = section_content.replace(config['start'], '').strip()
        
        # Create header from filename
        header = name.replace('.css', '').replace('-', ' ').title()
        
        # Write to target file
        write_section(config['path'], section_content, header)

print("\n✅ CSS refactoring complete!")
print("📁 All files created in modular structure")
print("🔧 Update index.html to use css/main.css")
