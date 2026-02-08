import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('robot-canvas-container');

// 1. Scene Setup
const scene = new THREE.Scene();
// NOTE: We do NOT set scene.background here. 
// This allows the CSS background (#181a1b) to show through.

// 2. Camera Setup
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 1.5, 6); // Positioned to look at the robot face-on
camera.lookAt(0, 1.5, 0);

// 3. Renderer Setup (Transparent)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // High quality but performant
container.appendChild(renderer.domElement);

// 4. Lighting (Professional Studio Light)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Soft white light
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 5);
spotLight.position.set(5, 10, 7);
spotLight.angle = 0.5;
spotLight.penumbra = 1;
scene.add(spotLight);

// 5. Load the Robot
let robot, neck, waist;
const loader = new GLTFLoader();

// Loading a high-quality robot model
loader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/RobotExpressive/RobotExpressive.glb', 
    (gltf) => {
        robot = gltf.scene;
        
        // Adjust these numbers to fit the robot inside your 500px box
        robot.scale.set(0.6, 0.6, 0.6); 
        robot.position.y = -2.5; // Move down so feet are at bottom
        
        scene.add(robot);

        // Find bones to animate (Neck and Waist)
        robot.traverse((child) => {
            if (child.isBone) {
                if (child.name === 'Neck') neck = child;
                if (child.name === 'Spine') waist = child;
            }
        });
    },
    undefined,
    (error) => {
        console.error('Error loading robot:', error);
    }
);

// 6. Mouse Interaction (The "Look At" Effect)
window.addEventListener('mousemove', (e) => {
    if (!neck || !waist) return;
    
    const rect = container.getBoundingClientRect();
    
    // Check if mouse is actually near the robot container
    const isHovering = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

    if (isHovering) {
        // Calculate mouse position (-1 to +1)
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Smoothly rotate neck and waist
        // We use Math.PI to convert degrees to radians
        neck.rotation.y = x * 0.5;  // Look left/right
        neck.rotation.x = -y * 0.5; // Look up/down
        waist.rotation.y = x * 0.2; // Slight body turn
    }
});

// 7. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// 8. Handle Window Resize
window.addEventListener('resize', () => {
    if (container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
});
