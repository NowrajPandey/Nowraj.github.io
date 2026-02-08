import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('robot-canvas-container');
let scene, camera, renderer, model, head;

function init() {
    if (!container) return;

    scene = new THREE.Scene();

    // Lighting to match the "Professional/Clean" brand feel [cite: 1]
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    
    const frontLight = new THREE.DirectionalLight(0xffffff, 2);
    frontLight.position.set(0, 5, 10);
    scene.add(frontLight);

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    // Using the GLTF duck model as requested
    loader.load('https://vazxmixjsiawhamofrcs.supabase.co/storage/v1/object/public/models/duck/model.gltf', (gltf) => {
        model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.y = -1;
        scene.add(model);
        head = model; 
    }, undefined, (error) => {
        console.error('Error loading model:', error);
    });

    window.addEventListener('mousemove', (e) => {
        if (!head) return;
        
        const rect = container.getBoundingClientRect();
        // Mouse coordinates relative to the center of the container
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        // Smooth rotation
        head.rotation.y = x * 0.5;
        head.rotation.x = -y * 0.3;
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (!container || !renderer) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// Start initialization
init();
