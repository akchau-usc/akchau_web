#!/usr/bin/env python3
import sys,re
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

def contrast_ratio(hex1,hex2):
    try:
        l1 = luminance(hex_to_rgb(hex1))
        l2 = luminance(hex_to_rgb(hex2))
    except Exception:
        return None
    lighter = max(l1,l2); darker = min(l1,l2)
    return (lighter+0.05)/(darker+0.05)

def find_block(text, selector):
    i = text.find(selector)
    if i == -1: return ''
    # find first { after selector
    j = text.find('{', i)
    if j == -1: return ''
    depth = 0
    k = j
    while k < len(text):
        if text[k] == '{': depth += 1
        elif text[k] == '}':
            depth -= 1
            if depth == 0:
                return text[j+1:k]
        k += 1
    return ''

def parse_vars(block):
    vars = {}
    for m in re.finditer(r'(--[\w-]+)\s*:\s*([^;]+);', block):
        vars[m.group(1)] = m.group(2).strip()
    return vars

def normalize_color(v):
    if not v: return None
    v=v.strip()
    if v.startswith('rgb'):
        m = re.findall(r"\d+", v)
        if len(m)>=3:
            return '#%02x%02x%02x' % (int(m[0]),int(m[1]),int(m[2]))
    m = re.search(r"#([0-9a-fA-F]{3,6})", v)
    if m:
        return '#'+m.group(1).lower()
    return None

def main():
    css = open('styles.css','r',encoding='utf-8').read()
    light_block = find_block(css, ':root')
    dark_block = find_block(css, ":root[data-theme='dark']")
    light_vars = parse_vars(light_block)
    dark_vars = parse_vars(dark_block)

    print('Parsed light vars sample:')
    for k in ['--text','--bg','--accent','--surface']:
        print(' ',k, '->', light_vars.get(k))
    print('\nParsed dark vars sample:')
    for k in ['--text','--bg','--accent','--surface']:
        print(' ',k, '->', dark_vars.get(k))

    def getcol(vars, key, fallback=None):
        return normalize_color(vars.get(key) if vars.get(key) else fallback)

    pairs = [('--text','--bg','page text vs background'),('--text','--surface','text vs surface'),('--accent','--bg','accent vs background'),('--accent','--surface','accent vs surface')]

    print('\nContrast report:')
    print('\nLight theme:')
    for a,b,label in pairs:
        ca = getcol(light_vars,a)
        cb = getcol(light_vars,b)
        r = contrast_ratio(ca,cb) if ca and cb else None
        print(f'  {label}: {a} ({ca}) vs {b} ({cb}) -> {r:.2f}' if r else f'  {label}: missing {a} or {b}')

    print('\nDark theme:')
    for a,b,label in pairs:
        ca = getcol(dark_vars,a, light_vars.get(a))
        cb = getcol(dark_vars,b, light_vars.get(b))
        r = contrast_ratio(ca,cb) if ca and cb else None
        print(f'  {label}: {a} ({ca}) vs {b} ({cb}) -> {r:.2f}' if r else f'  {label}: missing {a} or {b}')

if __name__ == '__main__':
    main()
