"""Install the pinned PDF.js distribution locally for NAS packaging; no private data."""
import base64, hashlib, io, json, pathlib, tarfile, urllib.request
root=pathlib.Path(__file__).resolve().parents[1]
lock=json.loads((root/'tools/pdfjs-lock.json').read_text())
data=urllib.request.urlopen(lock['url'],timeout=90).read()
assert 'sha512-'+base64.b64encode(hashlib.sha512(data).digest()).decode()==lock['integrity'], 'PDF.js integrity mismatch'
dest=root/'public/vendor/pdfjs'
with tarfile.open(fileobj=io.BytesIO(data),mode='r:gz') as archive:
    for entry in archive.getmembers():
        name=entry.name.removeprefix('package/')
        allowed=name in ['LICENSE','package.json','legacy/build/pdf.min.mjs','legacy/build/pdf.worker.min.mjs'] or name.startswith(('cmaps/','standard_fonts/','wasm/'))
        if not allowed or not entry.isfile() or '..' in pathlib.PurePosixPath(name).parts: continue
        # .js avoids older Web Station installations serving .mjs as octet-stream.
        if name.endswith('.mjs'): name=name[:-4]+'.js'
        target=dest/name;target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(archive.extractfile(entry).read())
print('Installed PDF.js',lock['version'])
