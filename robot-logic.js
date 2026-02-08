import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("robot-canvas-container");

const scene = new THREE.Scene();

// CAMERA: Adjusted to center the robot better
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000,
);
camera.position.set(0, 0, 8); // Moved back slightly

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
topLight.position.set(5, 5, 5);
scene.add(topLight);

let robot, neck;
// Target rotations applied to the neck bone (radians)
const targetNeck = { x: 0, y: 0 };
const loader = new GLTFLoader();

// Using the standard GLB model
loader.load("./Assets/my-robot.glb", (gltf) => {
  robot = gltf.scene;
  robot.scale.set(0.7, 0.7, 0.7);
  robot.position.y = -2; // Centers him vertically in the box
  scene.add(robot);

  // Apply brand-appropriate tint + material tweaks and find the neck bone
  robot.traverse((child) => {
    if (child.isBone && child.name === "Neck") neck = child;

    if (child.isMesh) {
      const applyToMaterial = (mat) => {
        try {
          // Brand accent color (#6d767e) as subtle robot tint
          mat.color && mat.color.setHex(0x6d767e);
          mat.metalness =
            mat.metalness !== undefined ? mat.metalness * 0.8 + 0.4 : 0.4;
          mat.roughness =
            mat.roughness !== undefined ? Math.max(mat.roughness, 0.5) : 0.6;
          // Make eyes glow slightly if mesh name suggests eyes
          if (child.name && child.name.toLowerCase().includes("eye")) {
            mat.emissive && mat.emissive.setHex(0xeaedf0);
            mat.emissiveIntensity = 0.6;
            mat.roughness = 0.2;
          }
          mat.needsUpdate = true;
        } catch (e) {
          // If material doesn't support these props, ignore
        }
      };

      if (Array.isArray(child.material))
        child.material.forEach(applyToMaterial);
      else applyToMaterial(child.material);
    }
  });
});

function animate() {
  requestAnimationFrame(animate);
  // Smoothly interpolate neck rotation toward target if available
  if (neck) {
    // clamp small target values to avoid unnatural poses
    const lerp = (a, b, t) => a + (b - a) * t;
    neck.rotation.x = lerp(neck.rotation.x, targetNeck.x, 0.08);
    neck.rotation.y = lerp(neck.rotation.y, targetNeck.y, 0.08);
  }

  renderer.render(scene, camera);
}
animate();

// Resizer fix: Keeps the robot from "stretching" when you resize the window
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Cursor-following: map pointer position inside container to small neck rotations
container.addEventListener("mousemove", (e) => {
  const rect = container.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width; // 0..1
  const y = (e.clientY - rect.top) / rect.height; // 0..1

  // Map to target angles (radians). X -> yaw (left/right), Y -> pitch (up/down)
  const yaw = (x - 0.5) * 1.2; // -0.6 .. 0.6
  const pitch = -(y - 0.5) * 0.8; // -0.4 .. 0.4 (invert so top of screen looks up)

  // gentle smoothing targets
  targetNeck.y = THREE.MathUtils.clamp(yaw, -0.6, 0.6);
  targetNeck.x = THREE.MathUtils.clamp(pitch, -0.4, 0.4);
});

// Optional: reset to center when pointer leaves
container.addEventListener("mouseleave", () => {
  targetNeck.x = 0;
  targetNeck.y = 0;
});
