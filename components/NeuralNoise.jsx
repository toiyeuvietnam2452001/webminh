"use client";
import { useEffect, useRef, useState } from "react";

function detectTier() {
  if (typeof window === "undefined") return null;
  const isMob = /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 4;
  const ram = navigator.deviceMemory;
  try {
    const gl = document.createElement("canvas").getContext("webgl") ||
      document.createElement("canvas").getContext("experimental-webgl");
    if (!gl) return "low";
    if (isMob) return "mobile"; // Mobile có WebGL → dùng settings nhẹ
    const gl2 = document.createElement("canvas").getContext("webgl2");
    if (!gl2) return "medium";
    const ext = gl2.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const r = gl2.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase();
      if (r.includes("apple")) return "high";
      if (["geforce", "quadro", "radeon rx", "radeon pro", "tesla", "arc a"].some(p => r.includes(p))) return "high";
      if (r.includes("intel") || r.includes("amd") || r.includes("radeon")) return "medium";
    }
  } catch { return "low"; }
  if (cores <= 2 || (ram && ram <= 2)) return "low";
  if (cores >= 8 || (ram && ram >= 8)) return "high";
  return "medium";
}

const CONFIGS = {
  high: { neuralIter: 15, fps: 60, pixelRatio: 2 },
  medium: { neuralIter: 10, fps: 30, pixelRatio: 1.5 },
  mobile: { neuralIter: 7, fps: 30, pixelRatio: 1 },
  low: null,
};

function MobileNeuralBG() {
  return <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 65% 35%, #00a8d4 0%, #004d70 30%, #001a28 65%, #000810 100%)", pointerEvents: "none" }} />;
}

export default function NeuralNoise({ color = [0.0, 0.72, 1.0], speed = 0.001 }) {
  const canvasRef = useRef(null);
  const [tier, setTier] = useState(null);
  useEffect(() => { setTier(detectTier()); }, []);
  if (tier === null) return null;
  if (tier === "low" || !CONFIGS[tier]) return <MobileNeuralBG />;
  return <NeuralWebGL canvasRef={canvasRef} tier={tier} color={color} speed={speed} />;
}

function NeuralWebGL({ canvasRef, tier, color, speed }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const config = CONFIGS[tier];
    const pr = Math.min(window.devicePixelRatio || 1, config.pixelRatio);
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;
    const ITER = config.neuralIter;
    const pointer = { x: 0.5, y: 0.5, tX: 0.5, tY: 0.5 };
    const vsSource = `precision mediump float;varying vec2 vUv;attribute vec2 a_position;void main(){vUv=0.5*(a_position+1.0);gl_Position=vec4(a_position,0.0,1.0);}`;
    const fsSource = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      varying vec2 vUv;
      uniform float u_time,u_ratio,u_speed;
      uniform vec2 u_pointer_position;
      uniform vec3 u_color;
      vec2 rot(vec2 uv,float th){return mat2(cos(th),sin(th),-sin(th),cos(th))*uv;}
      float shape(vec2 uv,float t,float p){
        vec2 sa=vec2(0),res=vec2(0);float sc=8.0;
        for(int j=0;j<${ITER};j++){
          uv=rot(uv,1.0);sa=rot(sa,1.0);
          vec2 l=uv*sc+float(j)+sa-t;
          sa+=sin(l)+2.4*p;res+=(0.5+0.5*cos(l))/sc;sc*=1.2;
        }
        return res.x+res.y;
      }
      void main(){
        vec2 uv=0.5*vUv;uv.x*=u_ratio;
        vec2 pt=vUv-u_pointer_position;pt.x*=u_ratio;
        float p=0.5*pow(1.0-clamp(length(pt),0.0,1.0),2.0);
        float n=shape(uv,u_speed*u_time,p);
        n=1.2*pow(n,3.0)+pow(n,10.0);
        n=max(0.0,n-0.5)*(1.0-length(vUv-0.5));
        gl_FragColor=vec4(u_color*n*1.5,n);
      }
    `;
    const mkS = (src, type) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = mkS(vsSource, gl.VERTEX_SHADER);
    const fs = mkS(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(prog);
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const u = {
      time: gl.getUniformLocation(prog, "u_time"),
      ratio: gl.getUniformLocation(prog, "u_ratio"),
      ptr: gl.getUniformLocation(prog, "u_pointer_position"),
      color: gl.getUniformLocation(prog, "u_color"),
      spd: gl.getUniformLocation(prog, "u_speed"),
    };
    gl.uniform3f(u.color, color[0], color[1], color[2]);
    gl.uniform1f(u.spd, speed);
    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = w * pr; canvas.height = h * pr;
      gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform1f(u.ratio, canvas.width / canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    const onMove = e => { pointer.tX = e.clientX; pointer.tY = e.clientY; };
    const onTouch = e => { if (e.touches[0]) { pointer.tX = e.touches[0].clientX; pointer.tY = e.touches[0].clientY; } };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    let id;
    const render = (now = 0) => {
      id = requestAnimationFrame(render);
      pointer.x += (pointer.tX - pointer.x) * 0.2; pointer.y += (pointer.tY - pointer.y) * 0.2;
      gl.uniform1f(u.time, now * 0.001); gl.uniform2f(u.ptr, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    id = requestAnimationFrame(render);
    const onVis = () => { if (document.hidden) cancelAnimationFrame(id); else id = requestAnimationFrame(render); };
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); window.removeEventListener("touchmove", onTouch); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}
