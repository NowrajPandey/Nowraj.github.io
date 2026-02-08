import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('robot-canvas-container');
let scene, camera, renderer, model, head;

function init() {
    scene = new THREE.Scene();

    // Lighting to match the "Professional/Clean" brand feel
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    
    const frontLight = new THREE.DirectionalLight(0xffffff, 2);
    frontLight.position.set(0, 5, 10);
    scene.add(frontLight);

    camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    // Using a clean, floating robot head model
    loader.load('https://vazxmixjsiawhamofrcs.supabase.co/storage/v1/object/public/models/duck/model.gltf', (gltf) => {
        model = gltf.scene;
        // Adjust scale/position to center it in the box
        model.scale.set(2, 2, 2);
        model.position.y = -1;
        scene.add(model);
        head = model; // In this simple model, we rotate the whole thing
    });

    window.addEventListener('mousemove', (e) => {
        if (!head) return;
        
        // Calculate mouse position relative to the container
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        // Smooth rotation logic
        head.rotation.y = x * 0.5;
        head.rotation.x = -y * 0.4;
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Ensure it resizes correctly
window.onresize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
};

init();
