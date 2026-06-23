"use client";
import { useEffect, useRef, useState } from "react";

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
      if (["geforce","quadro","radeon rx","radeon pro","tesla","arc a"].some(p=>r.includes(p))) return "high";
      if (r.includes("intel")||r.includes("amd")||r.includes("radeon")) return "medium";
    }
  } catch { return "low"; }
  if (cores<=2||(ram&&ram<=2)) return "low";
  if (cores>=8||(ram&&ram>=8)) return "high";
  return "medium";
}
const CONFIGS = {
  high:   { enable:true,  iter:15, fps:60, pr:2 },
  medium: { enable:true,  iter:10, fps:30, pr:1 },
  low:    { enable:false, iter:0,  fps:0,  pr:1 },
};

const VS = `precision mediump float;varying vec2 vUv;attribute vec2 a_position;void main(){vUv=0.5*(a_position+1.0);gl_Position=vec4(a_position,0.0,1.0);}`;

export default function NeuralNoise({ color=[0.4,0.1,0.9], speed=0.001 }) {
  const ref = useRef(null);
  const [tier, setTier] = useState("medium");
  useEffect(()=>{setTier(detectTier());},[]);

  useEffect(()=>{
    const canvas = ref.current;
    if (!canvas) return;
    const cfg = CONFIGS[tier];
    const pr = Math.min(window.devicePixelRatio||1, cfg.pr);
    if (!cfg.enable) return;

    const gl = canvas.getContext("webgl")||canvas.getContext("experimental-webgl");
    if (!gl) return;

    const N = cfg.iter;
    const ptr = {x:0.5,y:0.5,tX:0.5,tY:0.5};

    const FS = `precision mediump float;varying vec2 vUv;uniform float u_time,u_ratio,u_speed;uniform vec2 u_pointer_position;uniform vec3 u_color;vec2 rot(vec2 u,float t){return mat2(cos(t),sin(t),-sin(t),cos(t))*u;}float shape(vec2 uv,float t,float p){vec2 sa=vec2(0),res=vec2(0);float sc=8.0;for(int j=0;j<${N};j++){uv=rot(uv,1.0);sa=rot(sa,1.0);vec2 l=uv*sc+float(j)+sa-t;sa+=sin(l)+2.4*p;res+=(0.5+0.5*cos(l))/sc;sc*=1.2;}return res.x+res.y;}void main(){vec2 uv=0.5*vUv;uv.x*=u_ratio;vec2 pt=vUv-u_pointer_position;pt.x*=u_ratio;float p=0.5*pow(1.0-clamp(length(pt),0.0,1.0),2.0);float n=shape(uv,u_speed*u_time,p);n=1.2*pow(n,3.0)+pow(n,10.0);n=max(0.0,n-0.5)*(1.0-length(vUv-0.5));gl_FragColor=vec4(u_color*n,n);}`;

    const mkS=(src,type)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;};
    const vs=mkS(VS,gl.VERTEX_SHADER), fs=mkS(FS,gl.FRAGMENT_SHADER);
    if(!vs||!fs) return;

    const prog=gl.createProgram();
    gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);

    const buf=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    gl.useProgram(prog);
    const pos=gl.getAttribLocation(prog,"a_position");
    gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);

    const u={time:gl.getUniformLocation(prog,"u_time"),ratio:gl.getUniformLocation(prog,"u_ratio"),ptr:gl.getUniformLocation(prog,"u_pointer_position"),color:gl.getUniformLocation(prog,"u_color"),speed:gl.getUniformLocation(prog,"u_speed")};
    gl.uniform3f(u.color,color[0],color[1],color[2]);
    gl.uniform1f(u.speed,speed);

    const resize=()=>{canvas.width=window.innerWidth*pr;canvas.height=window.innerHeight*pr;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(u.ratio,canvas.width/canvas.height);};
    resize();
    window.addEventListener("resize",resize);
    window.addEventListener("pointermove",e=>{ptr.tX=e.clientX;ptr.tY=e.clientY;});
    window.addEventListener("touchmove",e=>{if(e.targetTouches[0]){ptr.tX=e.targetTouches[0].clientX;ptr.tY=e.targetTouches[0].clientY;}});

    const INT=1000/cfg.fps;let id,last=0;
    const render=(now=0)=>{id=requestAnimationFrame(render);if(now-last<INT)return;last=now;ptr.x+=(ptr.tX-ptr.x)*0.2;ptr.y+=(ptr.tY-ptr.y)*0.2;gl.uniform1f(u.time,now);gl.uniform2f(u.ptr,ptr.x/window.innerWidth,1-ptr.y/window.innerHeight);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);};
    id=requestAnimationFrame(render);

    const onVis=()=>{if(document.hidden)cancelAnimationFrame(id);else id=requestAnimationFrame(render);};
    document.addEventListener("visibilitychange",onVis);

    return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);document.removeEventListener("visibilitychange",onVis);};
  },[tier]);

  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}
