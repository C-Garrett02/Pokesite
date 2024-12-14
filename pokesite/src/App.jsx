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

  function Entry({id}){
    if(id > -1 && id < items.length){
      return (
        <>
          <h2>{id+1}: {items[id].name}</h2>
        </>
      )
    }
  }

  function VisibleEntries({num}){
    return(
      <>
        <Entry id={num-1}/>
        <Entry id={num}/>
        <Entry id={num+1}/>
      </>
    )
  }


  return (
    <>
      <div>
        <img className='pokeImage' src={image}/>
      </div>
      <button onClick={DecrementDex}>
        Decrement
      </button>
      <VisibleEntries num={dexnum}/>
      <button onClick={IncrementDex}>
        Increment
      </button>
    </>
  )
}

export default App
