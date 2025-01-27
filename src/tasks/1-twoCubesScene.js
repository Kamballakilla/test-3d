import * as THREE from 'three'
import { setClickHandler, clearScene } from '../utils'
import { camera } from '../camera'

export function createSceneWithTwoCubes(scene) {
    clearScene(scene)
    camera.position.set(0, 1.5, 5)

    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })

    const geometry = new THREE.BoxGeometry()

    const cube1 = new THREE.Mesh(geometry, material1)
    const cube2 = new THREE.Mesh(geometry, material2)

    cube1.position.set(-1.5, 0, 0)
    cube2.position.set(1.5, 0, 0)

    scene.add(cube1, cube2)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function randomizeCubeProperties(cube) {
        cube.scale.set(
            Math.random() * 2 + 0.5,
            Math.random() * 2 + 0.5,
            Math.random() * 2 + 0.5
        )
        cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        )
        cube.material.color.set(Math.random() * 0xffffff)
    }

    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([cube1, cube2])

        if (intersects.length > 0) {
            randomizeCubeProperties(intersects[0].object)
        }
    }

    setClickHandler(onMouseClick)
}
