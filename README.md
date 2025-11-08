
# RainbowWaveGlowPlus (Decky Plugin)
Neon rainbow halo borders for Steam Deck tiles, tuned for couch distance and performance. Includes preset palettes (incl. color-blind-safe), Ring/Double/Dashed/Aurora modes, Eco/Night modes, focus pulse, scanlines, subtle neon flicker, hue jitter, Smart Tint (beta), and profile slots A/B/C.

## ✨ Features
- Modes: **Ring / Double / Dashed / Aurora sweep**
- Presets: Pride, Synthwave, Aurora, Heat Bloom, Toxic Slime, **CB: Qualitative**, **CB: Diverging**, **Schlitzy**
- Toggles: **Eco mode**, **Focus-only**, **Auto Night (9pm–6am)**, **Scanlines**, **Neon Flicker**, **Hue Jitter**
- **Smart Tint (beta):** tries to sample the focused game’s cover art and tint the glow
- **Profiles:** Slots **A/B/C** + rename, **Export/Import JSON**
- Respects `prefers-reduced-motion`

## 🛠 Install (no-SSH)
1. Create a **GitHub Release** (see “Releases”).
2. On Steam Deck: **Decky → Settings → Install from URL**.
3. Paste the **release ZIP URL** from this repo’s latest release.

## 💻 Build from source (PC)
```bash
pnpm i
pnpm run build
```

## 🚀 Releases (automated)
1. Push to `main`.
2. Create a **GitHub Release** (e.g., `v3.0.0`).
3. The GitHub Actions workflow builds your plugin and **attaches a ZIP** to the release.
4. Use that asset URL in Decky’s “Install from URL”.

## 📝 License
MIT
