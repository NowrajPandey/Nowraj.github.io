import * as THREE from 'three';

// 1. Setup Scene
const container = document.getElementById('robot-canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181a1b); // Matches your secondary color

// 2. Setup Camera
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 2;

// 3. Setup Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// 4. Add a Cube (To test if rendering works)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // RED COLOR
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

// 6. Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
