const canvas = document.getElementById('exoplanetCanvas');

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    preserveDrawingBuffer: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();

let exoplanet;
let cloudOverlays = []; 
let currentTextureUrl = 'textures/moon.jpg'; 
let cloudTextureUrl = 'textures/cloud.png'; 
let currentColor = '#0077ff'; 

function createExoplanet(size, textureUrl, color) {
    if (exoplanet) {
        scene.remove(exoplanet);
        exoplanet.geometry.dispose();
    }

    cloudOverlays.forEach(cloud => {
        scene.remove(cloud);
        cloud.geometry.dispose();
    });
    cloudOverlays = []; 

    textureLoader.load(textureUrl, (texture) => {
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ map: texture, color: color }); // Apply current color
        exoplanet = new THREE.Mesh(geometry, material);
        scene.add(exoplanet);

        if (document.getElementById('cloudToggle').checked) {
            const cloudLayers = [1.01, 1.02, 1.03];
            cloudLayers.forEach(scale => {
                textureLoader.load(cloudTextureUrl, (cloudTexture) => {
                    const cloudMaterial = new THREE.MeshStandardMaterial({
                        map: cloudTexture,
                        transparent: true,
                        opacity: 0.5
                    });
                    const cloudGeometry = new THREE.SphereGeometry(size * scale, 32, 32);
                    const cloudOverlay = new THREE.Mesh(cloudGeometry, cloudMaterial);
                    scene.add(cloudOverlay);
                    cloudOverlays.push(cloudOverlay); 
                });
            });
        }
    });
}

let initialSize = parseFloat(document.getElementById('sizeSlider').value);
createExoplanet(initialSize, currentTextureUrl, currentColor); 

document.getElementById('sizeSlider').addEventListener('input', (event) => {
    const newSize = parseFloat(event.target.value);
    createExoplanet(newSize, currentTextureUrl, currentColor); 
});

document.getElementById('colorPicker').addEventListener('input', (event) => {
    currentColor = event.target.value; 
    if (exoplanet) {
        exoplanet.material.color.set(currentColor); 
    }
});

document.getElementById('textureSelector').addEventListener('change', (event) => {
    currentTextureUrl = event.target.value; 
    createExoplanet(initialSize, currentTextureUrl, currentColor); 
});

document.getElementById('cloudToggle').addEventListener('change', (event) => {
    createExoplanet(initialSize, currentTextureUrl, currentColor); 
});

function animate() {
    requestAnimationFrame(animate);
    if (exoplanet) {
        exoplanet.rotation.y += 0.006; 
    }
    if (cloudOverlays.length > 0) {
        cloudOverlays.forEach(cloud => {
            cloud.rotation.y += 0.006; 
        });
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
