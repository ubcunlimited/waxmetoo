import urllib.request, re

pages = [
    ("Blog: 15-min-brazilian (has suffix)", "http://localhost:3000/blog/15-minute-brazilian-wax-experience"),
    ("Blog: bikini-wax-types (no suffix)", "http://localhost:3000/blog/bikini-wax-types-explained"),
    ("Blog: st-george-waxing-salon-utah (has suffix)", "http://localhost:3000/blog/st-george-waxing-salon-utah"),
    ("Blog: first-brazilian-wax (no suffix)", "http://localhost:3000/blog/first-brazilian-wax-step-by-step"),
    ("Blog: waxing-aftercare-guide (no suffix)", "http://localhost:3000/blog/waxing-aftercare-guide"),
    ("Blog: how-often-should-you-wax (no suffix)", "http://localhost:3000/blog/how-often-should-you-wax"),
    ("Blog: throw-away-your-razor (no suffix)", "http://localhost:3000/blog/throw-away-your-razor"),
    ("Blog: waxing-faq-utah (has suffix)", "http://localhost:3000/blog/waxing-faq-utah"),
    ("Blog: naked-and-afraid (no suffix)", "http://localhost:3000/blog/naked-and-afraid-first-brazilian"),
    ("Blog: eyebrow-design (no suffix)", "http://localhost:3000/blog/eyebrow-design-waxing-guide"),
    ("Static: home", "http://localhost:3000/"),
    ("Static: services", "http://localhost:3000/services"),
    ("Static: contact", "http://localhost:3000/contact"),
    ("Static: win-a-free-wax", "http://localhost:3000/win-a-free-wax"),
    ("Location: layton", "http://localhost:3000/locations/layton"),
    ("Location: orem", "http://localhost:3000/locations/orem"),
    ("Location: st-george", "http://localhost:3000/locations/st-george"),
]

all_ok = True
for name, url in pages:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            html = r.read().decode("utf-8", errors="replace")
        title_m = re.search(r'<title>(.*?)</title>', html, re.I | re.S)
        h1_m = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.I | re.S)
        title = title_m.group(1).strip() if title_m else "NONE"
        h1 = h1_m.group(1).strip() if h1_m else "NONE"
        match = "DUPLICATE ❌" if title == h1 else "OK ✓"
        if title == h1:
            all_ok = False
        print(f"{name} [{match}]")
        print(f"  title: {title[:80]!r}")
        print(f"  h1:    {h1[:80]!r}")
        print()
    except Exception as e:
        print(f"{name}: ERROR {e}")
        all_ok = False

print("=" * 60)
print("All OK!" if all_ok else "ISSUES FOUND — check above")
