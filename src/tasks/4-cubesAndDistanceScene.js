import * as THREE from 'three'
import { setClickHandler, clearScene } from '../utils'
import { camera } from '../camera'

export function createSceneWithCubesAndDistance(scene) {
    clearScene(scene)
    camera.position.set(0, 1.5, 5)

    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })

    const geometry = new THREE.BoxGeometry(1, 1, 1)

    const cube1 = new THREE.Mesh(geometry, material1)
    cube1.name = '1'
    const cube2 = new THREE.Mesh(geometry, material2)
    cube2.name = '2'

    cube1.position.set(-1.5, 0, 0)
    cube2.position.set(1.5, 0, 0)

    scene.add(cube1)
    scene.add(cube2)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([cube1, cube2])

        if (intersects.length > 0) {
            const intersect = intersects[0]
            const point = intersect.point
            const object = intersect.object

            const center = object.getWorldPosition(new THREE.Vector3())
            const distance = point.distanceTo(center)

            if (object === cube1) {
                const newSize = distance
                cube2.geometry.dispose()
                cube2.geometry = new THREE.BoxGeometry(
                    newSize,
                    newSize,
                    newSize
                )
            } else if (object === cube2) {
                const newSize = distance
                cube1.geometry.dispose()
                cube1.geometry = new THREE.BoxGeometry(
                    newSize,
                    newSize,
                    newSize
                )
            }
        }
    }

    setClickHandler(onMouseClick)
}
