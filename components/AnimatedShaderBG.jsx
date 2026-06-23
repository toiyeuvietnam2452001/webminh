"use client";
import { useEffect, useRef, useState } from "react";

/* ── Performance Detection ── */
function detectTier() {
  if (typeof window === "undefined") return "medium";
  if (/Mobi|Android/i.test(navigator.userAgent)) return "low";
  const cores = navigator.hardwareConcurrency || 4;
  const ram = navigator.deviceMemory;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return "low";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const r = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase();
      if (r.includes("apple")) return "high";
      if (["geforce","quadro","radeon rx","radeon pro","tesla","arc a"].some(p => r.includes(p))) return "high";
      if (r.includes("intel") || r.includes("amd") || r.includes("radeon")) return "medium";
    }
  } catch { return "low"; }
  if (cores <= 2 || (ram && ram <= 2)) return "low";
  if (cores >= 8 || (ram && ram >= 8)) return "high";
  return "medium";
}
const CONFIGS = {
  high:   { enableShader: true,  fbmIter: 5,  mainIter: 12, fps: 60, pixelRatio: 2 },
  medium: { enableShader: true,  fbmIter: 3,  mainIter: 8,  fps: 30, pixelRatio: 1 },
  low:    { enableShader: false, fbmIter: 0,  mainIter: 0,  fps: 0,  pixelRatio: 1 },
};

const VS = `#version 300 es
precision highp float;
in vec4 position;
void main(){ gl_Position = position; }`;

export default function AnimatedShaderBG() {
  const canvasRef = useRef(null);
  const [tier, setTier] = useState("medium");

  useEffect(() => { setTier(detectTier()); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const config = CONFIGS[tier];
    const pr = Math.min(window.devicePixelRatio || 1, config.pixelRatio);

    if (!config.enableShader) {
      canvas.style.background = "linear-gradient(135deg, #000814 0%, #001845 50%, #002855 100%)";
      return;
    }

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const FBM = config.fbmIter;
    const MAIN = config.mainIter;

    const FS = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2
