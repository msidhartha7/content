#!/usr/bin/env python3
"""
build_journal.py — Regenerates journal.html from daily-logs/*.md
Run from the project root: python3 build_journal.py
"""

import os
import re
from datetime import datetime
from pathlib import Path

LOGS_DIR = Path(__file__).parent / "daily-logs"
OUTPUT = Path(__file__).parent / "journal.html"

MONTH_NAMES = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]


def date_label(date_str: str) -> str:
    """'2026-04-12' → 'April 12, 2026'"""
    y, m, d = date_str.split("-")
    return f"{MONTH_NAMES[int(m)]} {int(d)}, {y}"


def escape_backtick(text: str) -> str:
    """Escape backticks inside a JS template literal."""
    return text.replace("`", "\\`").replace("${", "\\${")


def load_entries() -> list[dict]:
    """Read all markdown logs, return list sorted newest-first."""
    entries = []
    for path in sorted(LOGS_DIR.glob("*.md"), reverse=True):
        stem = path.stem  # e.g. '2026-04-12'
        if not re.match(r"\d{4}-\d{2}-\d{2}", stem):
            continue
        content = path.read_text(encoding="utf-8")
        entries.append({
            "date": stem,
            "label": date_label(stem),
            "content": escape_backtick(content),
        })
    return entries


def build_entries_js(entries: list[dict]) -> str:
    parts = []
    for e in entries:
        parts.append(
            f'      {{\n'
            f'        date: "{e["date"]}",\n'
            f'        label: "{e["label"]}",\n'
            f'        content: `{e["content"]}`\n'
            f'      }}'
        )
    return "[\n" + ",\n".join(parts) + "\n    ]"


def render(entries: list[dict]) -> str:
    count = len(entries)
    footer_text = f"{count} {'entry' if count == 1 else 'entries'}"
    entries_js = build_entries_js(entries)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Startup Journal</title>
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

    :root {{
      --bg: #fafaf9;
      --surface: #ffffff;
      --border: #e8e6e1;
      --text-primary: #1a1917;
      --text-secondary: #6b6860;
      --text-muted: #a09d96;
      --accent: #2563eb;
      --journal-accent: #7c3aed;
    }}

    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      min-height: 100vh;
      padding: 60px 20px 100px;
    }}

    .page {{ max-width: 720px; margin: 0 auto; }}

    .back-link {{
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.82rem; color: var(--text-muted); text-decoration: none;
      margin-bottom: 40px; transition: color 0.12s;
    }}
    .back-link:hover {{ color: var(--accent); }}

    .header {{ margin-bottom: 48px; }}
    .header-eyebrow {{
      font-size: 0.75rem; font-weight: 500; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--journal-accent); margin-bottom: 12px;
    }}
    .header h1 {{
      font-size: 2rem; font-weight: 700; letter-spacing: -0.02em;
      color: var(--text-primary); line-height: 1.2; margin-bottom: 12px;
    }}
    .header p {{ font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; }}

    .entry-list {{ display: flex; flex-direction: column; gap: 4px; }}

    .entry {{
      border: 1px solid var(--border); border-radius: 8px;
      overflow: hidden; background: var(--surface);
    }}

    .entry-header {{
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; cursor: pointer; user-select: none; gap: 12px;
    }}
    .entry-header:hover .entry-date {{ color: var(--accent); }}

    .entry-left {{ display: flex; align-items: center; gap: 12px; }}

    .entry-dot {{
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--journal-accent); flex-shrink: 0;
    }}

    .entry-date {{
      font-size: 0.95rem; font-weight: 500;
      color: var(--text-primary); transition: color 0.12s;
    }}

    .entry-chevron {{
      color: var(--text-muted); font-size: 0.8rem;
      transition: transform 0.2s; flex-shrink: 0;
    }}
    .entry.open .entry-chevron {{ transform: rotate(90deg); }}

    .entry-body {{
      display: none; padding: 0 20px 20px;
      border-top: 1px solid var(--border);
    }}
    .entry.open .entry-body {{ display: block; }}

    .md {{ padding-top: 16px; }}
    .md h1, .md h2 {{
      font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--text-muted); margin: 20px 0 8px;
    }}
    .md h1:first-child, .md h2:first-child {{ display: none; }}
    .md h3 {{ font-size: 0.88rem; font-weight: 600; color: var(--text-secondary); margin: 14px 0 6px; }}
    .md p {{ font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 6px; }}
    .md ul {{ list-style: none; margin: 0 0 8px; padding: 0; }}
    .md ul li {{
      font-size: 0.9rem; color: var(--text-secondary);
      line-height: 1.65; padding-left: 16px; position: relative;
    }}
    .md ul li::before {{ content: "–"; position: absolute; left: 0; color: var(--text-muted); }}
    .md strong {{ font-weight: 600; color: var(--text-primary); }}

    .footer {{
      margin-top: 64px; padding-top: 20px;
      border-top: 1px solid var(--border);
      font-size: 0.8rem; color: var(--text-muted);
    }}
  </style>
</head>
<body>
  <div class="page">

    <a class="back-link" href="index.html">← Back to notes</a>

    <header class="header">
      <p class="header-eyebrow">Startup Journal</p>
      <h1>My Startup Journal</h1>
      <p>Daily logs — what happened, what's next, what I'm learning.</p>
    </header>

    <div class="entry-list" id="entryList"></div>

    <footer class="footer">{footer_text}</footer>

  </div>

  <script>
    const entries = {entries_js};

    function parseMarkdown(md) {{
      const lines = md.split('\\n');
      let html = '', inList = false;
      for (const line of lines) {{
        const h1 = line.match(/^# (.+)/);
        const h2 = line.match(/^## (.+)/);
        const h3 = line.match(/^### (.+)/);
        const li = line.match(/^- (.+)/);
        const blank = line.trim() === '';
        if (inList && !li) {{ html += '</ul>'; inList = false; }}
        if (h1)       html += `<h1>${{fmt(h1[1])}}</h1>`;
        else if (h2)  html += `<h2>${{fmt(h2[1])}}</h2>`;
        else if (h3)  html += `<h3>${{fmt(h3[1])}}</h3>`;
        else if (li)  {{ if (!inList) {{ html += '<ul>'; inList = true; }} html += `<li>${{fmt(li[1])}}</li>`; }}
        else if (!blank) html += `<p>${{fmt(line)}}</p>`;
      }}
      if (inList) html += '</ul>';
      return html;
    }}

    function fmt(t) {{
      return t.replace(/[*][*](.+?)[*][*]/g, '<strong>$1</strong>')
              .replace(/[*](.+?)[*]/g, '<em>$1</em>');
    }}

    const list = document.getElementById('entryList');
    entries.forEach((entry, i) => {{
      const el = document.createElement('div');
      el.className = 'entry' + (i === 0 ? ' open' : '');
      el.innerHTML = `
        <div class="entry-header">
          <div class="entry-left">
            <div class="entry-dot"></div>
            <span class="entry-date">${{entry.label}}</span>
          </div>
          <span class="entry-chevron">›</span>
        </div>
        <div class="entry-body"><div class="md">${{parseMarkdown(entry.content)}}</div></div>
      `;
      el.querySelector('.entry-header').addEventListener('click', () => el.classList.toggle('open'));
      list.appendChild(el);
    }});
  </script>
</body>
</html>"""


def main():
    entries = load_entries()
    html = render(entries)
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"journal.html rebuilt — {len(entries)} {'entry' if len(entries) == 1 else 'entries'}")


if __name__ == "__main__":
    main()
