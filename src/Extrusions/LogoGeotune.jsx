import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

export default function LogoGeotune({ exportRef }) {
  const { scene } = useGLTF('/LogoGeotune.glb')

  useEffect(() => {
    if (exportRef) {
      exportRef.current = scene
    }
  }, [scene, exportRef])

  return <primitive object={scene} />
}