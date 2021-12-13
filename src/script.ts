import './style.css';
import * as THREE from 'three';
 import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap';
import * as dat from 'lil-gui';

// Scene
const scene = new THREE.Scene();

let color = 0x00Afff;

// Object
const material = new THREE.MeshBasicMaterial({ color,  wireframe: true  });

// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

// Create 100 triangles 
const count = 100
const nbPoints = count * 3 * 3;
const positionsArray = new Float32Array(nbPoints);

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

for(let i = 0; i < nbPoints; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 10;
}

let drawCount = 2;
geometry.setDrawRange( 0, drawCount );


const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


// Sizes
const sizes = {
     width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
});

renderer.setSize(sizes.width, sizes.height);
//renderer.render(scene, camera);

// Controls
const controls = new OrbitControls( camera, renderer.domElement );

/**
 * Debug
 */
const gui = new dat.GUI({ title: "my options" });

gui.add(mesh, 'visible');

const parameters = {
    spin: () =>
    {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    },
    color,
}

gui.addColor(parameters, 'color')
.listen()
.onChange(() =>
    {
        console.log("pndfkj")
    material.color.set(parameters.color)
    }
);

gui.add(parameters, 'spin');


function updatePositions() {
    const positions = geometry.attributes.position;

    let x, y, z, index;
    x = y = z = index = 0;

    for(let i = 0; i < count; i++)
    {

        positions.setXYZ(i,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );

    }

}

function tick()
{
    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.005;

    drawCount = ( drawCount + 1 ) % nbPoints;
    geometry.setDrawRange( 0, drawCount );
    if(drawCount === 0) {
        updatePositions();
        geometry.attributes.position.needsUpdate = true;
        const newColor : number = Math.random() * 0xffffff;
        material.color.setHex(newColor);
        gui.controllers[1].setValue(material.color.getHex());
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}


window.onload = () => {
    tick();
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement;
    const canvas = document.querySelector('canvas.webgl');

    if(!canvas) {
        return;
    }

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        
    }
})