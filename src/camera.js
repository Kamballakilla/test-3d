import * as THREE from 'three';

export const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 5000);
camera.position.set(0, 0, 20);
camera.updateProjectionMatrix();

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
});
