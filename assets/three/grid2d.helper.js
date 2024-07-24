import * as THREE from './three.module.js';
import { OrbitControls } from "./OrbitControls.js";


class Grid2DHelper {
    constructor(container) {

        const width = container.clientWidth;
        const height = container.clientHeight;

        // scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        // grid helper
        const size = 50;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper(size, divisions, 0x000000);
        gridHelper.rotation.x = Math.PI / 2;
        scene.add(gridHelper);

        // orthgraphic camera for 2d
        const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 40);
        var focus = new THREE.Vector3(0, 0, 0);
        camera.position.x = focus.x;
        camera.position.y = focus.y;
        camera.position.z = 20;
        camera.zoom = 30;
        camera.lookAt(focus);
        camera.updateProjectionMatrix();

        // renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        //
        // public methods
        //
        this.getScene = function () {
            return scene;
        }

        this.update = function () {
            //controls.update();
            //requestAnimationFrame(this.update());

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

    init() {
        const xAxis = new THREE.Vector3(10, 0, 0);
        const yAxis = new THREE.Vector3(0, 10, 0);

        //this.drawArrowLine(xAxis, 0xff0000);
        //this.drawArrowLine(yAxis, 0x0000ff);
    }
}

export { Grid2DHelper };
