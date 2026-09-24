"""Render an AudioXL manual or deck (HTML) to PDF and report overflowing pages.

usage: python3 audioxl-shared/render.py <product-dir> manual|presentation <out.pdf> [--shots DIR]
"""
import sys, pathlib
from playwright.sync_api import sync_playwright

root, kind, out = pathlib.Path(sys.argv[1]).resolve(), sys.argv[2], sys.argv[3]
shots = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else None
html = root / f'{kind}.html'
vw, vh, fmt = (794, 1123, dict(format='A4')) if kind == 'manual' else (1440, 810, dict(width='1440px', height='810px'))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    pg = b.new_page(viewport={'width': vw, 'height': vh})
    pg.goto(html.as_uri())
    pg.evaluate('document.fonts.ready')
    pg.wait_for_timeout(400)
    over = pg.evaluate("""() => [...document.querySelectorAll('.page,.slide')].map((el,i)=>{
        const r=el.getBoundingClientRect(), padb=parseFloat(getComputedStyle(el).paddingBottom);
        let worst=-1e9;
        [...el.children].forEach(c=>{ if(getComputedStyle(c).position=='absolute') return;
          worst=Math.max(worst,c.getBoundingClientRect().bottom-(r.bottom-padb)); });
        return [i+1, Math.round(worst)];
      }).filter(x=>x[1]>0)""")
    print('overflow (page, px past content area):', over)
    if shots:
        d = pathlib.Path(shots); d.mkdir(parents=True, exist_ok=True)
        loc = pg.locator('.page,.slide')
        for i in range(loc.count()):
            loc.nth(i).screenshot(path=str(d / f'{kind}_{i+1:02d}.png'))
    pg.emulate_media(media='print')
    pg.pdf(path=str(root / out), print_background=True, prefer_css_page_size=True,
           margin=dict(top='0', bottom='0', left='0', right='0'), **fmt)
    b.close()
print('wrote', root / out)
