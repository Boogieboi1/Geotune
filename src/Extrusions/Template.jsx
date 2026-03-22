import * as THREE from 'three'
import { useControls } from 'leva'
import { useRef, useEffect } from 'react'

export default function Template({ scale = 1, exportRef, material }) {
  const meshRef = useRef()
  
  // Material
  useEffect(() => {
    if (meshRef.current && material) {
      meshRef.current.material = material
    }
  }, [material])

  // Koppel meshRef aan parent exportRef
  useEffect(() => {
    if (exportRef) exportRef.current = meshRef.current
  }, [exportRef])

  // Parameters via Leva
  const { w, d, wt } = useControls('Template', {
    w: { value: 50, min: 5, max: 200, step: 0.01 },
    d: { value: 50, min: 5, max: 200, step: 0.01 },
    wt: { value: 1.2, min: 0, max: 20, step: 0.01 }
  })

  // Sketch shape
  const shape = new THREE.Shape()
  shape.moveTo(-.5*w, .5*wt)
  shape.lineTo(.5*w, .5*wt)
  shape.lineTo(.5*w, -.5*wt)
  shape.lineTo(-.5*w, -.5*wt)
  shape.closePath()


  // Extrusion
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: false,
    curveSegments: 64
  })

  return (
    <mesh ref={meshRef} position-z={-d / 2} scale={scale} geometry={geometry}>
      {/* <meshStandardMaterial color="mediumpurple" /> */}
    </mesh>
  )
}
