import * as THREE from 'three';
import { setClickHandler, clearScene } from '../utils';
import { camera } from '../camera';

export function createSceneWithThreeCubes(scene) {
    clearScene(scene); 

    const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });


    const geometry = new THREE.BoxGeometry(1, 1, 1); 

    const cube1 = new THREE.Mesh(geometry, material1);
    cube1.name = "cube1";
    const cube2 = new THREE.Mesh(geometry, material2);
    cube2.name = "cube2";
    const cube3 = new THREE.Mesh(geometry, material3);
    cube3.name = "cube3";

    cube1.position.set(0, 0, 0);
    cube2.position.set(2, 0, 0); 
    cube3.position.set(2, 0, 0); 


    scene.add(cube1);
    cube1.add(cube2); 
    cube2.add(cube3); 



    function calculateDistancesToCamera() {
        const cameraPosition = camera.position;

        const cubes = [cube1, cube2, cube3];

        cubes.forEach(cube => {
            const distance = cube.position.distanceTo(cameraPosition);
            console.log(`Расстояние от ${cube.name} до камеры: ${distance.toFixed(2)} единиц`);
        });
    }


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
      
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([cube1, cube2, cube3]);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;

            if (intersectedObject.children.length > 0) {

                // Сохраняем мировую матрицу первого дочернего объекта
                const child = intersectedObject.children[0];
                const childWorldMatrix = new THREE.Matrix4();
                childWorldMatrix.copy(child.matrixWorld);

                // Перемещаем родительский объект
                intersectedObject.position.set(
                    Math.random() * 2 + 0.5,
                    Math.random() * 2 + 0.5,
                    Math.random() * 2 + 0.5
                );

                // Обновляем матрицы родителя
                intersectedObject.updateMatrixWorld(true);

                // Восстанавливаем положение дочернего объекта относительно мира
                child.matrixWorld.copy(childWorldMatrix);

                // Пересчитываем локальную матрицу дочернего объекта относительно нового положения родителя
                child.matrix.copy(
                    intersectedObject.matrixWorld.clone().invert().multiply(child.matrixWorld)
                );

                // Применяем разложение матрицы
                child.matrix.decompose(child.position, child.quaternion, child.scale);


            } else {
                // Если объект не имеет дочерних, просто меняем его положение
                intersectedObject.position.set(
                    Math.random() * 2 + 0.5,
                    Math.random() * 2 + 0.5,
                    Math.random() * 2 + 0.5
                );
            }

            // После изменения позиций кубов пересчитываем расстояния до камеры
            calculateDistancesToCamera();
        }
    }

    setClickHandler(onMouseClick);
}