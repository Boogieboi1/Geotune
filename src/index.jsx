import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Leva } from 'leva'
import Experience from './Experience.jsx'

function App() {
  const [betaEnabled, setBetaEnabled] = useState(false)

  return (
    <>
      {!betaEnabled && (
        <button
          onClick={() => setBetaEnabled(true)}
          className="beta-button"
        >
          Try Beta!
        </button>
      )}

      <Leva hidden={!betaEnabled} />

      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 10000,
          position: [0, 0,100]
        }}
      >
        <color attach="background" args={['#111']} />

        <Suspense fallback={null}>
          <Experience betaEnabled={betaEnabled} />
        </Suspense>
      </Canvas>
    </>
  )
}

const rootElement = document.querySelector('#root')
const root = ReactDOM.createRoot(rootElement)

root.render(<App />)