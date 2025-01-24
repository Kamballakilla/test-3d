import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

// Debug
const gui = new dat.GUI()

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/paper_seamless_texture.jpg'); 

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;


const guiContainer = document.querySelector('.dg');

// Добавляем обработчик событий
guiContainer.addEventListener('click', function(event) {
  event.stopPropagation(); // Останавливаем распространение события
});

// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()

let currentClickHandler = null

// Функция для отчистки обработчика
function setClickHandler(handler) {
    // Удаляем предыдущий обработчик, если он есть
    if (currentClickHandler) {
        window.removeEventListener('click', currentClickHandler)
    }

    // Устанавливаем новый обработчик
    if (handler) {
        window.addEventListener('click', handler)
    }

    // Сохраняем текущий обработчик
    currentClickHandler = handler
}

// Функция для очистки сцены
function clearScene() {
    // Удаляем все объекты из сцены
    while (scene.children.length) {
        scene.remove(scene.children[0])
    }
}

// Задание 1
function createSceneWithTwoCubes() {
    clearScene() // Очистка сцены перед добавлением новых объектов

    // Создание материалов
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })

    // Создание геометрии для двух кубов
    const geometry = new THREE.BoxGeometry()

    const cube1 = new THREE.Mesh(geometry, material1)
    const cube2 = new THREE.Mesh(geometry, material2)

    // Расположение кубов
    cube1.position.set(-1.5, 0, 0)
    cube2.position.set(1.5, 0, 0)

    // Добавление кубов на сцену
    scene.add(cube1)
    scene.add(cube2)

    // Функция для рандомизации параметров
    function randomizeCubeProperties(cube) {
        // Случайный масштаб (размер)
        cube.scale.set(
            Math.random() * 2 + 0.5,
            Math.random() * 2 + 0.5,
            Math.random() * 2 + 0.5
        )

        // Случайный поворот
        cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        )

        // Случайный цвет
        const randomColor = Math.floor(Math.random() * 0xffffff)
        cube.material.color.set(randomColor)
    }

    // Добавление обработчика кликов для кубов
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseClick(event) {
        // Вычисляем позицию мыши в системе координат WebGL
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        // Находим пересечения с объектами
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([cube1, cube2])

        if (intersects.length > 0) {
            // Если есть пересечение, изменяем свойства первого объекта
            randomizeCubeProperties(intersects[0].object)
        }
    }

    // Добавляем обработчик кликов на окно
    setClickHandler(onMouseClick)
}

// Задание 2
function createSceneWithCubesAndLines() {
    clearScene() // Очистка сцены перед добавлением новых объектов

    // Создание материалов
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })

    // Создание геометрии для двух кубов
    const geometry = new THREE.BoxGeometry()

    const cube1 = new THREE.Mesh(geometry, material1)
    const cube2 = new THREE.Mesh(geometry, material2)

    // Расположение кубов
    cube1.position.set(-1.5, 0, 0)
    cube2.position.set(1.5, 0, 0)

    // Добавление кубов в сцену
    scene.add(cube1)
    scene.add(cube2)

    // Использование Raycaster для обработки кликов
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseClick(event) {
        // Преобразуем координаты мыши в систему координат WebGL
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        // Настраиваем Raycaster для вычисления пересечений
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([cube1, cube2])

        if (intersects.length > 0) {
            // Получаем информацию о пересечении
            const intersect = intersects[0]
            const point = intersect.point // Точка пересечения
            const normal = intersect.face.normal.clone() // Нормаль к грани
            const object = intersect.object // Куб, с которым есть пересечение

            // Переводим нормаль в мировые координаты
            normal.transformDirection(object.matrixWorld).normalize()

            // Создаём линию
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xff0000,
            })
            const lineGeometry = new THREE.BufferGeometry()

            // Линия пересекает куб строго перпендикулярно к грани
            const lineLength = 2 // Длина линии
            const startPoint = point
                .clone()
                .addScaledVector(normal, -lineLength / 2) // Начало линии
            const endPoint = point
                .clone()
                .addScaledVector(normal, lineLength / 2) // Конец линии

            // Задаём точки линии
            lineGeometry.setFromPoints([startPoint, endPoint])
            const line = new THREE.Line(lineGeometry, lineMaterial)

            // Добавляем линию в сцену
            scene.add(line)
        }
    }

    // Добавляем обработчик кликов
    setClickHandler(onMouseClick)
}

