import { useState, useLayoutEffect, useRef } from 'react'
import bulbasaur from '/Bulbasaur.png'
import ivysaur from '/Ivysaur.png'
import venusaur from '/Venusaur.png'
//import './App.css'
import './Temp.css'

function App() {
  console.log("rendering...")
  const [items, setItems] = useState([new Array(10).fill({index: 1, name: "bulbasaur", image:bulbasaur})])
  const [dexnum, setDexnum] = useState(0)
  const [name, setName] = useState(items[dexnum].name)
  const [image, setImage] = useState(items[dexnum].image)
  const refArray = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  useLayoutEffect(() => { //sets the items to the array of json objects, where each object represents 1 pokemon
    async function fetchData() {
      const response = await fetch('./pokedex.json');
      const body = await response.json();
      setItems(body)
      setImage(body[0].image)
    }
    fetchData();
  }, []);

  const testMovement = () => {
    if (refArray[3].current) {
      const computedStyle = window.getComputedStyle(refArray[4].current)
      const margin = computedStyle.margin;
      const zIndex = computedStyle.zIndex;
      const curPosition = refArray[3].current.getBoundingClientRect();
      const nextPosition = refArray[4].current.getBoundingClientRect();

      console.log((refArray[4].current.offsetTop - refArray[3].current.offsetTop) + 'px');
      console.log(computedStyle.marginLeft);
      refArray[3].current.style.top = '103px';
      refArray[3].current.style.zIndex = zIndex;
    }
  };

  function calculateTransformations() {  //Find difference between realtive top value, left margin, z index. Do this every time the window resizes, optimally.
    const middle = Math.floor(refArray.length/2);
    for (let i = middle; i < refArray.length - 1; i++){
      const curElement = refArray[i].current;
      const nextElement = refArray[i+1].current;
      const curElementStyle = window.getComputedStyle(curElement);
      const nextElementStyle = window.getComputedStyle(nextElement);

      const topTransform = (nextElement.offsetTop - curElement.offsetTop) + 'px'; //Need to make into string so style can use it
      const zTransform = nextElementStyle.zIndex - curElementStyle.zIndex;
      const leftTransform = nextElementStyle.marginLeft - curElementStyle.marginLeft;
    }
  }

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
          <div className="entry" ref={refArray[index-dexnum+3]} id={id_string}>{index+1}: {items[index].name}</div>
        </>
      )
    }
    else {
      return (
      <>
        <div className="invisibleEntry" id={id_string}></div>
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
      <div className='information'>
          <img className='pokeImage' src={image} />
      </div>
      <div className='wheel'>
        <div className="decrementButton">
          <button onClick={testMovement}>Decrement</button>
        </div>
        <VisibleEntries num={dexnum} />
        <div className="decrementButton">
          <button onClick={IncrementDex}>Increment</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
