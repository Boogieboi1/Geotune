import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// // Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */


const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
    `${import.meta.env.BASE_URL}models/FlightHelmet/glTF/displaytest.glb`,
    (gltf)=>
    {
        // console.log(gltf)
        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction()
        // action.play()


       scene.add(gltf.scene) 
       gltf.scene.scale.set(1, 1, 1)  
       gltf.scene.position.set(0, 0, 0)  
    }
    
)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 5)
ambientLight.position.set(-1, -1, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 100)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    const aspect = sizes.width / sizes.height
    const frustumSize = 5

    // Update orthographic camera correct
    camera.left   = -frustumSize * aspect / 2
    camera.right  =  frustumSize * aspect / 2
    camera.top    =  frustumSize / 2
    camera.bottom = -frustumSize / 2

    camera.updateProjectionMatrix()

    // Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const aspect = sizes.width / sizes.height
const frustumSize = 5 // bepaal hoe “ingezoomd” je orthographic view is
const camera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2, // left
   frustumSize * aspect / 2, // right
   frustumSize / 2,          // top
  -frustumSize / 2,          // bottom
   0.1,                      // near
   100                       // far
)
camera.position.set(0, 0, 10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Mixer update
    if (mixer !== null)
    mixer.update(deltaTime)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()