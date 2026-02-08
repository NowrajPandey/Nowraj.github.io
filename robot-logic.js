import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('robot-canvas-container');
let scene, camera, renderer, model, neck, skeleton;

function init() {
    scene = new THREE.Scene();
    
    // Camera Setup
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);

    // Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting (Matching your dark theme)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Load Robot Model
    const loader = new GLTFLoader();
    // Using a placeholder robot model - you can replace this URL with your own .glb file
    loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb', (gltf) => {
        model = gltf.scene;
        model.scale.set(0.4, 0.4, 0.4);
        model.position.y = -1;
        scene.add(model);
        
        // Find the 'Head' or 'Neck' bone for the "Look At" effect
        model.traverse((node) => {
            if (node.isBone && (node.name === 'Head' || node.name === 'Neck')) {
                neck = node;
            }
        });
    });

    window.addEventListener('mousemove', onMouseMove);
    animate();
}

function onMouseMove(event) {
    if (!neck) return;

    // Convert mouse position to -1 to +1 range
    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Subtle rotation limits so the head doesn't snap 360 degrees
    neck.rotation.y = x * 0.5; 
    neck.rotation.x = -y * 0.3;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

init();
