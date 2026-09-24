"""Render manual.html / presentation.html to PDF and check page overflow.

usage: python3 render.py manual|presentation [--shots DIR]
"""
import sys, pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
which = sys.argv[1]
shots = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else None
cfg = {
    'manual': dict(html='manual.html', pdf='AudioXL-SEQ-Manual-EN.pdf', vw=794, vh=1123, fmt=dict(format='A4')),
    'presentation': dict(html='presentation.html', pdf='AudioXL-SEQ-Presentation.pdf', vw=1440, vh=810,
                         fmt=dict(width='1440px', height='810px')),
}[which]

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    pg = b.new_page(viewport={'width': cfg['vw'], 'height': cfg['vh']})
    pg.goto((HERE / cfg['html']).as_uri())
    pg.evaluate('document.fonts.ready')
    pg.wait_for_timeout(400)
    over = pg.evaluate("""() => [...document.querySelectorAll('.page,.slide')].map((el,i)=>{
        const r=el.getBoundingClientRect(), padb=parseFloat(getComputedStyle(el).paddingBottom);
        let worst=-1e9;
        [...el.children].forEach(c=>{ if(c.matches('.ptop,.pfoot,.foot,.shot,.bg')||getComputedStyle(c).position=='absolute') return;
          worst=Math.max(worst,c.getBoundingClientRect().bottom-(r.bottom-padb)); });
        return [i+1, Math.round(worst)];
      }).filter(x=>x[1]>0)""")
    print('pages near/over bottom (page, px past content area):', over)
    if shots:
        d = pathlib.Path(shots); d.mkdir(parents=True, exist_ok=True)
        n = pg.evaluate("document.querySelectorAll('.page,.slide').length")
        for i in range(n):
            pg.locator('.page,.slide').nth(i).screenshot(path=str(d / f'{which}_{i+1:02d}.png'))
    pg.emulate_media(media='print')
    pg.pdf(path=str(HERE / cfg['pdf']), print_background=True, prefer_css_page_size=True,
           margin=dict(top='0', bottom='0', left='0', right='0'), **cfg['fmt'])
    b.close()
print('wrote', cfg['pdf'])
