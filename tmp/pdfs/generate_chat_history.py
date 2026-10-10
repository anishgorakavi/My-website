from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path("/Users/anishgorakavi/Documents/ChatGPT/Anish Website")
OUTPUT = ROOT / "output/pdf/chat_history.pdf"

pdfmetrics.registerFont(TTFont("Verdana", "/System/Library/Fonts/Supplemental/Verdana.ttf"))
pdfmetrics.registerFont(TTFont("Verdana-Bold", "/System/Library/Fonts/Supplemental/Verdana Bold.ttf"))
pdfmetrics.registerFont(TTFont("Andale", "/System/Library/Fonts/Supplemental/Andale Mono.ttf"))

BG = colors.HexColor("#07101A")
PANEL = colors.HexColor("#0D1825")
PANEL_USER = colors.HexColor("#10243A")
BLUE = colors.HexColor("#4DBDFF")
ORANGE = colors.HexColor("#FF9D48")
TEXT = colors.HexColor("#E7EEF7")
MUTED = colors.HexColor("#91A3B8")
LINE = colors.HexColor("#243A50")

styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    "Title",
    fontName="Verdana-Bold",
    fontSize=28,
    leading=34,
    textColor=TEXT,
    spaceAfter=8,
)
subtitle_style = ParagraphStyle(
    "Subtitle",
    fontName="Andale",
    fontSize=9,
    leading=14,
    tracking=1.2,
    textColor=BLUE,
    spaceAfter=22,
)
speaker_user = ParagraphStyle(
    "UserLabel",
    fontName="Andale",
    fontSize=8.5,
    leading=12,
    textColor=BLUE,
    tracking=1,
    spaceAfter=7,
)
speaker_assistant = ParagraphStyle(
    "AssistantLabel",
    parent=speaker_user,
    textColor=ORANGE,
)
body_style = ParagraphStyle(
    "Body",
    fontName="Verdana",
    fontSize=9.2,
    leading=14.2,
    textColor=TEXT,
    spaceAfter=8,
    allowWidows=0,
    allowOrphans=0,
)
small_style = ParagraphStyle(
    "Small",
    fontName="Verdana",
    fontSize=7.8,
    leading=12,
    textColor=MUTED,
)
section_style = ParagraphStyle(
    "Section",
    fontName="Verdana-Bold",
    fontSize=15,
    leading=20,
    textColor=TEXT,
    spaceBefore=8,
    spaceAfter=10,
)


