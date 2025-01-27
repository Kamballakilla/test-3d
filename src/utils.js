import * as THREE from 'three'

export function clearScene(scene) {
    while (scene.children.length) {
        scene.remove(scene.children[0])
    }
}

let currentClickHandler = null

export function setClickHandler(handler) {
    if (currentClickHandler) {
        console.log('Removing previous click handler')
        window.removeEventListener('click', currentClickHandler)
        currentClickHandler = null
    }

    if (typeof handler === 'function') {
        console.log('Setting new click handler')
        window.addEventListener('click', handler)
        currentClickHandler = handler
    } else {
        console.warn('Provided handler is not a function')
    }
}

export function loadTextures(path) {
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(path)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
}