// Задание 3
function createSceneWithCubesAndCenterLines() {
    clearScene() // Очистка сцены перед добавлением новых объектов

    // Создание материалов для кубов
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })

    // Создание геометрии для двух кубов
    const geometry = new THREE.BoxGeometry()

    const cube1 = new THREE.Mesh(geometry, material1)
    const cube2 = new THREE.Mesh(geometry, material2)

    // Расположение кубов
    cube1.position.set(-1.5, 0, 0)
    cube2.position.set(1.5, 0, 0)

    // Добавление кубов на сцену
    scene.add(cube1)
    scene.add(cube2)

    // Настройка Raycaster для обработки кликов
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseClick(event) {
        // Преобразуем координаты мыши в систему координат WebGL
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        // Устанавливаем Raycaster для поиска пересечений
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([cube1, cube2])

        if (intersects.length > 0) {
            // Получаем информацию о пересечении
            const intersect = intersects[0]
            const point = intersect.point // Точка пересечения
            const object = intersect.object // Куб, с которым произошло пересечение

            // Центр геометрии куба в мировых координатах
            const center = object.getWorldPosition(new THREE.Vector3())

            // Вычисляем вектор от точки клика до центра куба
            const direction = center.clone().sub(point).normalize()

            // Длина линии, которую мы хотим провести
            const lineLength = 1.5 // Фиксированная длина линии

            // Создаём линию, которая будет выходить за пределы куба от точки клика через центр
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xff0000,
            })
            const lineGeometry = new THREE.BufferGeometry()

            // Начальная точка - точка клика
            const startPoint = point.clone()

            // Конечная точка - точка, которая находится на определённой длине вдоль направления
            const endPoint = startPoint
                .clone()
                .add(direction.multiplyScalar(lineLength))
            const reverseEndPoint = startPoint
                .clone()
                .sub(direction.multiplyScalar(lineLength)) // Точка в обратном направлении

            // Задаём точки линии (начало и конец)
            lineGeometry.setFromPoints([reverseEndPoint, endPoint])
            const line = new THREE.Line(lineGeometry, lineMaterial)

            // Добавляем линию в сцену
            scene.add(line)
        }
    }

    // Устанавливаем обработчик кликов
    setClickHandler(onMouseClick)
}

// Задание 4
function createSceneWithCubesAndDistance() {
    clearScene() // Очистка сцены перед добавлением новых объектов

    // Создание материалов для кубов
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })

    // Создание геометрии для двух кубов
    const geometry = new THREE.BoxGeometry(1, 1, 1) // Начальный размер кубов 1x1x1

    const cube1 = new THREE.Mesh(geometry, material1)
    cube1.name = '1'
    const cube2 = new THREE.Mesh(geometry, material2)
    cube2.name = '2'

    // Расположение кубов
    cube1.position.set(-1.5, 0, 0)
    cube2.position.set(1.5, 0, 0)

    // Добавление кубов на сцену
    scene.add(cube1)
    scene.add(cube2)

    // Настройка Raycaster для обработки кликов
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseClick(event) {
        // Преобразуем координаты мыши в систему координат WebGL
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        // Устанавливаем Raycaster для поиска пересечений
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([cube1, cube2])

        if (intersects.length > 0) {
            const intersect = intersects[0]
            const point = intersect.point // Точка пересечения
            const object = intersect.object // Куб, с которым произошло пересечение

            // Центр геометрии куба в мировых координатах
            const center = object.getWorldPosition(new THREE.Vector3())
            const distance = point.distanceTo(center) // Расстояние от клика до центра куба

            // Если клик был по первому кубу, меняем размер второго куба
            if (object === cube1) {
                // Новая геометрия для второго куба с размером, равным расстоянию от точки клика до центра первого куба
                const newSize = distance
                cube2.geometry.dispose() // Удаляем старую геометрию
                cube2.geometry = new THREE.BoxGeometry(
                    newSize,
                    newSize,
                    newSize
                ) // Новая геометрия для второго куба
            }
            // Если клик был по второму кубу, меняем размер первого куба
            else if (object === cube2) {
                // Новая геометрия для первого куба с размером, равным расстоянию от точки клика до центра второго куба
                const newSize = distance
                cube1.geometry.dispose() // Удаляем старую геометрию
                cube1.geometry = new THREE.BoxGeometry(
                    newSize,
                    newSize,
                    newSize
                ) // Новая геометрия для первого куба
            }
        }
    }

    // Устанавливаем обработчик кликов
    setClickHandler(onMouseClick)
}

