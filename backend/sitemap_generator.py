from datetime import datetime, date
from typing import List
import xml.etree.ElementTree as ET
from xml.dom import minidom

import os

def generate_xml_sitemap(articles: List[dict], breeds: List[dict], base_url: str = None) -> str:
    """Generate XML sitemap with all pages."""
    if base_url is None:
        base_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    today = date.today().isoformat()
    
    # Add homepage
    url = ET.SubElement(urlset, 'url')
    ET.SubElement(url, 'loc').text = base_url
    ET.SubElement(url, 'lastmod').text = today
    ET.SubElement(url, 'changefreq').text = 'hourly'
    ET.SubElement(url, 'priority').text = '0.9'
    
    # Add articles page
    url = ET.SubElement(urlset, 'url')
    ET.SubElement(url, 'loc').text = f"{base_url}/articles"
    ET.SubElement(url, 'lastmod').text = today
    ET.SubElement(url, 'changefreq').text = 'hourly'
    ET.SubElement(url, 'priority').text = '0.9'
    
    # Add breeds page
    url = ET.SubElement(urlset, 'url')
    ET.SubElement(url, 'loc').text = f"{base_url}/breeds"
    ET.SubElement(url, 'lastmod').text = today
    ET.SubElement(url, 'changefreq').text = 'hourly'
    ET.SubElement(url, 'priority').text = '0.9'
    
    # Add all articles
    for article in articles:
        url = ET.SubElement(urlset, 'url')
        ET.SubElement(url, 'loc').text = f"{base_url}/articles/{article['id']}"
        ET.SubElement(url, 'lastmod').text = today
        ET.SubElement(url, 'changefreq').text = 'hourly'
        ET.SubElement(url, 'priority').text = '0.9'
    
    # Add all breeds
    for breed in breeds:
        url = ET.SubElement(urlset, 'url')
        ET.SubElement(url, 'loc').text = f"{base_url}/breeds/{breed['id']}"
        ET.SubElement(url, 'lastmod').text = today
        ET.SubElement(url, 'changefreq').text = 'hourly'
        ET.SubElement(url, 'priority').text = '0.9'
    
    # Pretty print XML
    rough_string = ET.tostring(urlset, encoding='unicode')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ", encoding="UTF-8").decode('utf-8')

def generate_html_sitemap(articles: List[dict], breeds: List[dict], base_url: str = None) -> str:
    """Generate HTML sitemap for human users."""
    if base_url is None:
        base_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    
    # Group articles by category
    articles_by_category = {}
    for article in articles:
        category = article.get('category', 'other')
        if category not in articles_by_category:
            articles_by_category[category] = []
        articles_by_category[category].append(article)
    
    # Group breeds by species
    dogs = [b for b in breeds if b.get('species') == 'dog']
    cats = [b for b in breeds if b.get('species') == 'cat']
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap - PetsLib</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #fffbf0;
        }}
        h1 {{ color: #d97706; }}
        h2 {{ color: #f59e0b; margin-top: 30px; }}
        .section {{ margin-bottom: 30px; }}
        ul {{ list-style: none; padding: 0; }}
        li {{ margin: 8px 0; }}
        a {{
            color: #d97706;
            text-decoration: none;
            padding: 5px 10px;
            display: inline-block;
            border-radius: 5px;
            transition: background 0.2s;
        }}
        a:hover {{
            background: #fef3c7;
        }}
        .main-links {{ margin: 20px 0; }}
        .main-links a {{
            background: #fef3c7;
            padding: 10px 20px;
            margin-right: 10px;
            font-weight: 600;
        }}
    </style>
</head>
<body>
    <h1>PetsLib Sitemap</h1>
    
    <div class="main-links">
        <a href="{base_url}">Home</a>
        <a href="{base_url}/articles">Articles</a>
        <a href="{base_url}/breeds">Breeds</a>
    </div>
    
    <div class="section">
        <h2>Articles</h2>
'''
    
    for category, cat_articles in sorted(articles_by_category.items()):
        html += f'        <h3 style="color: #f97316; text-transform: capitalize;">{category}</h3>\n'
        html += '        <ul>\n'
        for article in sorted(cat_articles, key=lambda x: x.get('title', '')):
            html += f'            <li><a href="{base_url}/articles/{article["id"]}">{article.get("title", "Untitled")}</a></li>\n'
        html += '        </ul>\n'
    
    html += '''    </div>
    
    <div class="section">
        <h2>Dog Breeds</h2>
        <ul>
'''
    
    for breed in sorted(dogs, key=lambda x: x.get('name', '')):
        html += f'            <li><a href="{base_url}/breeds/{breed["id"]}">{breed.get("name", "Unknown")}</a></li>\n'
    
    html += '''        </ul>
    </div>
    
    <div class="section">
        <h2>Cat Breeds</h2>
        <ul>
'''
    
    for breed in sorted(cats, key=lambda x: x.get('name', '')):
        html += f'            <li><a href="{base_url}/breeds/{breed["id"]}">{breed.get("name", "Unknown")}</a></li>\n'
    
    html += '''        </ul>
    </div>
    
    <p style="margin-top: 50px; text-align: center; color: #9ca3af;">© 2025 PetsLib. All rights reserved.</p>
</body>
</html>
'''
    
    return html
