import * as THREE from 'three';

export const canvas = document.querySelector('canvas.webgl');
export const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    logarithmicDepthBuffer: true,
});

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener('resize', () => {
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
