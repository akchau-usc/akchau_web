Thumbnails
----------
Run `generate_thumbs.py` to create thumbnails for each album under `photos/*`. The script requires Pillow.

Install Pillow and run:

```powershell
py -m pip install Pillow
py generate_thumbs.py
```

Then serve the site (for example with `python -m http.server 8000`) and open `http://localhost:8000`.
