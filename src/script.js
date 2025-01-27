import './style.css'
import * as THREE from 'three'
import { setupGUI } from './GUI.js';
import { scene, camera, renderer, controls } from './init.js';
import { clearScene } from './utils.js';

import { createSceneWithTwoCubes } from './tasks/1-twoCubesScene.js';
import { createSceneWithCubesAndLines } from './tasks/2-cubesAndLinesScene.js';
import { createSceneWithCubesAndCenterLines } from './tasks/3-centerLinesScene.js';
import { createSceneWithCubesAndDistance } from './tasks/4-cubesAndDistanceScene.js'
import { createSceneWithThreeCubes } from './tasks/5-threeCubesScene.js'
import { createSceneWithPlaneAndCircle } from './tasks/6-planeAndCircleScene.js'
import { createSceneWithLandscape } from './tasks/7-createTerrainScene.js'
import { createPlaneWithHexagons } from './tasks/8-planeWithHexagonsScene.js'


scene.add(camera);

setupGUI({
    createSceneWithTwoCubes: () => createSceneWithTwoCubes(scene),
    createSceneWithCubesAndLines: () => createSceneWithCubesAndLines(scene),
    createSceneWithCubesAndCenterLines: () => createSceneWithCubesAndCenterLines(scene),
    createSceneWithCubesAndDistance: () => createSceneWithCubesAndDistance(scene),
    createSceneWithThreeCubes: () => createSceneWithThreeCubes(scene),
    createSceneWithPlaneAndCircle: () => createSceneWithPlaneAndCircle(scene),
    createSceneWithLandscape: () => createSceneWithLandscape(scene),
    createPlaneWithHexagons: () => createPlaneWithHexagons(scene),
    clearScene: () => clearScene(scene),
});


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};



window.addEventListener('resize', () => {
    // Обновление размеров
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Обновление камеры
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Обновление рендерера
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const clock = new THREE.Clock()

const tick = () => {
    // для анимации
    const elapsedTime = clock.getElapsedTime()

    console.log(camera.position)

    // Обновление контроля
    controls.update()

    // Рендер
    renderer.render(scene, camera)

    // Вызов tick каждые 1/60 с.
    window.requestAnimationFrame(tick)
}

tick()
