import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('robot-canvas-container');

// Scene Setup
const scene = new THREE.Scene();
// No background color set here so it uses the CSS background (transparent)

// Camera
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 2, 8); // Moved camera up and back slightly
camera.lookAt(0, 1, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Load Robot
let robot, neck;
const loader = new GLTFLoader();

// Using the standard "RobotExpressive" model which is reliable and interactive
loader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/RobotExpressive/RobotExpressive.glb', 
    (gltf) => {
        robot = gltf.scene;
        robot.scale.set(0.5, 0.5, 0.5); // Adjust scale to fit box
        robot.position.y = -2; // Move down to center in box
        scene.add(robot);

        // Try to find the Neck bone for rotation
        robot.traverse((child) => {
            if (child.isBone && child.name === 'Neck') {
                neck = child;
            }
        });
        
        console.log("Robot loaded!");
    }, 
    undefined, 
    (error) => {
        console.error('An error happened loading the robot:', error);
    }
);

// Mouse Interaction
window.addEventListener('mousemove', (e) => {
    if (!neck) return;
    
    const rect = container.getBoundingClientRect();
    // Get mouse position relative to the container (-1 to +1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Limit rotation so he doesn't break his neck
    const moveX = x * 0.8; 
    const moveY = y * 0.5;

    neck.rotation.y = moveX;
    neck.rotation.x = -moveY;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
