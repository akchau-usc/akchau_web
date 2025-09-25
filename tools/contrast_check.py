#!/usr/bin/env python3
"""A tiny contrast checker for the site's CSS variables.
Reads styles.css, extracts :root and :root[data-theme='dark'] variables,
computes contrast ratios for a small set of semantic pairs and reports WCAG AA/AAA.
"""
import re
import sys
from math import pow


def hex_to_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join([c*2 for c in h])
    return tuple(int(h[i:i+2],16) for i in (0,2,4))


def luminance(rgb):
    srgb = [c/255.0 for c in rgb]
    lin = []
    for v in srgb:
        if v <= 0.03928:
            lin.append(v/12.92)
        else:
            lin.append(pow((v+0.055)/1.055,2.4))
    return 0.2126*lin[0] + 0.7152*lin[1] + 0.0722*lin[2]


def contrast_ratio(hex1, hex2):
    try:
        l1 = luminance(hex_to_rgb(hex1))
        l2 = luminance(hex_to_rgb(hex2))
    except Exception:
        return None
    lighter = max(l1,l2)
    darker = min(l1,l2)
    return (lighter+0.05)/(darker+0.05)


def parse_vars(css_text, selector):
    # crude: find selector block and extract --var: value;
    pattern = re.compile(r"%s\s*\{([^}]*)\}" % re.escape(selector), re.S)
    m = pattern.search(css_text)
    if not m:
        return {}
    body = m.group(1)
    vars = {}
    for line in body.split(';'):
        if ':' in line:
            k,v = line.split(':',1)
            k=k.strip()
            v=v.strip()
            if k.startswith('--'):
                vars[k]=v
    return vars


def normalize_color(v):
    v = v.split(')')[0]
    v = v.strip()
    # handle rgb(...) or hex only
    if v.startswith('rgb'):
        m = re.findall(r"\d+", v)
        if len(m)>=3:
            return '#%02x%02x%02x' % (int(m[0]),int(m[1]),int(m[2]))
    if v.startswith('#'):
        return v
    # fallback: try to extract 6-digit hex within
    m = re.search(r"#([0-9a-fA-F]{3,6})", v)
    if m:
        return '#'+m.group(1)
    return None


def main():
    css_path = 'styles.css'
    try:
        with open(css_path,'r',encoding='utf-8') as f:
            css = f.read()
    except FileNotFoundError:
        print('styles.css not found in current folder')
        sys.exit(2)

    light = parse_vars(css, ':root')
    dark = parse_vars(css, ":root[data-theme='dark']")

    def cget(d,k,default=None):
        v = d.get(k)
        if not v:
            return default
        return normalize_color(v)

    pairs = [
        ('--text','--bg','page text vs background'),
        ('--text','--surface','text vs surface'),
        ('--accent','--bg','accent vs background'),
        ('--accent','--surface','accent vs surface'),
    ]

    print('Contrast report (WCAG ratios, AA normal >=4.5, AA large >=3.0, AAA >=7.0)')
    print('\nLight theme:')
    for a,b,label in pairs:
        ca = cget(light,a)
        cb = cget(light,b)
        ratio = None
        if ca and cb:
            ratio = contrast_ratio(ca,cb)
        print(f'  {label}: {a} ({ca}) vs {b} ({cb}) -> {ratio:.2f}' if ratio else f'  {label}: missing values ({a},{b})')

    print('\nDark theme:')
    for a,b,label in pairs:
        ca = cget(dark,a) or cget(light,a)
        cb = cget(dark,b) or cget(light,b)
        ratio = None
        if ca and cb:
            ratio = contrast_ratio(ca,cb)
        print(f'  {label}: {a} ({ca}) vs {b} ({cb}) -> {ratio:.2f}' if ratio else f'  {label}: missing values ({a},{b})')


if __name__ == '__main__':
    main()
