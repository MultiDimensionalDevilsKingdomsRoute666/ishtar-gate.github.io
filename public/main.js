
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.js";
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.174.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://threejs.org/examples/jsm/loaders/MTLLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	// FOV
	75,
	// Aspect ratio
	window.innerWidth / window.innerHeight,
	// Near
	0.1,
	// Far
	1000
);

var renderer = new THREE.WebGLRenderer({ antialias: true });

window.addEventListener('load', function ()
{
	main();
});

window.addEventListener('resize', () =>
{
	updateRenderer();
	updateCamera();
});

function updateCamera ()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

function updateRenderer ()
{
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
}

function main ()
{
	camera.position.set(0, 10, 20);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 5, 0);
	controls.update();

	renderer.setSize(window.innerWidth, window.innerHeight);

	setBackground("public/equirectangularmap/chornobyl.png");
	setAmbientLight();

	drawObj("public/resources/ishtar_portalv1.obj", "public/resources/ishtar_portalv1.mtl");

	document.body.appendChild(renderer.domElement);

	requestAnimationFrame(render);
}

function setBackground (path)
{
	const loader = new THREE.TextureLoader();

	const texture = loader.load(
		path,
		() => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			texture.colorSpace = THREE.SRGBColorSpace;
			scene.background = texture;
		}
	);
}

function setAmbientLight ()
{
	const light = new THREE.AmbientLight(0xFFFFFF, 3.5);
	scene.add(light);

	const skyColor = new THREE.HemisphereLight(0x62a0ea, 0xffbe6f, 2);
	scene.add(skyColor);
}

function drawCube ()
{
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);

	scene.add(cube);

	return cube;
}

/**
 * Load an .obj file.
 * @param {string} path - Path of the main obj file.
 * @param {string} pathMtl - path of the obj material file.
 */
function drawObj (path, pathMtl)
{
	const mtlLoader = new MTLLoader();

	mtlLoader.load(pathMtl, (mtl) =>
	{
		mtl.preload();

		for(let material of Object.values(mtl.materials))
		{
			material.side = THREE.DoubleSide;
		}

		const objLoader = new OBJLoader();

		objLoader.setMaterials(mtl);
		objLoader.load(path, (root) =>
		{
			scene.add(root);

			root.rotation.y = -180;

			root.traverse(function(child)
			{
				if(!child.isMesh)
				{
					return;
				}

				console.log('Name', child.name);

				child.material.wireframe = false;
			});
		});
	});
}

function render ()
{
	updateRenderer();
	updateCamera();

	renderer.render(scene, camera);

	requestAnimationFrame(render);
}

