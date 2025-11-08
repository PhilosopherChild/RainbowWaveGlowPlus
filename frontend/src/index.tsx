
import { definePlugin, PanelSection, PanelSectionRow, DropdownItem, ButtonItem, SliderField, ToggleField, TextField } from "decky-frontend-lib";
import { useEffect, useState } from "react";

const STYLE_ID = "rwg-style-v3";
type Mode = "ring"|"double"|"dashed"|"aurora";
type PresetKey = "Pride Parade"|"Synthwave"|"Aurora Drift"|"Heat Bloom"|"Toxic Slime"|"CB: Qualitative"|"CB: Diverging"|"Schlitzy";

const PRESETS: Record<PresetKey, {stops:string, mode?:Mode, speed?:number, opacity?:number}> = {
  "Pride Parade": { stops:"#ff004c,#ff7a00,#ffd400,#27ff00,#00ffd5,#0095ff,#7a00ff,#ff00e1,#ff004c", mode:"ring" },
  "Synthwave": { stops:"#ff00e6,#00f0ff,#6a00ff,#ff00e6", mode:"double", speed:12, opacity:0.95 },
  "Aurora Drift": { stops:"#1cffb9,#00e1ff,#2bff00,#00ffd5", mode:"aurora", speed:18 },
  "Heat Bloom": { stops:"#ff0066,#ff7a00,#ffd400,#ff0066", mode:"ring", speed:14 },
  "Toxic Slime": { stops:"#b6ff00,#27ff00,#00ff9a,#b6ff00", mode:"dashed", speed:16 },
  "CB: Qualitative": { stops:"#000000,#E69F00,#56B4E9,#009E73,#F0E442,#0072B2,#D55E00,#CC79A7", mode:"ring", speed:16 },
  "CB: Diverging": { stops:"#8e0152,#c51b7d,#de77ae,#f1b6da,#f7f7f7,#b8e186,#7fbc41,#4d9221,#276419", mode:"ring", speed:16 },
  "Schlitzy": { stops:"#ff00f0,#00ffe5,#00ff88,#7a00ff,#ff00a8", mode:"double", speed:12 }
};

const BASE_CSS = `
@property --rwg-angle { syntax:"<angle>"; inherits:false; initial-value:0deg; }
@property --rwg-angle2 { syntax:"<angle>"; inherits:false; initial-value:180deg; }
:root{
  --rwg-speed: 14s; --rwg-size: 5px; --rwg-blur: 9px; --rwg-opacity: 0.9;
  --rwg-radius: 16px; --rwg-mode: ring; --rwg-hue-shift: 0deg; --rwg-jitter: 0deg;
  --rwg-stops: #ff004c,#ff7a00,#ffd400,#27ff00,#00ffd5,#0095ff,#7a00ff,#ff00e1,#ff004c;
  --rwg-focus-pulse: 1; --rwg-scanlines: 0; --rwg-flicker: 0;
}
@media (prefers-reduced-motion: reduce){ :root{ --rwg-speed: 28s; --rwg-blur: 7px; } }
html[data-rwg-enabled="0"] :is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"])::before,
html[data-rwg-enabled="0"] :is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"])::after{ display:none!important; }
:is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"]){ position:relative; isolation:isolate; }
:is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"])::after{
  content:""; position:absolute; inset:calc(var(--rwg-size)*-1); border-radius:var(--rwg-radius); pointer-events:none; z-index:2;
  opacity:var(--rwg-opacity); padding:var(--rwg-size);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); -webkit-mask-composite:xor; mask-composite:exclude;
  transition:opacity 160ms ease,filter 160ms ease;
  background:conic-gradient(from calc(var(--rwg-angle) + var(--rwg-hue-shift) + var(--rwg-jitter)), var(--rwg-stops));
  animation:rwg-spin var(--rwg-speed) linear infinite;
  filter: drop-shadow(0 0 calc(var(--rwg-blur)*0.9) rgba(255,255,255,0.8));
}
:is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"])::before{
  content:""; position:absolute; inset:calc(var(--rwg-size)*-1); border-radius:var(--rwg-radius); pointer-events:none; z-index:2;
  padding:calc(var(--rwg-size)*2); -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); -webkit-mask-composite:xor; mask-composite:exclude;
  opacity:calc(var(--rwg-opacity)*0.8); background:conic-gradient(from calc(var(--rwg-angle2) + var(--rwg-hue-shift) + var(--rwg-jitter)), var(--rwg-stops));
  animation:rwg-spin2 var(--rwg-speed) linear infinite reverse; display:none;
}
:root[style*="--rwg-mode: double"] :is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"])::before{ display:block; }
:root[style*="--rwg-mode: dashed"] :is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"])::after{
  -webkit-mask:repeating-conic-gradient(#000 0 10deg, transparent 10deg 15deg) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
}
:root[style*="--rwg-mode: aurora"] :is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"])::after{
  background:linear-gradient(90deg,var(--rwg-stops)); background-size:300% 100%; animation:rwg-shift var(--rwg-speed) linear infinite;
}
@keyframes rwg-pulse { 0%,100%{ filter: drop-shadow(0 0 var(--rwg-blur) rgba(255,255,255,0.8)); } 50%{ filter: drop-shadow(0 0 calc(var(--rwg-blur)*1.25) rgba(255,255,255,0.95)); } }
:is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"]).gpfocus::after{
  opacity:1; animation: rwg-spin var(--rwg-speed) linear infinite, rwg-pulse 1.4s ease-in-out infinite;
}
@keyframes rwg-spin{ to{ --rwg-angle: 1turn; } }
@keyframes rwg-spin2{ to{ --rwg-angle2: -1turn; } }
@keyframes rwg-shift{ to{ background-position:300% 0; } }
`;

