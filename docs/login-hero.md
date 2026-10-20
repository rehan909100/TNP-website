# Login blueprint hero

- `/blueprint-reference.html` renders the supplied standalone HTML unchanged,
  including its embedded WebP. Keep this as the visual reference.
- `/login` uses a 30:70 form/hero split on desktop and stacks on mobile.
- The hero retains the reference's building position, grayscale/dimming,
  gradient mask, blue grid, dashed arc, markers, and blue boundary glow.
- Styling lives in `app/login/login.css`, with `login-` prefixed selectors.
  The repository's current Turbopack CSS loader served the previous module as
  global CSS without class-name exports, leaving the rendered page unstyled.
  Use the explicit classes here; do not switch this page back to CSS modules
  without first fixing and browser-verifying the loader configuration.
- Authentication remains a template. No credential verification or session
  handling was introduced by the visual work.

## Visual validation

Compared a browser screenshot of the login hero with the original HTML rendered
at the same hero dimensions in Chromium (device scale factor 1):

| Login viewport | Hero size | Mean absolute RGB difference (0–255) |
| --- | --- | --- |
| 1440 × 900 | 1008 × 900 | 0.025 |
| 1920 × 1080 | 1344 × 1080 | 0.021 |
| 1024 × 768 | approximately 717 × 768 | 0.204 |

At 1440 × 900 no colour channel differed by more than 3/255. The narrower
viewport has fractional CSS coordinates, introducing minor rasterization
variation. Screenshots were visually inspected as well. At 390 × 844 the
form and hero stack without horizontal overflow. No page JavaScript errors
were observed. ESLint and TypeScript checks passed.

Browser tools were installed under `/tmp/tnp-visual-check`; they are not project
dependencies. The reference is independent of the app stylesheet so future
visual comparisons can detect regressions.
