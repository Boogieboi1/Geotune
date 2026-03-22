import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { useControls, button } from 'leva'
import BoxProfile from './Extrusions/BoxProfile'
import RoundProfile from './Extrusions/RoundProfile'
import Plate from './Extrusions/Plate'
import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js'
import Template from './Extrusions/Template'
import CabinetHandle from './Extrusions/CabinetHandle'
import Test from './Extrusions/Test'
import LogoGeotune from './Extrusions/LogoGeotune'

function BetaTools({ setProfile, exportToSTL }) {
  useControls('Profiles', {
    profile: {
      value: 'logogeotune',
      options: {
        'Logo Geotune': 'logogeotune',
        'Hollow round tube': 'round',
        'Square tube section': 'box',
        'Simple handle': 'cabinethandle',
        Plate: 'plate',

      },
      onChange: (value) => {
        setProfile(value)
      }
    }
  })

  useControls('Export', {
    exportSTL: button(() => exportToSTL())
  })

  return (
    <>
      <OrbitControls makeDefault />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport labelColor="white" />
      </GizmoHelper>
    </>
  )
}

export default function Experience({ betaEnabled }) {
  const [profile, setProfile] = useState('logogeotune')

  const logoGeotuneRef = useRef()
  const roundRef = useRef()
  const boxRef = useRef()
  const plateRef = useRef()
  const templateRef = useRef()
  const cabinethandleRef = useRef()
  const testRef = useRef()

  const getActiveRef = () => {
    switch (profile) {
      case 'logogeotune':
        return logoGeotuneRef
      case 'round':
        return roundRef
      case 'box':
        return boxRef
      case 'plate':
        return plateRef
      case 'template':
        return templateRef
      case 'cabinethandle':
        return cabinethandleRef
      case 'test':
        return testRef
      default:
        return null
    }
  }

  const exportToSTL = () => {
    const activeRef = getActiveRef()
    const object = activeRef?.current

    if (!object) {
      console.error('Geen object gevonden om te exporteren.')
      return
    }

    const exporter = new STLExporter()
    const stlData = exporter.parse(object, { binary: true })

    const blob = new Blob([stlData], { type: 'model/stl' })
    const url = URL.createObjectURL(blob)

    const timestamp = Date.now()

    const link = document.createElement('a')
    link.href = url
    link.download = `Geotune-${profile}-${timestamp}.stl`
    link.click()

    URL.revokeObjectURL(url)
  }

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({ color: 'white' })
  }, [])

  return (
    <>
      {betaEnabled && (
        <BetaTools
          setProfile={setProfile}
          exportToSTL={exportToSTL}
        />
      )}

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      {profile === 'logogeotune' && <LogoGeotune exportRef={logoGeotuneRef} />}
      {profile === 'round' && <RoundProfile exportRef={roundRef} material={material} />}
      {profile === 'box' && <BoxProfile exportRef={boxRef} material={material} />}
      {profile === 'plate' && <Plate exportRef={plateRef} material={material} />}
      {profile === 'cabinethandle' && <CabinetHandle exportRef={cabinethandleRef} material={material} />}
      {profile === 'template' && <Template exportRef={templateRef} material={material} />}
      {profile === 'test' && <Test exportRef={testRef} material={material} />}
    </>
  )
}