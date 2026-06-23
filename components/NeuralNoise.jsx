"use client";
import { useEffect, useRef } from "react";
import { usePerformance } from "@/hooks/usePerformance";

export default function NeuralNoise({
  color = [0.4, 0.1, 0.9],
  speed = 0.001,
}) {
  const canvasRef = useRef(null);
  const { tier, config, pixelRatio } = usePerformance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Máy yếu → ẩn component này hoàn toàn
    if (!config.enableShader) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const ITER = config.neuralIter; // 15 | 10

    const pointer = { x: 0.5, y: 0.5, tX: 0.5, tY: 0.5 };

    const vsSource = `
      precision mediump float;
      varying vec2 vUv;
      attribute vec2 a_position;
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform vec3 u_color;
      uniform float u_speed;
      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = 8.0;
        for (int j = 0; j < ${ITER}; j++) {
          uv = rotate(uv, 1.0);
          sine_acc = rotate(sine_acc, 1.0);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.2;
        }
        return res.x + res.y;
      }
      void main() {
        vec2 uv = 0.5 * vUv;
        uv.x *= u_ratio;
        vec2 ptr = vUv - u_pointer_position;
        ptr.x *= u_ratio;
        float p = clamp(length(ptr), 0.0, 1.0);
        p = 0.5 * pow(1.0 - p, 2.0);
        float t = u_speed * u_time;
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.0);
        noise += pow(noise, 10.0);
        noise = max(0.0, noise - 0.5);
        noise *= (1.0 - length(vUv - 0.5));
        vec3 col = u_color * noise;
        gl_FragColor = vec4(col, noise);
      }
    `;

    const mkShader = (src, type) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s)); return null;
      }
      return s;
    };

    const vs = mkShader(vsSource, gl.VERTEX_SHADER);
    const fs = mkShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    gl.useProgram(prog);

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      time:    gl.getUniformLocation(prog, "u_time"),
      ratio:   gl.getUniformLocation(prog, "u_ratio"),
      pointer: gl.getUniformLocation(prog, "u_pointer_position"),
      color:   gl.getUniformLocation(prog, "u_color"),
      speed:   gl.getUniformLocation(prog, "u_speed"),
    };

    gl.uniform3f(u.color, color[0], color[1], color[2]);
    gl.uniform1f(u.speed, speed);

    const resize = () => {
      canvas.width  = window.innerWidth  * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(u.ratio, canvas.width / canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove  = (e) => { pointer.tX = e.clientX; pointer.tY = e.clientY; };
    const onTouch = (e) => { if (e.targetTouches[0]) { pointer.tX = e.targetTouches[0].clientX; pointer.tY = e.targetTouches[0].clientY; } };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("touchmove", onTouch);

    // Cap framerate theo tier
    const INTERVAL = 1000 / config.fps;
    let animId, last = 0;

    const render = (now = 0) => {
      animId = requestAnimationFrame(render);
      if (now - last < INTERVAL) return;
      last = now;
      pointer.x += (pointer.tX - pointer.x) * 0.2;
      pointer.y += (pointer.tY - pointer.y) * 0.2;
      gl.uniform1f(u.time, now);
      gl.uniform2f(u.pointer, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);
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
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
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