function applyVar(name:string, value:string){ document.documentElement.style.setProperty(name, value); }
function loadStyle(){ if(document.getElementById(STYLE_ID)) return; const s=document.createElement("style"); s.id=STYLE_ID; s.textContent=BASE_CSS; document.head.appendChild(s); document.documentElement.setAttribute("data-rwg-enabled","1"); }
function unloadStyle(){ document.getElementById(STYLE_ID)?.remove(); document.documentElement.setAttribute("data-rwg-enabled","0"); }
function saveLocal(state:any){ try{ localStorage.setItem("rwg-v3-settings", JSON.stringify(state)); }catch{} }
function loadLocal(){ try{ const s=localStorage.getItem("rwg-v3-settings"); return s? JSON.parse(s): null; }catch{ return null; } }

function sampleFocusedColor(): string | null {
  try{
    const focus = document.querySelector(
      ':is([class^="appportrait_"],[class*=" appportrait_"],[class^="collectionappgrid_"],[class*=" collectionappgrid_"],[class^="applist_"],[class*=" applist_"],[class^="libraryhomeshowcase_"],[class*=" libraryhomeshowcase_"],[class^="carousel_Item_"],[class*=" carousel_Item_"]).gpfocus'
    ) as HTMLElement | null;
    if(!focus) return null;
    const img = focus.querySelector('img') as HTMLImageElement | null;
    if(!img || !img.complete) return null;
    const cnv = document.createElement('canvas');
    const w = cnv.width = 24, h = cnv.height = 24;
    const ctx = cnv.getContext('2d', { willReadFrequently: true });
    if(!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let r=0,g=0,b=0,count=0;
    for(let i=0;i<data.length;i+=4){
      const R=data[i], G=data[i+1], B=data[i+2], A=data[i+3];
      if(A<128) continue;
      if(R+G+B < 60) continue;
      r+=R; g+=G; b+=B; count++;
    }
    if(!count) return null;
    r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
    const toHSL=(R:number,G:number,B:number)=>{
      R/=255;G/=255;B/=255; const max=Math.max(R,G,B),min=Math.min(R,G,B);
      let h=0,s=0,l=(max+min)/2; const d=max-min;
      if(d){ s=l>0.5? d/(2-max-min): d/(max+min);
        switch(max){
          case R: h=(G-B)/d + (G<B?6:0); break;
          case G: h=(B-R)/d + 2; break;
          case B: h=(R-G)/d + 4; break;
        } h/=6;
      }
      return {h:h*360,s:s*100,l:l*100};
    };
    const hsl = toHSL(r,g,b);
    const h1 = (hsl.h+0)%360, h2=(hsl.h+140)%360, h3=(hsl.h+220)%360;
    const cl = (h:number,l:number)=>`hsl(${Math.round(h)} 95% ${l}%)`;
    const stops = `${cl(h1,55)},${cl(h2,62)},${cl(h3,58)},${cl(h1,55)}`;
    return stops;
  }catch{ return null; }
}

export default definePlugin(()=>{
  const initial = loadLocal() || {};
  const [enabled, setEnabled] = useState(initial.enabled ?? true);
  const [mode, setMode] = useState<Mode>(initial.mode ?? "ring");
  const [speed, setSpeed] = useState<number>(initial.speed ?? 14);
  const [size, setSize] = useState<number>(initial.size ?? 5);
  const [blur, setBlur] = useState<number>(initial.blur ?? 9);
  const [opacity, setOpacity] = useState<number>(initial.opacity ?? 0.9);
  const [hue, setHue] = useState<number>(initial.hue ?? 0);
  const [eco, setEco] = useState<boolean>(initial.eco ?? false);
  const [focusOnly, setFocusOnly] = useState<boolean>(initial.focusOnly ?? false);
  const [autoNight, setAutoNight] = useState<boolean>(initial.autoNight ?? true);
  const [preset, setPreset] = useState<PresetKey>(initial.preset ?? "Schlitzy");
  const [scan, setScan] = useState<boolean>(initial.scan ?? false);
  const [flick, setFlick] = useState<boolean>(initial.flick ?? false);
  const [jitter, setJitter] = useState<number>(initial.jitter ?? 0);
  const [smartTint, setSmartTint] = useState<boolean>(initial.smartTint ?? false);
  const [customStops, setCustomStops] = useState<string>(initial.customStops ?? "");

  function applyAll(){
    if(enabled){ if(!document.getElementById(STYLE_ID)){ const s=document.createElement('style'); s.id=STYLE_ID; s.textContent=BASE_CSS; document.head.appendChild(s);} document.documentElement.setAttribute("data-rwg-enabled","1"); } 
    else { document.getElementById(STYLE_ID)?.remove(); document.documentElement.setAttribute("data-rwg-enabled","0"); }
    document.documentElement.style.setProperty("--rwg-mode", mode);
    document.documentElement.style.setProperty("--rwg-speed", `${speed}s`);
    document.documentElement.style.setProperty("--rwg-size", `${size}px`);
    document.documentElement.style.setProperty("--rwg-blur", `${blur}px`);
    document.documentElement.style.setProperty("--rwg-opacity", `${opacity}`);
    document.documentElement.style.setProperty("--rwg-hue-shift", `${hue}deg`);
    document.documentElement.style.setProperty("--rwg-scanlines", scan ? "1" : "0");
    document.documentElement.style.setProperty("--rwg-flicker", flick ? "1" : "0");
    document.documentElement.style.setProperty("--rwg-jitter", `${jitter}deg`);
    if(customStops.trim().length>0){ document.documentElement.style.setProperty("--rwg-stops", customStops.trim()); }
  }

  useEffect(()=>{
    applyAll();
    const t=setInterval(()=>{
      if(autoNight){
        const h=new Date().getHours();
        if(h>=21 || h<6){
          document.documentElement.style.setProperty("--rwg-speed", `${Math.max(speed, 20)}s`);
          document.documentElement.style.setProperty("--rwg-opacity", `${Math.min(opacity, 0.85)}`);
        } else {
          document.documentElement.style.setProperty("--rwg-speed", `${speed}s`);
          document.documentElement.style.setProperty("--rwg-opacity", `${opacity}`);
        }
      }
      if(smartTint){
        const stops = sampleFocusedColor();
        if(stops){ document.documentElement.style.setProperty("--rwg-stops", stops); }
      }
    }, 1500);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    applyAll(); 
    try{
      localStorage.setItem("rwg-v3-settings", JSON.stringify({enabled,mode,speed,size,blur,opacity,hue,eco,focusOnly,autoNight,preset,scan,flick,jitter,smartTint,customStops}));
    }catch{}
  },[enabled,mode,speed,size,blur,opacity,hue,eco,focusOnly,autoNight,preset,scan,flick,jitter,smartTint,customStops]);

  return (
    <PanelSection title="Rainbow Wave Glow+ v3">
      <PanelSectionRow><ToggleField label="Enabled" checked={enabled} onChange={setEnabled} /></PanelSectionRow>

      <PanelSectionRow>
        <DropdownItem label="Preset"
          rgOptions={(Object.keys(PRESETS) as PresetKey[]).map(k=>({label:k, data:k}))}
          selectedOption={preset} onChange={(sel:any)=>{
            const key = sel.data as PresetKey; setPreset(key);
            const p = PRESETS[key];
            document.documentElement.style.setProperty("--rwg-stops", p.stops);
            if(p.mode) setMode(p.mode);
            if(p.speed) setSpeed(p.speed||14);
            if(p.opacity) setOpacity(p.opacity||0.9);
          }}/>
      </PanelSectionRow>

      <PanelSectionRow>
        <DropdownItem label="Mode"
          rgOptions={[{label:"Ring",data:"ring"},{label:"Double",data:"double"},{label:"Dashed",data:"dashed"},{label:"Aurora Sweep",data:"aurora"}]}
          selectedOption={mode} onChange={(s:any)=>setMode(s.data)} />
      </PanelSectionRow>

      <PanelSectionRow><SliderField label="Speed (s)" min={6} max={40} step={1} value={speed} onChange={setSpeed} /></PanelSectionRow>
      <PanelSectionRow><SliderField label="Thickness (px)" min={2} max={10} step={1} value={size} onChange={setSize} /></PanelSectionRow>
      <PanelSectionRow><SliderField label="Blur (px)" min={4} max={18} step={1} value={blur} onChange={setBlur} /></PanelSectionRow>
      <PanelSectionRow><SliderField label="Opacity" min={0.4} max={1} step={0.05} value={opacity} onChange={setOpacity} /></PanelSectionRow>
      <PanelSectionRow><SliderField label="Hue Shift (deg)" min={-180} max={180} step={5} value={hue} onChange={setHue} /></PanelSectionRow>
      <PanelSectionRow><SliderField label="Hue Jitter (deg)" min={0} max={6} step={0.5} value={jitter} onChange={setJitter} /></PanelSectionRow>

      <PanelSectionRow><ToggleField label="Focus‑only mode" checked={focusOnly} onChange={setFocusOnly} /></PanelSectionRow>
      <PanelSectionRow><ToggleField label="Eco mode (battery saver)" checked={eco} onChange={setEco} /></PanelSectionRow>
      <PanelSectionRow><ToggleField label="Auto Night (dim after 9pm)" checked={autoNight} onChange={setAutoNight} /></PanelSectionRow>
      <PanelSectionRow><ToggleField label="Scanlines (retro overlay)" checked={scan} onChange={setScan} /></PanelSectionRow>
      <PanelSectionRow><ToggleField label="Neon Flicker (subtle)" checked={flick} onChange={setFlick} /></PanelSectionRow>
      <PanelSectionRow><ToggleField label="Smart Tint from cover art (beta)" checked={smartTint} onChange={setSmartTint} /></PanelSectionRow>

      <PanelSectionRow>
        <TextField label="Custom Stops (comma-separated CSS colors)" value={customStops} onChange={(v:string)=>setCustomStops(v)} />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem onClick={()=>{
          const keys = Object.keys(PRESETS) as PresetKey[];
          const next = keys[Math.floor(Math.random()*keys.length)];
          const p = PRESETS[next];
          setPreset(next);
          document.documentElement.style.setProperty("--rwg-stops", p.stops);
          if(p.mode) setMode(p.mode);
          if(p.speed) setSpeed(p.speed||speed);
          if(p.opacity) setOpacity(p.opacity||opacity);
        }}>Randomize Preset</ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem onClick={()=>{
          const s={enabled,mode,speed,size,blur,opacity,hue,eco,focusOnly,autoNight,preset,scan,flick,jitter,smartTint,customStops};
          try{ localStorage.setItem("rwg-slot-A", JSON.stringify(s)); }catch{}
        }}>Save → Slot A</ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={()=>{
          try{ const s=JSON.parse(localStorage.getItem("rwg-slot-A")||"null"); if(!s) return;
            setEnabled(s.enabled); setMode(s.mode); setSpeed(s.speed); setSize(s.size); setBlur(s.blur);
            setOpacity(s.opacity); setHue(s.hue); setEco(s.eco); setFocusOnly(s.focusOnly);
            setAutoNight(s.autoNight); setPreset(s.preset); setScan(s.scan); setFlick(s.flick);
            setJitter(s.jitter); setSmartTint(s.smartTint); setCustomStops(s.customStops||"");
          }catch{}
        }}>Load ← Slot A</ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem onClick={()=>{
          const s={enabled,mode,speed,size,blur,opacity,hue,eco,focusOnly,autoNight,preset,scan,flick,jitter,smartTint,customStops};
          try{ localStorage.setItem("rwg-slot-B", JSON.stringify(s)); }catch{}
        }}>Save → Slot B</ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={()=>{
          try{ const s=JSON.parse(localStorage.getItem("rwg-slot-B")||"null"); if(!s) return;
            setEnabled(s.enabled); setMode(s.mode); setSpeed(s.speed); setSize(s.size); setBlur(s.blur);
            setOpacity(s.opacity); setHue(s.hue); setEco(s.eco); setFocusOnly(s.focusOnly);
            setAutoNight(s.autoNight); setPreset(s.preset); setScan(s.scan); setFlick(s.flick);
            setJitter(s.jitter); setSmartTint(s.smartTint); setCustomStops(s.customStops||"");
          }catch{}
        }}>Load ← Slot B</ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem onClick={()=>{
          const s={enabled,mode,speed,size,blur,opacity,hue,eco,focusOnly,autoNight,preset,scan,flick,jitter,smartTint,customStops};
          try{ localStorage.setItem("rwg-slot-C", JSON.stringify(s)); }catch{}
        }}>Save → Slot C</ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={()=>{
          try{ const s=JSON.parse(localStorage.getItem("rwg-slot-C")||"null"); if(!s) return;
            setEnabled(s.enabled); setMode(s.mode); setSpeed(s.speed); setSize(s.size); setBlur(s.blur);
            setOpacity(s.opacity); setHue(s.hue); setEco(s.eco); setFocusOnly(s.focusOnly);
            setAutoNight(s.autoNight); setPreset(s.preset); setScan(s.scan); setFlick(s.flick);
            setJitter(s.jitter); setSmartTint(s.smartTint); setCustomStops(s.customStops||"");
          }catch{}
        }}>Load ← Slot C</ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem onClick={()=>{
          const json = JSON.stringify({enabled,mode,speed,size,blur,opacity,hue,eco,focusOnly,autoNight,preset,scan,flick,jitter,smartTint,customStops}, null, 2);
          navigator.clipboard?.writeText(json).catch(()=>{});
          alert("Settings copied to clipboard (if permitted).");
        }}>Copy Settings JSON</ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem onClick={()=>{
          const json = prompt("Paste settings JSON");
          if(!json) return;
          try{
            const s = JSON.parse(json);
            setEnabled(s.enabled); setMode(s.mode); setSpeed(s.speed); setSize(s.size); setBlur(s.blur);
            setOpacity(s.opacity); setHue(s.hue); setEco(s.eco); setFocusOnly(s.focusOnly);
            setAutoNight(s.autoNight); setPreset(s.preset); setScan(s.scan); setFlick(s.flick);
            setJitter(s.jitter); setSmartTint(s.smartTint); setCustomStops(s.customStops||"");
          }catch{ alert("Invalid JSON"); }
        }}>Import Settings JSON</ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem layout="below" onClick={()=>{ document.getElementById(STYLE_ID)?.remove(); setEnabled(false); }}>Disable & Clear</ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
});
