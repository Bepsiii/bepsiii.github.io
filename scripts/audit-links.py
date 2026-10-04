from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

root = Path(__file__).resolve().parent.parent
issues = []
class Audit(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('href', 'src'):
            value = attrs.get(key, '')
            url = urlsplit(value)
            if not value or url.scheme or url.netloc or not url.path:
                continue
            target = root / unquote(url.path).lstrip('/')
            if not target.exists():
                issues.append(f'{self.page}: {key}="{value}"')
for page in root.glob('*.html'):
    audit = Audit()
    audit.page = page.name
    audit.feed(page.read_text(encoding='utf-8'))
if issues:
    print('\n'.join(issues))
    raise SystemExit(1)
print('PASS: all local page and asset links resolve.')
