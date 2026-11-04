# Measurement for JHS

An interactive learning tool for Junior High School students to explore perimeter, area, common unit conversions, and measurement practice.

## Activities

- **Perimeter calculator:** explore rectangles, squares, and triangles; edit side lengths and see the perimeter update. Triangle side lengths are checked against the triangle inequality.
- **Area explorer:** calculate the area of rectangles, squares, and triangles with the formula shown alongside a visual model.
- **Unit converter:** convert common length units (mm, cm, m, km) and area units (cm², m², ha, km²).
- **Practice quiz:** five multiple-choice questions with immediate feedback, explanations, score tracking, and a retry option.
- Responsive, browser-based interface with no build step or runtime dependencies.

## Run locally

Open `index.html` in a current browser, or start a local static server:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

In the repository, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save. GitHub Pages will show the published URL when deployment is ready.

## Learning formulas

- Rectangle perimeter: `P = 2 × (length + width)`
- Square perimeter: `P = 4 × side`
- Triangle perimeter: `P = side A + side B + side C`
- Rectangle area: `A = length × width`
- Square area: `A = side × side`
- Triangle area: `A = ½ × base × perpendicular height`

## Files

- `index.html` — activities and page structure
- `styles.css` — responsive styling
- `script.js` — calculators, unit conversions, and quiz interactions
