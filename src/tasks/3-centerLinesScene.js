import * as THREE from 'three'
import { setClickHandler, clearScene } from '../utils'
import { camera } from '../camera'

export function createSceneWithCubesAndCenterLines(scene) {
    clearScene(scene)
    camera.position.set(0, 1.5, 6)

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
            const direction = center.clone().sub(point).normalize()

            const lineLength = 1.5

            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xff0000,
            })
            const lineGeometry = new THREE.BufferGeometry()

            const startPoint = point.clone()
            const endPoint = startPoint
                .clone()
                .add(direction.multiplyScalar(lineLength))
            const reverseEndPoint = startPoint
                .clone()
                .sub(direction.multiplyScalar(lineLength))

            lineGeometry.setFromPoints([reverseEndPoint, endPoint])
            const line = new THREE.Line(lineGeometry, lineMaterial)

            scene.add(line)
        }
    }

    setClickHandler(onMouseClick)
}
