#!/usr/bin/env python3
import os
import re

def update_index():
    # Directory is the current directory
    dir_path = os.path.dirname(os.path.abspath(__file__))
    
    # Get all .html files except index.html
    html_files = [f for f in os.listdir(dir_path) if f.endswith('.html') and f != 'index.html']
    
    # Sort alphabetically
    html_files.sort()
    
    # Generate titles: remove .html and replace - with space
    links = []
    for f in html_files:
        title = f[:-5]  # remove .html
        title = re.sub(r'-', ' ', title)  # replace - with space
        links.append(f'<li><a href="{f}">{title}</a></li>')
    
    # Generate ul content
    ul_content = '    <ul>\n' + '\n'.join(f'      {link}' for link in links) + '\n    </ul>'
    
    # Read index.html
    index_path = os.path.join(dir_path, 'index.html')
    with open(index_path, 'r') as f:
        content = f.read()
    
    # Replace the ul block
    # Find the ul block
    ul_pattern = r'    <ul>.*?</ul>'
    new_content = re.sub(ul_pattern, ul_content, content, flags=re.DOTALL)
    
    # Write back
    with open(index_path, 'w') as f:
        f.write(new_content)
    
    print("Index updated with current HTML files.")

if __name__ == '__main__':
    update_index()
