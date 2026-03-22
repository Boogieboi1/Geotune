import * as THREE from 'three'
import { useControls } from 'leva'
import { useRef, useEffect } from 'react'

export default function CabinetHandle({ scale = 1, exportRef, material }) {
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
  const { w, d, wt, w1, w2, h1, h2, r1 } = useControls('CabinetHandle', {
    d: { value: 10, min: 5, max: 500, step: 0.01, label: 'Extrusion' },
    wt: { value: 1.2, min: 1, max: 10, step: 0.01, label: 'Wall thickness'  },
    w1: { value: 20, min: 1, max: 500, step: 0.01, label: 'Gap size'  },
    w2: { value: 30, min: 1, max: 500, step: 0.01, label: 'Length handle'  },
    h1: { value: 30, min: 1, max: 500, step: 0.01, label: 'Top height'  },
    h2: { value: 30, min: 0, max: 500, step: 0.01, label: 'Bottom height'  },
    r1: { value: .5, min: 0, max: 20, step: 0.01, label: 'Radius'  },
    
    
  })

  const r2 = r1+wt

  // Sketch shape
  const shape = new THREE.Shape()
  shape.moveTo(0,0)
  shape.lineTo(wt,0)
  shape.lineTo(wt, h1-r1)
  shape.quadraticCurveTo(wt, h1, wt + r1, h1)
  shape.lineTo(wt + w1 - r1, h1)
  shape.quadraticCurveTo(wt + w1, h1, wt + w1, h1 - r1 )
  shape.lineTo(wt + w1, -h2 + r2)
  shape.quadraticCurveTo(wt + w1, -h2, wt + w1 +r2, -h2)
  shape.lineTo(wt + w1 + wt + w2, - h2)
  shape.lineTo(wt + w1 + wt + w2, - h2 + wt)
  shape.lineTo(wt + w1 + wt + r1 , - h2 + wt)
  shape.quadraticCurveTo(wt + w1 + wt , - h2 + wt, wt + w1 + wt , - h2 + wt + r1)
  shape.lineTo(wt + w1 + wt , h1 + wt - r2)
  shape.quadraticCurveTo(wt + w1 + wt , h1 + wt, wt + w1 + wt - r2 , h1 + wt)
  shape.lineTo(0 + r2 , h1 + wt)
  shape.quadraticCurveTo(0 , h1 + wt, 0 , h1 + wt - r2)

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
