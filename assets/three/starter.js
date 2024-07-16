import * as THREE from './three.module.js';
import { OrbitControls } from "./OrbitControls.js";

class GridSceneHelper {
    constructor(container) {

        const width = container.clientWidth;
        const height = container.clientHeight;

        // scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // grid helper
        const size = 20;
        const divisions = 20;
        const gridHelper = new THREE.GridHelper(size, divisions);
        scene.add(gridHelper);

        // axes
        //const axes = new THREE.AxesHelper(5);
        //scene.add(axes);

        // camera
        const camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
        camera.position.x = -100;
        camera.position.z = 50;
        camera.position.y = 100;
        const target = new THREE.Vector3(0, 0, 0);
        camera.lookAt(target);

        // renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.zoom = 40;
        camera.updateProjectionMatrix();

        //
        // public methods
        //
        this.getScene = function () {
            return scene;
        }

        this.update = function () {
            controls.update();
            renderer.render(scene, camera);
        }

        this.drawArrowLine = function (v, c) {
            const dir = v.clone();
            dir.normalize();

            const origin = new THREE.Vector3(0, 0, 0);
            const length = v.length();
            const hex = c;

            const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
            scene.add(arrowHelper);

            return arrowHelper;
        }

        this.drawPlane = function (width, height) {
            // Create a plane
            const planeGeometry = new THREE.PlaneGeometry(width, height);
            const planeMaterial = new THREE.MeshBasicMaterial({
                color: 0xf0f0f0,
                side: THREE.DoubleSide,
                //wireframe: true,  // makes the plane visible
                transparent: true,
                opacity: 0.3,
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = Math.PI / 2;
            //const plane.position.z = 1;

            plane.updateMatrixWorld(true);
            scene.add(plane);
        }

        this.drawLine = function (start, end) {

        }

    }


    //
    // internals
    //
}

export { GridSceneHelper };
