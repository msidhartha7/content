#!/usr/bin/env python3

from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass
from html import unescape
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
NOTES_DIR = ROOT / "content" / "notes"
JOURNAL_DIR = ROOT / "content" / "journal"


@dataclass(frozen=True)
class NoteConfig:
    topic: str
    tags: tuple[str, ...]
    status: str
    pinned: bool = False
    summary: str | None = None


NOTE_CONFIG: dict[str, NoteConfig] = {
    "ai-regulation/EU AI Act Article 9 Langgraph Proposal.html": NoteConfig("ai-regulation", ("ai-act", "langgraph", "compliance"), "evergreen", True),
    "ai-regulation/EU AI Act GDPR Compliance Guide.html": NoteConfig("ai-regulation", ("ai-act", "gdpr", "compliance"), "evergreen"),
    "ai-regulation/ICP AI Governance Director - Claude.html": NoteConfig("ai-regulation", ("governance", "icp", "persona"), "working"),
    "it-audit/IT Audit Compliance Plan.html": NoteConfig("it-audit", ("audit", "compliance", "agent-infra"), "evergreen", True),
    "it-audit/IT Audit Landscape - Learning Plan.html": NoteConfig("it-audit", ("audit", "learning-plan", "landscape"), "evergreen"),
    "it-audit/IT Auditors Content Calendar.html": NoteConfig("it-audit", ("audit", "content", "calendar"), "working"),
    "marketing/LinkedIn Audit Leadgen.html": NoteConfig("marketing", ("linkedin", "leadgen", "audit"), "working", True),
    "marketing/Reddit Lead Generation for IT Auditors.html": NoteConfig("marketing", ("reddit", "leadgen", "audit"), "working"),
    "marketing/Reddit Marketing Strategy.html": NoteConfig("marketing", ("reddit", "growth", "invoice-app"), "working"),
    "demos/Lookover Compliance Demo (1).html": NoteConfig("demos", ("demo", "lookover", "compliance"), "working"),
    "demos/Lookover Compliance Demo 2.html": NoteConfig("demos", ("demo", "lookover", "compliance"), "working"),
    "portfolio/Vibecon Portfolio - Sidhartha.html": NoteConfig("portfolio", ("portfolio", "vibecon", "profile"), "evergreen", True),
    "prep-plans/AI Systems Prep Plan.html": NoteConfig("prep-plans", ("prep", "systems", "interview"), "evergreen"),
    "prep-plans/Mixed Bread Prep Plan for GreatFrontend.html": NoteConfig("prep-plans", ("prep", "frontend", "interview"), "evergreen"),
    "fundraising/Investor Outreach Plan - Claude.html": NoteConfig("fundraising", ("fundraising", "investors", "lookover"), "working", True),
}


class BlockExtractor(HTMLParser):
    BLOCK_TAGS = {"title", "h1", "h2", "h3", "p", "li"}
    SKIP_TAGS = {"script", "style", "svg", "path", "noscript"}

    def __init__(self) -> None:
        super().__init__()
        self.skip_depth = 0
        self.current_tag: str | None = None
        self.current_parts: list[str] = []
        self.blocks: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in self.SKIP_TAGS:
            self.skip_depth += 1
            return

        if self.skip_depth:
            return

        if tag in self.BLOCK_TAGS:
            self._flush()
            self.current_tag = tag
            self.current_parts = []
        elif tag == "br" and self.current_parts:
            self.current_parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in self.SKIP_TAGS and self.skip_depth:
            self.skip_depth -= 1
            return

        if self.skip_depth:
            return

        if tag == self.current_tag:
            self._flush()

    def handle_data(self, data: str) -> None:
        if self.skip_depth or not self.current_tag:
            return

        text = re.sub(r"\s+", " ", data).strip()
        if text:
            self.current_parts.append(text)

    def _flush(self) -> None:
        if not self.current_tag:
            return

        text = " ".join(self.current_parts).strip()
        text = re.sub(r"\s+([.,;:!?])", r"\1", text)
        if text:
            self.blocks.append((self.current_tag, unescape(text)))
        self.current_tag = None
        self.current_parts = []


