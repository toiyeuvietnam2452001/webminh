"use client";
import { useEffect, useRef, useState } from "react";

import React, { useEffect, useState } from "react";

/* ── Performance Detection ── */
function detectTier() {
  if (typeof window === "undefined") return "medium";
  if (/Mobi|Android/i.test(navigator.userAgent)) return "low";
  const cores = navigator.hardwareConcurrency || 4;
  const ram   = navigator.deviceMemory;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return "low";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const r = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase();
      if (r.includes("apple")) return "high";
      if (["geforce","quadro","radeon rx","radeon pro","tesla","arc a"].some(p=>r.includes(p))) return "high";
      if (r.includes("intel")||r.includes("amd")||r.includes("radeon")) return "medium";
    }
  } catch { return "low"; }
  if (cores<=2||(ram&&ram<=2)) return "low";
  if (cores>=8||(ram&&ram>=8)) return "high";
  return "medium";
}
const CONFIGS = {
  high:   { enableShader:true,  iterations:35, octaves:3, fbmIter:5,  mainIter:12, neuralIter:15, fps:60, pixelRatio:2 },
  medium: { enableShader:true,  iterations:20, octaves:2, fbmIter:3,  mainIter:8,  neuralIter:10, fps:30, pixelRatio:1 },
  low:    { enableShader:false, iterations:0,  octaves:0, fbmIter:0,  mainIter:0,  neuralIter:0,  fps:0,  pixelRatio:1 },
};
function usePerformance() {
  const [tier, setTier] = useState("medium");
  useEffect(() => { setTier(detectTier()); }, []);
  const config = CONFIGS[tier];
  const pr = Math.min(typeof window!=="undefined"?window.devicePixelRatio:1, config.pixelRatio);
  return { tier, config, pixelRatio: pr };
}


export default function AnimatedShaderBG() {
  const canvasRef = useRef(null);
  const { tier, config, pixelRatio } = usePerformance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Máy yếu → CSS gradient đơn giản
    if (!config.enableShader) {
      canvas.style.background =
        "linear-gradient(135deg, #000814 0%, #001845 50%, #002855 100%)";
      return;
    }

    const gl = canvas.getContext("webgl2");
    if (!gl) { console.warn("WebGL2 not supported"); return; }

    const FBM  = config.fbmIter;   // 5 | 3
    const MAIN = config.mainIter;  // 12 | 8

    const VS = `#version 300 es
precision highp float;
in vec4 position;
void main(){ gl_Position = position; }`;

    const FS = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<${FBM};i++){t+=a*noise(p);p*=2.*m;a*=.5;}
  return t;
}
float clouds(vec2 p){
  float d=1.,t=.0;
  for(float i=.0;i<3.;i++){
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);d=a;p*=2./(i+1.);
  }
  return t;
}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for(float i=1.;i<${MAIN}.0;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;

    const mkShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s)); return null;
      }
      return s;
    };

    const vs = mkShader(gl.VERTEX_SHADER, VS);
    const fs = mkShader(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, "resolution");
    const uTime = gl.getUniformLocation(prog, "time");

    const resize = () => {
      canvas.width  = window.innerWidth  * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Cap framerate theo tier
    const INTERVAL = 1000 / config.fps;
    let animId, last = 0;

    const render = (now = 0) => {
      animId = requestAnimationFrame(render);
      if (now - last < INTERVAL) return;
      last = now;
      gl.uniform1f(uTime, now * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    animId = requestAnimationFrame(render);

    // Dừng khi chuyển tab
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [tier]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
