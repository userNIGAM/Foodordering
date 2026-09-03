import React, { useRef } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// Custom ripple shader
const WaterShaderMaterial = shaderMaterial(
  {
    u_time: 0,
    u_mouse: new THREE.Vector2(0, 0),
    u_resolution: new THREE.Vector2(1, 1),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  // Fragment shader
  `
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      // distance from cursor
      vec2 mouse = u_mouse;
      float dist = distance(uv, mouse);

      // Multiple ripple layers for more realistic water effect
      float ripple1 = sin(15.0 * dist - u_time * 6.0);
      float ripple2 = sin(8.0 * dist - u_time * 4.0 + 1.0);
      float ripple3 = sin(12.0 * dist - u_time * 7.0 + 2.0);
      
      // Combine ripples with different intensities
      float combinedRipple = (ripple1 * 0.4 + ripple2 * 0.3 + ripple3 * 0.3);
      
      // Enhanced fade with distance for more natural look
      float fade = exp(-dist * 8.0) * (1.0 - smoothstep(0.0, 0.3, dist));
      
      // Apply fade to combined ripple
      combinedRipple *= fade;

      // Create water-like color that complements indigo background
      // Base water color with slight transparency
      vec3 baseColor = vec3(0.15, 0.25, 0.75); // Deep blue
      
      // Ripple highlights in lighter blue/white
      vec3 rippleColor = vec3(0.4, 0.6, 0.9) + combinedRipple * 0.3;
      
      // Mix base and ripple colors
      vec3 finalColor = mix(baseColor, rippleColor, abs(combinedRipple) * 0.8);
      
      // Add subtle wave pattern across the entire surface
      float wave = sin(uv.x * 20.0 + u_time * 2.0) * 0.02;
      finalColor += wave;

      gl_FragColor = vec4(finalColor, 0.6); // Semi-transparent for overlay effect
    }
  `
);

extend({ WaterShaderMaterial });

const WaterPlane = () => {
  const materialRef = useRef();
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (materialRef.current)
      materialRef.current.u_time = clock.getElapsedTime();
  });

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height; // flip y
    if (materialRef.current) materialRef.current.u_mouse.set(x, y);
  };

  return (
    <mesh onPointerMove={handleMouseMove}>
      <planeGeometry args={[100, 100, 1, 1]} />
      <waterShaderMaterial ref={materialRef} />
    </mesh>
  );
};

const WaterBackground = () => {
  return (
    <Canvas
      className="absolute inset-0 z-0"
      orthographic
      camera={{ zoom: 20, position: [0, 0, 10] }}
      style={{ pointerEvents: 'auto' }}
    >
      <WaterPlane />
    </Canvas>
  );
};

export default WaterBackground;
