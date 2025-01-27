import * as THREE from 'three';
import { setClickHandler, clearScene } from '../utils';
import { camera } from '../camera';


export function createSceneWithPlaneAndCircle(scene) {
    clearScene(scene)

  
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


    const planeGeometry = new THREE.PlaneGeometry(8, 8) // Плоскость 8x8
    const circleGeometry = new THREE.CircleGeometry(4, 32) // Окружность радиусом 4 и 32 сегмента


    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.position.set(0, 0, 0) // Позиция плоскости

    const circle = new THREE.Mesh(circleGeometry, circleMaterial)
    circle.position.set(0, 0, 0)

    // Устанавливаем порядок рендеринга
    plane.renderOrder = 1 // Плоскость будет рендериться первой
    circle.renderOrder = 2 // Окружность будет рендериться второй

    scene.add(plane)


    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Метод Монте-Карло
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

    function onMouseClick(event) {
     
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1


        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObject(plane)

        if (intersects.length > 0) {
      
            const point = intersects[0].point

      
            circle.position.set(point.x, point.y, 0.1)

       
            scene.add(circle)

            calculateIntersectionArea(circle)
        }
    }

    setClickHandler(onMouseClick)
}