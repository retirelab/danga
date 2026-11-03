# Mobile web PDF viewer

The NAS viewer renders authenticated PDF bytes with Mozilla PDF.js 6.5.438 (Apache-2.0). Run `python3 tools/install-pdfjs.py` before packaging public/. The pinned npm SHA-512 is checked before extracting the legacy engine, worker, CMaps, standard fonts and WASM. The NAS update ZIP already includes these dependencies. No private PDF or authentication token belongs in GitHub.

Copy widget.js, pdf-viewer.php/js/css and vendor/pdfjs/ into the existing Web Station document root. Preserve other vendor files. Close old PDF tabs and reload the calculator. The widget authenticates the PDF request, opens/reuses one viewer tab, validates its origin/window readiness, and transfers only document bytes. The viewer does not receive the PIN or bearer token. No third-party PDF service is used.

Pages render on one canvas at a time with mobile backing-store size limits. Controls include fit-to-screen (initial width fit capped at 100%), 100%, zoom and page selection. Mobile browser/app downloads are avoided by navigating to the HTML viewer instead of a PDF/blob URL. The document bytes still transfer over the network. Text selection, annotation and document-wide text search are not implemented in this compact viewer.

Validation: original 76-page PDF parsed by the pinned engine and page 51 text checked; PHP/JS syntax and 33 API/PDF protection checks pass. Actual mobile canvas rendering remains to be checked after NAS installation.
