import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import bulbasaur from '/Bulbasaur.png'
import ivysaur from '/Ivysaur.png'
import venusaur from '/Venusaur.png'
//import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <img src={bulbasaur} className="logo" alt="Bulbasaur" />
      </div>
      <h1>Bulbasaur</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
