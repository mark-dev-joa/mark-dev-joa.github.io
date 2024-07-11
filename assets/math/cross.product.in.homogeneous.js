import * as THREE from '/assets/three/three.module.js';
import { OrbitControls } from "/assets/three/OrbitControls.js";

var camera, scene, renderer, controls;
var geometry, material, mesh;

class ProjectionPlane {
    constructor(scene, width, height) {
        // Create a plane
        this.planeGeometry = new THREE.PlaneGeometry(width, height);
        this.planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xf0f0f0,
            side: THREE.DoubleSide,
            //wireframe: true,  // makes the plane visible
            transparent: true,
            opacity: 0.7,
        });
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.position.z = 1;

        this.plane.updateMatrixWorld(true);

        scene.add(this.plane);
    }

    getWorldMatrix() {
        // Update the matrix world
        this.plane.updateMatrixWorld(true);
        // Return the world matrix
        return this.plane.matrixWorld.clone();
    }

    setWorldMatrix(matrix) {
        this.plane.matrix.copy(matrix);
        this.plane.matrix.decompose(this.plane.position, this.plane.quaternion, this.plane.scale);
        this.plane.updateMatrixWorld(true);
    }

    projectPoints(scene, xx, line_f, l1, color = 0x0000ff, alpha = 1) {
        // material for points
        const material = new THREE.PointsMaterial({
            color: color,
            size: 10,
            transparent: false,
            opacity: alpha
        });

        // points array
        const points = [];

        // Assuming `xx` is an array of x-coordinates and `line_f` is a function
        // to compute the y-coordinate based on the x-coordinate.
        xx.forEach(x => {
            let y = line_f(x, l1);
            let point = new THREE.Vector3(1, 1, 0);

            // Transform the point to the plane's local space
            point.applyMatrix4(this.plane.matrixWorld)

            points.push(point);
        });

        // create geometry
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // create points
        const pointCloud = new THREE.Points(geometry, material);

        // Add points to the scene
        scene.add(pointCloud);
    }
}

init();
animate();

function init() {
    var container = document.getElementById("cube");
    var width = container.clientWidth;
    var height = container.clientHeight;

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    //geometry = new THREE.BoxGeometry(1, 1, 1);
    //material = new THREE.MeshNormalMaterial();
    //mesh = new THREE.Mesh(geometry, material);
    //scene.add(mesh);

    //create a blue LineBasicMaterial
    //points.push(new THREE.Vector3(10, 0, 0));


    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    //gridHelper.rotatiton.
    //gridHelper.position.z = 1;
    //gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    // orthgraphic camera
    //camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000);
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    camera.position.x = -150;
    camera.position.z = 100;
    camera.position.y = 150;


    const target = new THREE.Vector3(0, 0, 0);
    camera.lookAt(target);

    // axes
    const axes = new THREE.AxesHelper(50);
    scene.add(axes);

    const line_f = function (xx, l) {
        return l.x / -l.y * xx + l.z / -l.y;
    };

    // y = x + 1
    const l1 = new THREE.Vector3(1, -1, 1);

    // y = 2x + 1
    const l2 = new THREE.Vector3(2, -1, 1);

    // intersection point
    const intersectionPt = l1.clone();
    intersectionPt.cross(l2);


    const drawLine = function (xx, l, color = 0xff0000) {
        // material
        const material = new THREE.LineBasicMaterial({ color: color });
        const points = [];
        xx.forEach(x => {
            let y = line_f(x, l);
            points.push(new THREE.Vector3(x, 0, y));
        });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }

    let xCoordinates = [-10, 10];
    drawLine(xCoordinates, l1);

    xCoordinates = [-10, 10];
    drawLine(xCoordinates, l2);

    // Create a plane
    // const planeGeometry = new THREE.PlaneGeometry(2, 2);
    // const planeMaterial = new THREE.MeshBasicMaterial({
    //     color: 0xf0f0f0,
    //     side: THREE.DoubleSide,
    //     //wireframe: true,  // makes the plane visible
    // });
    // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.position.z = 1;

    // // Rotate the plane to make it horizontal (if necessary)
    // //plane.rotation.x = Math.PI / 2;

    // // Assuming `scene` is your Three.js scene object
    // scene.add(plane);

    const projectionPlane = new ProjectionPlane(scene, 5, 5);

    // Get the world matrix of the plane
    const worldMatrix = projectionPlane.getWorldMatrix();
    console.log('World Matrix:', worldMatrix);


    xCoordinates = [-10, -5, 0, 5, 10];
    projectionPlane.projectPoints(scene, xCoordinates, line_f, l1, 0xff0000, 0.8);

    // Set a new world matrix for the plane (example of setting identity matrix)
    //const newMatrix = new THREE.Matrix4().identity();
    //projectionPlane.setWorldMatrix(newMatrix);


    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    camera.zoom = 40;
    camera.updateProjectionMatrix();
}

// animation
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    //console.log(camera.zoom);

    //mesh.rotation.x += 0.001;
    //mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}
