import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { camera } from './camera';
import { canvas } from './renderer';

export const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
