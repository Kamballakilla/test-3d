import * as THREE from 'three';
import { setClickHandler, clearScene } from '../utils';
import { camera } from '../camera';

export function createSceneWithCubesAndLines(scene) {
    clearScene(scene);

    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const geometry = new THREE.BoxGeometry();

    const cube1 = new THREE.Mesh(geometry, material1);
    const cube2 = new THREE.Mesh(geometry, material2);

    cube1.position.set(-1.5, 0, 0);
    cube2.position.set(1.5, 0, 0);

    scene.add(cube1, cube2);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([cube1, cube2]);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            const point = intersect.point;
            const normal = intersect.face.normal.clone().transformDirection(intersect.object.matrixWorld).normalize();

            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
            const lineGeometry = new THREE.BufferGeometry();

            const lineLength = 2;
            const startPoint = point.clone().addScaledVector(normal, -lineLength / 2);
            const endPoint = point.clone().addScaledVector(normal, lineLength / 2);

            lineGeometry.setFromPoints([startPoint, endPoint]);
            const line = new THREE.Line(lineGeometry, lineMaterial);

            scene.add(line);
        }
    }

    setClickHandler(onMouseClick);
}
