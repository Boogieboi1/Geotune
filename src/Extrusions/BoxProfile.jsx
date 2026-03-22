import * as THREE from 'three'
import { useControls } from 'leva'
import { useRef, useEffect } from 'react'

export default function BoxProfile({ scale = 1, exportRef, material }) {
  const meshRef = useRef()

  // Koppel meshRef aan parent exportRef
  useEffect(() => {
    if (exportRef) exportRef.current = meshRef.current
  }, [exportRef])

  // Material
  useEffect(() => {
    if (meshRef.current && material) {
      meshRef.current.material = material
    }
  }, [material])
  
  // Parameters via Leva
  const { w, h, d, radius, wt } = useControls('BoxProfile', {
    w: { value: 50, min: 1, max: 500, step: 0.01, label: 'Width'},
    h: { value: 50, min: 1, max: 500, step: 0.01, label: 'Height' },
    d: { value: 50, min: 1, max: 500, step: 0.01, label: 'Extrusion' },
    radius: { value: 3, min: 0, max: 100, step: 0.01, label: 'Radius' },
    wt: { value: 1.2, min: 0, max: 100, step: 0.01, label: 'Wall thickness' }
  })

  const hw = w / 2
  const hh = h / 2
  const r = radius

  // Sketch shape
  const shape = new THREE.Shape()
  shape.moveTo(-hw, hh - r)
  shape.quadraticCurveTo(-hw, hh, -hw + r, hh)
  shape.lineTo(hw - r, hh)
  shape.quadraticCurveTo(hw, hh, hw, hh - r)
  shape.lineTo(hw, -hh + r)
  shape.quadraticCurveTo(hw, -hh, hw - r, -hh)
  shape.lineTo(-hw + r, -hh)
  shape.quadraticCurveTo(-hw, -hh, -hw, -hh + r)
  shape.closePath()

  // Hole (omgekeerde richting)
  const innerHw = hw - wt
  const innerHh = hh - wt
  const innerR = Math.max(r - wt, 0)

  const hole = new THREE.Path()
  hole.moveTo(innerHw, innerHh - innerR)
  hole.quadraticCurveTo(innerHw, innerHh, innerHw - innerR, innerHh)
  hole.lineTo(-innerHw + innerR, innerHh)
  hole.quadraticCurveTo(-innerHw, innerHh, -innerHw, innerHh - innerR)
  hole.lineTo(-innerHw, -innerHh + innerR)
  hole.quadraticCurveTo(-innerHw, -innerHh, -innerHw + innerR, -innerHh)
  hole.lineTo(innerHw - innerR, -innerHh)
  hole.quadraticCurveTo(innerHw, -innerHh, innerHw, -innerHh + innerR)
  hole.closePath()
  shape.holes.push(hole)

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
