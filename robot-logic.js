import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('robot-canvas-container');

const scene = new THREE.Scene();

// CAMERA: Adjusted to center the robot better
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 8); // Moved back slightly

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const topLight = new THREE.DirectionalLight(0xffffff, 2);
topLight.position.set(5, 5, 5);
scene.add(topLight);

let robot, neck;
const loader = new GLTFLoader();

// Using the standard GLB model
loader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/RobotExpressive/RobotExpressive.glb', 
    (gltf) => {
        robot = gltf.scene;
        robot.scale.set(0.7, 0.7, 0.7);
        robot.position.y = -2; // Centers him vertically in the box
        scene.add(robot);

        robot.traverse((child) => {
            if (child.isBone && child.name === 'Neck') neck = child;
        });
    }
);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Resizer fix: Keeps the robot from "stretching" when you resize the window
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
