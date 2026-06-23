"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

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
  high:   { enableShader: true,  iterations: 35, octaves: 3, fps: 60, pixelRatio: 2 },
  medium: { enableShader: true,  iterations: 20, octaves: 2, fps: 30, pixelRatio: 1 },
  low:    { enableShader: false, iterations: 0,  octaves: 0, fps: 0,  pixelRatio: 1 },
};

export default function AuroraShaderBG() {
  const containerRef = useRef(null);
  const [tier, setTier] = useState("medium");

  useEffect(() => { setTier(detectTier()); }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const config = CONFIGS[tier];
    const pr = Math.min(window.devicePixelRatio || 1, config.pixelRatio);

    if (!config.enableShader) {
      container.style.background =
        "radial-gradient(ellipse at 20% 80%, rgba(0,212,255,0.1) 0%, transparent 55%), " +
        "radial-gradient(ellipse at 80% 20%, rgba(124,92,252,0.08) 0%, transparent 55%)";
      return;
    }

    const w = container.offsetWidth || window.innerWidth;
    const h = container.offsetHeight || window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h);
    Object.assign(renderer.domElement.style, {
      position: "absolute", inset: "0", width: "100%", height: "100%", display: "block",
    });
    container.appendChild(renderer.domElement);

    const ITER = config.iterations;
    const OCT = config.octaves;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(w, h) },
      },
      vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        #define NUM_OCTAVES ${OCT}
        float rand(vec2 n){return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);}
        float noise(vec2 p){
          vec2 ip=floor(p),u=fract(p);u=u*u*(3.0-2.0*u);
          return mix(mix(rand(ip),rand(ip+vec2(1,0)),u.x),mix(rand(ip+vec2(0,1)),rand(ip+vec2(1,1)),u.x),u.y);
        }
        float fbm(vec2 x){
          float v=0.0,a=0.3;vec2 shift=vec2(100);
          mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
          for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}
          return v;
        }
        void main(){
          vec2 shake=vec2(sin(iTime*1.2)*0.005,cos(iTime*2.1)*0.005);
          vec2 p=((gl_FragCoord.xy+shake*iResolution.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.,-4.,4.,6.);
          vec2 v;vec4 o=vec4(0.0);
          float f=2.0+fbm(p+vec2(iTime*5.0,0.0))*0.5;
          float maxI=${ITER}.0;
          for(float i=0.0;i<${ITER}.0;i++){
            v=p+cos(i*i+(iTime+p.x*0.08)*0.025+i*vec2(13.,11.))*3.5+vec2(sin(iTime*3.0+i)*0.003,cos(iTime*3.5-i)*0.003);
            float tn=fbm(v+vec2(iTime*0.5,i))*0.3*(1.0-(i/maxI));
            vec4 col=vec4(0.1+0.3*sin(i*0.2+iTime*0.4),0.3+0.5*cos(i*0.3+iTime*0.5),0.7+0.3*sin(i*0.4+iTime*0.3),1.0);
            o+=col*exp(sin(i*i+iTime*0.8))/length(max(v,vec2(v.x*f*0.015,v.y*1.5)))*(1.0+tn*0.8)*smoothstep(0.,1.,i/maxI)*0.6;
          }
          o=tanh(pow(o/100.0,vec4(1.6)));
          gl_FragColor=o*1.5;
        }
      `,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    const INTERVAL = 1000 / config.fps;
    let frameId, last = 0;
    const animate = (ts) => {
      frameId = requestAnimationFrame(animate);
      if (ts - last < INTERVAL) return;
      last = ts;
      material.uniforms.iTime.value += INTERVAL / 1000;
      renderer.render(scene, camera);
    };
    frameId = requestAnimationFrame(animate);

    const onVis = () => { if (document.hidden) cancelAnimationFrame(frameId); else frameId = requestAnimationFrame(animate); };
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => { const w2=container.offsetWidth,h2=container.offsetHeight; renderer.setSize(w2,h2); material.uniforms.iResolution.value.set(w2,h2); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      material.dispose(); renderer.dispose();
    };
  }, [tier]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}
