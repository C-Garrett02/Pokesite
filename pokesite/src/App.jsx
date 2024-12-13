import { useState } from 'react'
import bulbasaur from '/Bulbasaur.png'
import ivysaur from '/Ivysaur.png'
import venusaur from '/Venusaur.png'
//import './App.css'
import './Temp.css'

function App() {
  const items = [{
    id: 1,
    name: "Bulbasaur",
    image: bulbasaur
  }, {
    id: 2,
    name: "Ivysaur",
    image: ivysaur
  }, {
    id: 3,
    name: "Venusaur",
    image: venusaur
  }];

  const [dexnum, setDexnum] = useState(0)
  const [name, setName] = useState(items[dexnum].name)
  const [image, setImage] = useState(items[dexnum].image)

  function IncrementDex() {
    if(dexnum < items.length - 1){
      let updatedDex = dexnum + 1;
      setDexnum(updatedDex)
      setName(items[updatedDex].name)
      setImage(items[updatedDex].image)
    }
  }

  function DecrementDex() {
    if(dexnum != 0){
      let updatedDex = dexnum - 1;
      setDexnum(updatedDex)
      setName(items[updatedDex].name)
      setImage(items[updatedDex].image)
    }
  }

  function entry(num, name){
    
  }


  return (
    <>
      <div>
        <img className='pokeImage' src={image}/>
      </div>
      <button onClick={DecrementDex}>
        Decrement
      </button>
      <h2>{dexnum}: {name}</h2>
      <h1>    {dexnum}: {name}</h1>
      <h2>{dexnum}: {name}</h2>
      <button onClick={IncrementDex}>
        Increment
      </button>
    </>
  )
}

export default App
