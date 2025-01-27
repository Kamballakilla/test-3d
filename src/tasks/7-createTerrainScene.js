import * as THREE from 'three';
import { setClickHandler, clearScene } from '../utils';
import { camera } from '../camera';

import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'

export function createSceneWithLandscape(scene) {
    clearScene(scene);
   
    const size = 2048;  // Размер карты
    const divisions = 248; // Разделение на ячейки

    // Генерируем случайную высоту для ландшафта от 0 до 20
    const terrainGeometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
    const terrainVertices = terrainGeometry.attributes.position.array;
    for (let i = 0; i < terrainVertices.length; i += 3) {
        terrainVertices[i + 2] = Math.random() * 20;  // Важно: массив хранит координаты (x, y, z), и z - это высота
    }


    const terrainMaterial = new THREE.RawShaderMaterial({
        vertexShader:vertexShader,
        fragmentShader:fragmentShader,
    });


    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    // terrain.rotation.x = - Math.PI / 2;  // Поворачиваем плоскость, чтобы она стала горизонтальной
    scene.add(terrain);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function findVerticesInsideCube(intersectPoint, cubeSize, terrainVertices, divisions, size) {
        const cellSize = size / divisions; // Размер ячейки ландшафта
    
        // Вычисляем пределы куба по осям X, Y, Z
        const cubeMinX = intersectPoint.x - cubeSize / 2;
        const cubeMaxX = intersectPoint.x + cubeSize / 2;
        const cubeMinY = intersectPoint.y - cubeSize / 2;
        const cubeMaxY = intersectPoint.y + cubeSize / 2;
        const cubeMinZ = intersectPoint.z - cubeSize / 2;
        const cubeMaxZ = intersectPoint.z + cubeSize / 2;
    
        const verticesInsideCube = [];
    
        // Перебираем все вершины ландшафта
        for (let i = 0; i < terrainVertices.length; i += 3) {
            const x = terrainVertices[i];
            const y = terrainVertices[i + 1];
            const z = terrainVertices[i + 2];
    
            // Проверяем, если вершина находится внутри куба
            if (x >= cubeMinX && x <= cubeMaxX &&
                y >= cubeMinY && y <= cubeMaxY &&
                z >= cubeMinZ && z <= cubeMaxZ) {
                verticesInsideCube.push({ x, y, z });
            }
        }
    
        return verticesInsideCube;
    }

    function calculateTerrainVolumeInCube(intersectPoint,terrainVertices, size, divisions) {
        const cellSize = size / divisions; // Размер одной клетки
        let totalVolume = 0; // Общий объем ландшафта внутри куба

        const cubeMinX = intersectPoint.x - 32 / 2;
        const cubeMaxX = intersectPoint.x + 32 / 2;
        const cubeMinY = intersectPoint.y - 32 / 2;
        const cubeMaxY = intersectPoint.y + 32 / 2;
        const cubeMinZ = intersectPoint.z - 32 / 2;
        const cubeMaxZ = intersectPoint.z + 32 / 2;
    
        // Перебираем все вершины ландшафта
        for (let i = 0; i < terrainVertices.length; i += 3) {
            const x = terrainVertices[i];     // X-координата вершины
            const y = terrainVertices[i + 1]; // Y-координата вершины
            const z = terrainVertices[i + 2]; // Z-координата вершины (высота)
    
            // Проверяем, попадает ли эта вершина в куб
            if (
                x >= cubeMinX && x <= cubeMaxX &&
                y >= cubeMinY && y <= cubeMaxY &&
                z >= cubeMinZ && z <= cubeMaxZ
            ) {
                // Если вершина в пределах куба, вычисляем объем для этой клетки
                const cellVolume = cellSize * cellSize * z; // Площадь клетки умножаем на высоту
                totalVolume += cellVolume; // Добавляем объем к общему объему
            }
        }
    
        return totalVolume;
    }


    function onMouseClick(event) {
       
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(terrain);

        if (intersects.length > 0) {
          
            const intersectPoint = intersects[0].point;

    
            const cubeGeometry = new THREE.BoxGeometry(32, 32, 32);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe:true });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z); 
            scene.add(cube)



            const verticesInsideCube = findVerticesInsideCube(intersectPoint, 32, terrainVertices, divisions, size);

            verticesInsideCube.forEach(vertex => {
         
                const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
                const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
              
                sphere.position.set(vertex.x, vertex.y, vertex.z);
                scene.add(sphere); 
            });


            const volume = calculateTerrainVolumeInCube(intersectPoint,terrainVertices, size, divisions)

            console.log(volume)
        }
    }


    setClickHandler(onMouseClick);
}