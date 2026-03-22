import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Beta button
 */
const betaButton = document.createElement('button')
betaButton.textContent = 'Try Beta Version'
betaButton.style.position = 'fixed'
betaButton.style.top = '20px'
betaButton.style.right = '20px'
betaButton.style.zIndex = '1000'
betaButton.style.padding = '12px 18px'
betaButton.style.border = 'none'
betaButton.style.borderRadius = '10px'
betaButton.style.cursor = 'pointer'
betaButton.style.fontSize = '14px'
betaButton.style.fontWeight = '600'
betaButton.style.background = '#ffffff'
betaButton.style.color = '#111111'
betaButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
document.body.appendChild(betaButton)

let gui = null

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`)

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let model = null

gltfLoader.load(
    `${import.meta.env.BASE_URL}models/FlightHelmet/glTF/displaytest.glb`,
    (gltf) =>
    {
        model = gltf.scene

        scene.add(model)
        model.scale.set(1, 1, 1)
        model.position.set(0, 0, 0)
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
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
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

    camera.left = -frustumSize * aspect / 2
    camera.right = frustumSize * aspect / 2
    camera.top = frustumSize / 2
    camera.bottom = -frustumSize / 2

    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const aspect = sizes.width / sizes.height
const frustumSize = 5

const camera = new THREE.OrthographicCamera(
    -frustumSize * aspect / 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    100
)
camera.position.set(0, 0, 10)
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true
controls.enabled = false

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
 * Beta activation
 */
betaButton.addEventListener('click', () =>
{
    controls.enabled = true
    betaButton.remove()

    if (!gui)
    {
        gui = new GUI()

        const debugObject = {
            ambientIntensity: ambientLight.intensity,
            directionalIntensity: directionalLight.intensity
        }

        gui.add(debugObject, 'ambientIntensity', 0, 10, 0.1).name('Ambient').onChange((value) =>
        {
            ambientLight.intensity = value
        })

        gui.add(debugObject, 'directionalIntensity', 0, 200, 1).name('Directional').onChange((value) =>
        {
            directionalLight.intensity = value
        })

        if (model)
        {
            const modelFolder = gui.addFolder('Model')
            modelFolder.add(model.rotation, 'x', -Math.PI, Math.PI, 0.01).name('Rotate X')
            modelFolder.add(model.rotation, 'y', -Math.PI, Math.PI, 0.01).name('Rotate Y')
            modelFolder.add(model.rotation, 'z', -Math.PI, Math.PI, 0.01).name('Rotate Z')
        }
    }
})

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

    if (mixer !== null)
    {
        mixer.update(deltaTime)
    }

    controls.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()