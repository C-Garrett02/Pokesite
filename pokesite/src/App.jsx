import { useState, useLayoutEffect } from 'react'
import bulbasaur from '/Bulbasaur.png'
import ivysaur from '/Ivysaur.png'
import venusaur from '/Venusaur.png'
//import './App.css'
import './Temp.css'

function App() {
  const [items, setItems] = useState([new Array(10).fill({index: 1, name: "bulbasaur", image:bulbasaur})])
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

  function Entry({index}){
    let id_string = 'entry' + (index-dexnum);
    if(index > -1 && index < items.length){
      return (
        <>
          <div className="entry" id={id_string}>{index+1}: {items[index].name}</div>
        </>
      )
    }
    else {
      return (
      <>
        <div className="invisibleEntry"></div>
      </>
      )
    }
  }

  function VisibleEntries({num}){
    return(
      <>
        <div className="entries" >
          <Entry index={num-3}/>
          <Entry index={num-2}/>
          <Entry index={num-1}/>
          <Entry index={num}/>
          <Entry index={num+1}/>
          <Entry index={num+2}/>
          <Entry index={num+3}/>
        </div>
      </>
    )
  }


  return (
    <>
    <div className='imageAndWheel'>
      <div>
          <img className='pokeImage' src={image} />
      </div>
      <div>
        <button onClick={DecrementDex}>Decrement</button>
        <VisibleEntries num={dexnum} />
        <button onClick={IncrementDex}>Increment</button>
      </div>
    </div>
    </>
  )
}

export default App