// Задание 5 
function createSceneWithThreeCubes() {
    clearScene(); // Очистка сцены перед добавлением новых объектов

    // Создание материалов для кубов
    const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    // Создание геометрий для кубов
    const geometry = new THREE.BoxGeometry(1, 1, 1); // Размеры 1x1x1 для всех кубов

    const cube1 = new THREE.Mesh(geometry, material1);
    cube1.name = "cube1";
    const cube2 = new THREE.Mesh(geometry, material2);
    cube2.name = "cube2";
    const cube3 = new THREE.Mesh(geometry, material3);
    cube3.name = "cube3";

    // Устанавливаем начальное положение кубов
    cube1.position.set(0, 0, 0);
    cube2.position.set(2, 0, 0); // Относительно первого куба
    cube3.position.set(2, 0, 0); // Относительно второго куба

    // Добавляем кубы на сцену
    scene.add(cube1);
    cube1.add(cube2); // cube2 является дочерним для cube1
    cube2.add(cube3); // cube3 является дочерним для cube2



    function calculateDistancesToCamera() {
        const cameraPosition = camera.position;

        // Массив для кубов
        const cubes = [cube1, cube2, cube3];

        cubes.forEach(cube => {
            const distance = cube.position.distanceTo(cameraPosition);
            console.log(`Расстояние от ${cube.name} до камеры: ${distance.toFixed(2)} единиц`);
        });
    }


    // Обработчик кликов для рандомного изменения позиции кубов
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
        // Преобразуем координаты мыши в систему координат WebGL
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Настройка Raycaster для поиска пересечений с объектами
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

    // Добавляем обработчик кликов
    setClickHandler(onMouseClick);
}

// Задание 6
function createSceneWithPlaneAndCircle() {
    clearScene() // Очистка сцены перед добавлением новых объектов

    // Создание материалов для плоскости и окружности
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
    })

    const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.5,
        transparent: true,
        depthWrite: false,
    })

    // Создание геометрий
    const planeGeometry = new THREE.PlaneGeometry(8, 8) // Плоскость 8x8
    const circleGeometry = new THREE.CircleGeometry(4, 32) // Окружность радиусом 4 и 32 сегмента

    // Создание объектов
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.position.set(0, 0, 0) // Позиция плоскости

    const circle = new THREE.Mesh(circleGeometry, circleMaterial)
    circle.position.set(0, 0, 0)

    // Устанавливаем порядок рендеринга
    plane.renderOrder = 1 // Плоскость будет рендериться первой
    circle.renderOrder = 2 // Окружность будет рендериться второй

    // Добавляем плоскость на сцену
    scene.add(plane)

    // Обработчик кликов для наложения окружности на плоскость
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseClick(event) {
        // Преобразуем координаты мыши в систему координат WebGL
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        // Настройка Raycaster для поиска пересечений с объектами
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObject(plane)

        if (intersects.length > 0) {
            // Получаем точку пересечения
            const point = intersects[0].point

            // Перемещаем окружность на точку клика
            circle.position.set(point.x, point.y, 0.1) // Накладываем окружность на плоскость с небольшим смещением по Z

            // Добавляем окружность на сцену
            scene.add(circle)

            calculateIntersectionArea(circle)
        }
    }

    // Добавляем обработчик кликов
    setClickHandler(onMouseClick)
}

function calculateIntersectionArea(circle) {
    const numPoints = 100000 // Количество случайных точек
    let insideCircle = 0

    // Получаем текущую позицию центра окружности
    const circleX = circle.position.x
    const circleY = circle.position.y

    // Генерация случайных точек в квадрате и проверка, попадают ли они в окружность
    for (let i = 0; i < numPoints; i++) {
        const x = (Math.random() - 0.5) * 8 // случайная точка по оси X

        const y = (Math.random() - 0.5) * 8 // случайная точка по оси Y

        // Проверяем, попадает ли точка в окружность (расстояние от центра окружности)
        const distance =
            (x - circleX) * (x - circleX) + (y - circleY) * (y - circleY)
        if (distance <= 4 * 4) {
            insideCircle++
        }
    }

    // Площадь квадрата
    const squareArea = 8 * 8
    // Площадь пересечения
    const intersectionArea = (insideCircle / numPoints) * squareArea
    console.log(intersectionArea)
}