def safe(text: str) -> str:
    text = escape(text)
    replacements = {
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2013": "-",
        "\u2014": "-",
        "\u2192": "-&gt;",
        "\u2197": "^",
        "\u2193": "v",
        "\u00b7": " / ",
        "\u00d7": "x",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text.replace("\n", "<br/>")


def message_box(role: str, text: str, note: str | None = None):
    is_user = role == "USER"
    label_style = speaker_user if is_user else speaker_assistant
    label = role if note is None else f"{role} / {note.upper()}"
    blocks = [Paragraph(label, label_style)]
    for part in text.split("\n\n"):
        if part.strip():
            blocks.append(Paragraph(safe(part.strip()), body_style))
    table = Table([[blocks]], colWidths=[6.55 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PANEL_USER if is_user else PANEL),
                ("BOX", (0, 0), (-1, -1), 0.7, BLUE if is_user else LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return [table, Spacer(1, 10)]


def attachment_image(path: str, caption: str):
    image_path = Path(path)
    if not image_path.exists():
        return [Paragraph(f"Attachment: {safe(caption)} (file unavailable during export)", small_style), Spacer(1, 8)]
    img = Image(str(image_path))
    max_w, max_h = 4.5 * inch, 3.25 * inch
    ratio = min(max_w / img.imageWidth, max_h / img.imageHeight)
    img.drawWidth = img.imageWidth * ratio
    img.drawHeight = img.imageHeight * ratio
    wrap = Table([[img], [Paragraph(safe(caption), small_style)]], colWidths=[max_w])
    wrap.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#08131F")),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return [wrap, Spacer(1, 10)]


def on_page(canvas, doc):
    width, height = LETTER
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.7 * inch, height - 0.52 * inch, width - 0.7 * inch, height - 0.52 * inch)
    canvas.line(0.7 * inch, 0.48 * inch, width - 0.7 * inch, 0.48 * inch)
    canvas.setFont("Andale", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(0.7 * inch, 0.27 * inch, "ANISH GORAKAVI WEBSITE / CHAT TRANSCRIPT")
    canvas.drawRightString(width - 0.7 * inch, 0.27 * inch, f"PAGE {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT),
    pagesize=LETTER,
    leftMargin=0.75 * inch,
    rightMargin=0.75 * inch,
    topMargin=0.72 * inch,
    bottomMargin=0.65 * inch,
    title="Chat History - Anish Gorakavi Website",
    author="OpenAI Codex and Anish Gorakavi",
    subject="Website design and implementation conversation",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="transcript", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="dark", frames=[frame], onPage=on_page)])

story = [
    Spacer(1, 0.35 * inch),
    Paragraph("Chat History", title_style),
    Paragraph("ANISH GORAKAVI PERSONAL WEBSITE / DESIGN + IMPLEMENTATION", subtitle_style),
    Paragraph(
        "This transcript contains the visible user requests and assistant responses from the current chat through the PDF export request. Hidden system instructions, private reasoning, and internal tool logs are excluded. Attachment filenames and available visual references are preserved.",
        small_style,
    ),
    Spacer(1, 0.25 * inch),
]

turns = [
    (
        "USER",
        "Files mentioned: anish-gorakavi-profile.md\n\nBased on this document, generate a React website that will export to static HTML, CSS, and JavaScript, as it will be SCP'd to an Apache server. Make it neon blue with a fusion of 2000s skeuomorphism and 2020s neomorphism with a hacker aesthetic.",
        None,
    ),
    (
        "ASSISTANT",
        "I'll read the profile and check the workspace, then build a neon-blue React site that exports static HTML, CSS, and JavaScript for Apache.",
        "progress",
    ),
    (
        "ASSISTANT",
        "I'm using the Sites building workflow for the design process, with a static export for your Apache server. The visual direction is a dark workstation: electric-blue accents, glossy hardware-style controls, softly recessed panels, and terminal details. I'll use the document as biographical source material and follow your requested aesthetic over its embedded design suggestions.",
        "progress",
    ),
    (
        "ASSISTANT",
        "The site is built around your projects, background, and book, with concepts and prototypes clearly labeled. The export also includes pre-rendered HTML, so visitors can read the content before React loads, and Apache does not need a Node server or routing rules.",
        "progress",
    ),
    (
        "ASSISTANT",
        "Built and verified your React site with neon blue accents, glossy controls, recessed panels, and terminal styling.\n\nThe ready-to-upload files are in dist. Upload its contents to Apache with:\nscp -r dist/. username@server:/var/www/html/\n\nRebuild after edits with npm run build. No Node server required.",
        "final",
    ),
    (
        "USER",
        "Remove 'I grow roses,' and capitalize AG. For the Cyber Essentials for Teenagers title, I want it shaped like a book with a blinking neon cursor and an Amazon link to my book:\nhttps://www.amazon.com/dp/B0FH1SCD16",
        None,
    ),
    (
        "ASSISTANT",
        "I'll remove the roses reference, capitalize the AG monograms, and turn the publication graphic into a book-shaped cover with a blinking neon cursor and an Amazon link.",
        "progress",
    ),
    (
        "ASSISTANT",
        "Done - removed the roses reference, capitalized AG, and added a book-shaped cover with a blinking neon cursor. The cover and Amazon button link to your book. Rebuilt the Apache-ready files in dist.",
        "final",
    ),
    (
        "USER",
        "Make the buttons neon dark. They should not look like mid-2000s Bootstrap 2 UI.",
        None,
    ),
    (
        "ASSISTANT",
        "I'll replace the glossy blue buttons with dark surfaces, crisp neon borders, and restrained glow so they feel sharper and more current.",
        "progress",
    ),
    (
        "ASSISTANT",
        "Updated all buttons to dark navy surfaces with thin neon-blue borders, lighter typography, and subtle hover glow. Removed glossy gradients and raised bevels. Static export rebuilt in dist.",
        "final",
    ),
    (
        "USER",
        "I want the book to look like this, with a bit of depth.",
        None,
    ),
    (
        "ASSISTANT",
        "I'll match the reference's cyan grid, glowing uppercase title, and monospace labels, with subtle edge thickness and shadow for depth. I'll keep the blinking cursor and Amazon link.",
        "progress",
    ),
    (
        "ASSISTANT",
        "Updated the book to match your reference: glowing cyan typography, grid and scanlines, rounded neon border, and subtle 3D depth. Kept the blinking cursor and Amazon link. Static export rebuilt.",
        "final",
    ),
    (
        "USER",
        "Add a dropdown section for Academic Goals & Successes.\n\nAs a computer science student at The University of Texas at Austin, I want to take advantage of UT's strong CS community to explore systems, cybersecurity, networking, and the intersection of computing and neuroscience. My coursework in areas such as data structures and algorithms has strengthened the way I approach complex problems, while UT's labs, student resources, and technical community have given me opportunities to experiment beyond the classroom.\n\nMy goal at UT is not just to earn a degree, but to leave with a deeper understanding of how computers work, from algorithms and software to operating systems and hardware. I hope to use that foundation to contribute to research, ambitious technical projects, and eventually work that connects my interests across computing, security, and neuroscience.\n\nBeside it, generate an animated ASCII Bevo running with orange terminal color.",
        None,
    ),
    (
        "ASSISTANT",
        "I'll add an expandable 'Academic Goals & Successes' section with your text, alongside an orange terminal showing a running ASCII Bevo.",
        "progress",
    ),
    (
        "ASSISTANT",
        "The section is in place with both paragraphs and the running orange ASCII Bevo beside it. I've also added a pause button and reduced-motion support.",
        "progress",
    ),
    (
        "ASSISTANT",
        "Added the expandable Academic Goals & Successes section with your text and an orange animated ASCII Bevo alongside it. Includes pause/resume, reduced-motion support, and a mobile layout. Static export rebuilt.",
        "final",
    ),
    (
        "USER",
        "Change the ASCII Bevo animation so Bevo is facing directly toward the viewer and running forward, rather than moving horizontally from left to right. Keep Bevo centered in the terminal area. Animate the run by alternating the front-facing leg positions and adding a subtle up-and-down body bounce to create the illusion that Bevo is charging/running toward the screen. The horns, head, and body should remain recognizable as a Texas Longhorn from the front. Do not translate Bevo horizontally across the container. Keep the existing ASCII/terminal aesthetic and burnt-orange styling. The animation should feel playful and subtle, not aggressive or distracting.",
        None,
    ),
    (
        "ASSISTANT",
        "I'll redraw Bevo from the front with wide horns and alternating leg positions, keep him centered, and use only a gentle vertical bounce for the run.",
        "progress",
    ),
    (
        "ASSISTANT",
        "Bevo now faces forward and stays centered, with alternating front legs and a gentle vertical bounce. Removed sideways ground movement and kept the orange terminal styling and pause control. Static export rebuilt.",
        "final",
    ),
    (
        "USER",
        "Make the window around Bevo neon blue.",
        None,
    ),
    (
        "ASSISTANT",
        "I'll change only the Bevo terminal's outer window chrome to neon blue, while keeping the ASCII art and terminal text burnt orange.",
        "progress",
    ),
    (
        "ASSISTANT",
        "Updated the Bevo terminal window with a neon-blue border, blue dividers, and a restrained blue glow. The ASCII Bevo and terminal text remain burnt orange. The static export in dist is rebuilt and ready.",
        "final",
    ),
    (
        "USER",
        "Export this entire chat conversation into a PDF file called chat_history.pdf.",
        None,
    ),
]

attachment_after_turn = {
    0: [("/Users/anishgorakavi/Downloads/anish-gorakavi-profile.md", "Attachment: anish-gorakavi-profile.md (source profile document; not embedded as an image)")],
    11: [("/var/folders/vv/z6l5bhwj21l054_3rd0w_4m80000gn/T/codex-clipboard-252b5d83-da49-416f-986d-9dd2070292bb.png", "Book-cover visual reference supplied by the user")],
    14: [("/var/folders/vv/z6l5bhwj21l054_3rd0w_4m80000gn/T/codex-clipboard-aac1a2cb-a652-4488-b211-909889a18102.png", "Texas Longhorn / Bevo visual reference supplied by the user")],
    21: [("/var/folders/vv/z6l5bhwj21l054_3rd0w_4m80000gn/T/codex-clipboard-67f93067-bdc2-4d31-8e23-4a81f2698f1d.png", "Bevo terminal screenshot supplied by the user")],
}

for idx, (role, text, note) in enumerate(turns):
    story.extend(message_box(role, text, note))
    for path, caption in attachment_after_turn.get(idx, []):
        if path.endswith(".md"):
            story.extend([Paragraph(safe(caption), small_style), Spacer(1, 9)])
        else:
            story.extend(attachment_image(path, caption))

story.extend(
    [
        Spacer(1, 12),
        Paragraph("End of exported conversation", section_style),
        Paragraph("Exported on September 27, 2026. Transcript scope: visible chat content through the user's PDF export request.", small_style),
    ]
)

doc.build(story)
print(OUTPUT)
