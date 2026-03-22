import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

export default function RoundProfile({
  scale = 1,
  exportRef,
  material,
  onGeometryChange
}) {
  const meshRef = useRef()

  const controls = useControls('RoundProfile', {
    d: { value: 50, min: 5, max: 500, step: 0.1, label: 'Extrusion' },
    radius: { value: 10, min: 1, max: 500, step: 0.1, label: 'Radius' },
    wt: { value: 1.2, min: 0.1, max: 250, step: 0.1, label: 'Wall thickness' }
  })

  const target = useMemo(() => {
    const radius = Math.max(controls.radius, 0.01)
    const wt = Math.min(controls.wt, radius - 0.01)

    return {
      d: Math.max(controls.d, 0.01),
      radius,
      wt: Math.max(wt, 0.01)
    }
  }, [controls.d, controls.radius, controls.wt])

  const animated = useRef({
    d: target.d,
    radius: target.radius,
    wt: target.wt
  })

  const [, forceRender] = useState(0)

  useFrame(() => {
    const speed = 0.12

    animated.current.d = THREE.MathUtils.lerp(animated.current.d, target.d, speed)
    animated.current.radius = THREE.MathUtils.lerp(animated.current.radius, target.radius, speed)
    animated.current.wt = THREE.MathUtils.lerp(animated.current.wt, target.wt, speed)

    const doneD = Math.abs(animated.current.d - target.d) < 0.01
    const doneRadius = Math.abs(animated.current.radius - target.radius) < 0.01
    const doneWT = Math.abs(animated.current.wt - target.wt) < 0.01

    if (!doneD || !doneRadius || !doneWT) {
      forceRender((v) => v + 1)
    } else {
      if (animated.current.d !== target.d) animated.current.d = target.d
      if (animated.current.radius !== target.radius) animated.current.radius = target.radius
      if (animated.current.wt !== target.wt) animated.current.wt = target.wt
    }
  })

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.absarc(0, 0, animated.current.radius, 0, Math.PI * 2, false)

    const innerRadius = Math.max(animated.current.radius - animated.current.wt, 0.01)
    const hole = new THREE.Path()
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
    shape.holes.push(hole)

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: animated.current.d,
      bevelEnabled: false,
      curveSegments: 64
    })

    geom.center()
    return geom
  }, [
    Math.round(animated.current.d * 100),
    Math.round(animated.current.radius * 100),
    Math.round(animated.current.wt * 100)
  ])

  useEffect(() => {
    if (meshRef.current && exportRef) {
      exportRef.current = meshRef.current
    }
  }, [exportRef])

  useEffect(() => {
    onGeometryChange?.()
  }, [geometry, onGeometryChange])

  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      scale={scale}
    />
  )
}