// Задание 7
function createSceneWithLandscape() {
    clearScene(); // Очистка сцены перед добавлением новых объектов
   
    const size = 2048;  // Размер карты
    const divisions = 248; // Разделение на ячейки

    // Генерируем случайную высоту для ландшафта от 0 до 20
    const terrainGeometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
    const terrainVertices = terrainGeometry.attributes.position.array;

    for (let i = 0; i < terrainVertices.length; i += 3) {
        terrainVertices[i + 2] = Math.random() * 20;  // Важно: массив хранит координаты (x, y, z), и z - это высота
    }

    // Применяем материал для ландшафта
    const terrainMaterial = new THREE.MeshBasicMaterial({
        color: 0x8B4513,
        wireframe:true
    });

    // Создаем объект Mesh для ландшафта
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
        // Преобразуем координаты мыши в систему координат WebGL
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(terrain);

        if (intersects.length > 0) {
            // Получаем точку на ландшафте, куда был совершен клик
            const intersectPoint = intersects[0].point;

    
            // Создание куба 32x32
            const cubeGeometry = new THREE.BoxGeometry(32, 32, 32);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe:true });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z); // Устанавливаем куб в точку клика
            scene.add(cube);





            const verticesInsideCube = findVerticesInsideCube(intersectPoint, 32, terrainVertices, divisions, size);

            verticesInsideCube.forEach(vertex => {
                // Создаем красную сферу в точке вершины
                const sphereGeometry = new THREE.SphereGeometry(1, 8, 8); // Радиус сферы 1
                const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Красный цвет
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
                // Устанавливаем позицию сферы в координаты вершины
                sphere.position.set(vertex.x, vertex.y, vertex.z);
                scene.add(sphere); // Добавляем сферу в сцену
            });


            const volume = calculateTerrainVolumeInCube(intersectPoint,terrainVertices, size, divisions)

            console.log(volume)
        }
    }

    // Добавляем обработчик кликов
    setClickHandler(onMouseClick);
}

// Задание 8
function createPlaneWithHexagons() {
    clearScene();

    const planeSize = 2048; // Размер плоскости

    // Создаем плоскость для фона
    const plainGeometry = new THREE.PlaneGeometry(planeSize, planeSize, 100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x8B4513,
    });

    const plane = new THREE.Mesh(plainGeometry, planeMaterial);
    plane.position.z -= 10;

    scene.add(plane);

    const hexRadius = 50; // Радиус вписанной окружности шестиугольника
    const hexWidth = Math.sqrt(3) * hexRadius; // Ширина шестиугольника
    const hexHeight = 2 * hexRadius; // Высота шестиугольника

    // Функция для создания шестиугольника
    function createHexagonGeometry() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const vx = hexRadius * Math.cos(angle);
            const vy = hexRadius * Math.sin(angle);
            vertices.push(vx, vy, 0);
        }

        // Замкнуть шестиугольник
        vertices.push(vertices[0], vertices[1], 0);

        const indices = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 5
        ];

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        // Установка UV-координат
        const uv = [];
        for (let i = 0; i < 6; i++) {
            uv.push(0.5 + 0.5 * Math.cos((Math.PI / 3) * i));
            uv.push(0.5 + 0.5 * Math.sin((Math.PI / 3) * i));
        }
        uv.push(0.5, 0.5); // Центральный UV

        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));

        return geometry;
    }

    const hexGeometry = createHexagonGeometry();
    const hexMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    // Определяем количество строк и столбцов
    const rows = Math.ceil(planeSize / hexHeight);
    const cols = Math.ceil(planeSize / hexWidth);
    const instanceCount = rows * cols;

    // Создаем InstancedMesh для шестиугольников
    const instancedMesh = new THREE.InstancedMesh(hexGeometry, hexMaterial, instanceCount);
    scene.add(instancedMesh);

    let instanceIndex = 0;
    for (let x = -planeSize / 2; x < planeSize / 2; x += hexWidth) {
        for (let y = -planeSize / 2; y < planeSize / 2; y += hexHeight) {
            // Для четных рядов сдвиг по Y не нужен, для нечетных — на половину высоты
            const colIndex = Math.floor((x / hexWidth));
            const offsetY = ( colIndex  % 2 === 0) ? 0 : hexHeight / 2;
    
    
            const matrix = new THREE.Matrix4();
            matrix.setPosition(new THREE.Vector3(x, y + offsetY, 0));
            instancedMesh.setMatrixAt(instanceIndex, matrix);
            instanceIndex++;
        }
    }


}



















const taskConfig = {
    createSceneWithTwoCubes: () => createSceneWithTwoCubes(),
    createSceneWithCubesAndLines: () => createSceneWithCubesAndLines(),
    createSceneWithCubesAndCenterLines: () => createSceneWithCubesAndCenterLines(),
    createSceneWithCubesAndDistance: () => createSceneWithCubesAndDistance(),
    createSceneWithThreeCubes: () => createSceneWithThreeCubes(),
    createSceneWithPlaneAndCircle: () => createSceneWithPlaneAndCircle(),
    createSceneWithLandscape: () => createSceneWithLandscape(),
    createPlaneWithHexagons: () => createPlaneWithHexagons(),
    clearScene: () => clearScene(),
}

for (const label of Object.keys(taskConfig)) {
    gui.add(taskConfig, label).name(label)
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    3000
)
camera.position.set(0, 5, 20)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
