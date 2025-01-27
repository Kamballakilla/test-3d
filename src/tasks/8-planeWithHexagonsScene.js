import * as THREE from 'three';
import { setClickHandler, clearScene, loadTextures} from '../utils';
import { camera } from '../camera';


export function createPlaneWithHexagons(scene) {
 


    clearScene(scene); 
    const texture = loadTextures('./textures/grass_seamless_texture.jpg')



    const planeSize = 2048;
    const planeDivision = 100;

    const plainGeometry = new THREE.PlaneGeometry(planeSize, planeSize, planeDivision, planeDivision);

    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x8B4513,
        side:THREE.DoubleSide
    });

    const plane = new THREE.Mesh(plainGeometry, planeMaterial);
    plane.position.z -= 10;

    scene.add(plane);

    const hexRadius = 50; // Радиус вписанной окружности шестиугольника
    const hexWidth = Math.sqrt(3) * hexRadius;
    const hexHeight = 2 * hexRadius;

    // Создаем геометрию и материал для шестиугольников
    const hexGeometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const uv = [];

    const angleOffset = Math.PI / 6;
    for (let i = 0; i < 6; i++) {
        const angle = angleOffset + (Math.PI / 3) * i;
        vertices.push(
            hexRadius * Math.cos(angle),
            hexRadius * Math.sin(angle),
            0
        );
        uv.push(
            0.5 + 0.5 * Math.cos(angle),
            0.5 + 0.5 * Math.sin(angle)
        );
    }
    vertices.push(vertices[0], vertices[1], 0);


    uv.push(0.5, 0.5); // Центральный UV

    indices.push(0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5);

    hexGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    hexGeometry.setIndex(indices);
    hexGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    hexGeometry.computeVertexNormals();

    const hexMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });

    // Создаем InstancedMesh
    const countX = Math.ceil(planeSize / hexWidth);
    const countY = Math.ceil(planeSize / (hexHeight * 0.75));
    const instanceCount = countX * countY;

    const instancedMesh = new THREE.InstancedMesh(hexGeometry, hexMaterial, instanceCount);

    const dummyMatrix = new THREE.Matrix4();
    let instanceIndex = 0;

    for (let y = -planeSize / 2; y < planeSize / 2; y += hexHeight * 0.75) {
        for (let x = -planeSize / 2; x < planeSize / 2; x += hexWidth) {
            const offsetX = (Math.floor((y / (hexHeight * 0.75))) % 2 === 0) ? 0 : hexWidth / 2;
            dummyMatrix.setPosition(x + offsetX, y, 0);
            instancedMesh.setMatrixAt(instanceIndex++, dummyMatrix);
        }
    }

    scene.add(instancedMesh);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(plane);

        if (intersects.length > 0) {
            
            const intersectPoint = intersects[0].point;
            console.log(intersectPoint)
        }
    }

    setClickHandler(onMouseClick);
    
}