def slugify(filename: str) -> str:
    name = filename.rsplit(".", 1)[0].lower()
    name = re.sub(r"[^a-z0-9]+", "-", name)
    return name.strip("-")


def git_date(path: Path) -> str:
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", str(path)],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    return result.stdout.strip() or "2026-04-22"


def summarize(paragraphs: list[str]) -> str:
    for paragraph in paragraphs:
      cleaned = paragraph.strip()
      if cleaned:
          return cleaned[:180].rstrip(".") + ("..." if len(cleaned) > 180 else "")
    return "Migrated note."


def markdown_from_blocks(blocks: list[tuple[str, str]], title: str) -> str:
    lines: list[str] = []
    first_heading_skipped = False

    for tag, text in blocks:
        if tag == "title":
            continue
        if tag == "h1":
            if not first_heading_skipped and text.lower() == title.lower():
                first_heading_skipped = True
                continue
            lines.append(f"# {text}")
        elif tag == "h2":
            lines.append(f"## {text}")
        elif tag == "h3":
            lines.append(f"### {text}")
        elif tag == "li":
            lines.append(f"- {text}")
        else:
            lines.append(text)
        lines.append("")

    body = "\n".join(lines).strip()
    if not body:
        body = title
    return body + "\n"


def write_note(path: Path, config: NoteConfig) -> None:
    source = path.read_text(encoding="utf-8")
    relative_path = path.relative_to(ROOT).as_posix()
    parser = BlockExtractor()
    parser.feed(source)

    title = next((text for tag, text in parser.blocks if tag in {"h1", "title"}), path.stem)
    paragraphs = [text for tag, text in parser.blocks if tag == "p"]
    summary = config.summary or summarize(paragraphs)
    date = git_date(path)
    slug = slugify(path.name)
    body = markdown_from_blocks(parser.blocks, title)

    topic_dir = NOTES_DIR / config.topic
    topic_dir.mkdir(parents=True, exist_ok=True)
    destination = topic_dir / f"{slug}.md"

    frontmatter = [
        "---",
        f"title: {json.dumps(title)}",
        f"summary: {json.dumps(summary)}",
        f"topic: {config.topic}",
        f"legacyPath: {json.dumps(relative_path)}",
        f"tags: {json.dumps(list(config.tags))}",
        f"date: {date}",
        f"updated: {date}",
        f"status: {config.status}",
        f"pinned: {'true' if config.pinned else 'false'}",
        "public: true",
        "---",
        "",
    ]

    destination.write_text("\n".join(frontmatter) + body, encoding="utf-8")


def write_journal(path: Path) -> None:
    JOURNAL_DIR.mkdir(parents=True, exist_ok=True)
    body = path.read_text(encoding="utf-8").strip() + "\n"
    first_line = next((line.replace("#", "").strip() for line in body.splitlines() if line.startswith("#")), "Daily Log")
    summary = next((line.replace("- ", "").strip() for line in body.splitlines() if line.startswith("- ")), "Daily log entry.")
    destination = JOURNAL_DIR / path.name
    frontmatter = [
        "---",
        'title: "Daily Log"',
        f"summary: {json.dumps(summary[:180])}",
        f"date: {path.stem}",
        "public: true",
        "---",
        "",
    ]

    if body.startswith("# "):
        body = "\n".join(body.splitlines()[1:]).strip() + "\n"
    if first_line:
        body = f"# {first_line}\n\n{body.lstrip()}"

    destination.write_text("\n".join(frontmatter) + body, encoding="utf-8")


def main() -> None:
    for relative, config in NOTE_CONFIG.items():
        write_note(ROOT / relative, config)

    for path in sorted((ROOT / "daily-logs").glob("*.md")):
        write_journal(path)

    print(f"Migrated {len(NOTE_CONFIG)} notes and {len(list((ROOT / 'daily-logs').glob('*.md')))} journal entries.")


if __name__ == "__main__":
    main()
