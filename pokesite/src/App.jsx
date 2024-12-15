import { useState, useLayoutEffect } from 'react'
import bulbasaur from '/Bulbasaur.png'
import ivysaur from '/Ivysaur.png'
import venusaur from '/Venusaur.png'
//import './App.css'
import './Temp.css'

function App() {
  const [items, setItems] = useState([new Array(10).fill({id: 1, name: "bulbasaur", image:bulbasaur})])
  const [dexnum, setDexnum] = useState(0)
  const [name, setName] = useState(items[dexnum].name)
  const [image, setImage] = useState(items[dexnum].image)

  useLayoutEffect(() => { 
    async function fetchData() {
      const response = await fetch('./pokedex.json');
      const body = await response.json();
      setItems(body)
      setImage(body[0].image)
    }
    fetchData();
  }, []);

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
        <img className='pokeImage' src={image} />
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
