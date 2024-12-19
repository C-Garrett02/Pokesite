import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import bulbasaur from '/Bulbasaur.png'
import ivysaur from '/Ivysaur.png'
import venusaur from '/Venusaur.png'
//import './App.css'
import './Temp.css'

const transformationArray = [];

function App() {
  console.log("rendering...");
  const [items, setItems] = useState([new Array(10).fill({index: 1, name: "bulbasaur", image:bulbasaur})]);
  const [dexnum, setDexnum] = useState(0);
  const [name, setName] = useState(items[dexnum].name);
  const [image, setImage] = useState(items[dexnum].image);
  const refArray = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  let animationStartTime = 0;
  let AnimationStep = 1;
  const intervalRef = useRef(null);

  useEffect(() => { //sets the items to the array of json objects, where each object represents 1 pokemon
    async function fetchData() {
      const response = await fetch('./pokedex.json');
      const body = await response.json();
      setItems(body)
      setImage(body[0].image)
    }
    fetchData();
  }, []);

  useLayoutEffect(calculateTransformations, []); //LayoutEffect as we need to measure components after rendering.

  function calculateTransformations() {  //Find difference between realtive top value, left margin, z index. Do this every time the window resizes, optimally, so the logic doesn't have to rerun every render
    console.log("calculating...")
    transformationArray.length = 0;
    const middle = Math.floor(refArray.length/2);
    const matchStr = /\((\d*\.*\d*)\)/;
    for (let i = middle; i < refArray.length - 1; i++){
      const curElement = refArray[i].current;
      const nextElement = refArray[i+1].current;
      const curElementStyle = window.getComputedStyle(curElement);
      const nextElementStyle = window.getComputedStyle(nextElement);

      const transformation = { //Values we'll have to add on to current values, gradually, to create a slide effect.
        top: (nextElement.offsetTop - curElement.offsetTop), 
        zIndex: nextElementStyle.zIndex - curElementStyle.zIndex,
        marginLeft: parseInt(nextElementStyle.marginLeft) - parseInt(curElementStyle.marginLeft),
        brightness: nextElementStyle.filter.match(matchStr)[1] - curElementStyle.filter.match(matchStr)[1]
      };

      transformationArray.push(transformation)
      console.log(transformation)
    }
    //refArray[3].current.style.top = transformationArray[0].top + 'px';
    //refArray[3].current.style.zIndex = +window.getComputedStyle(refArray[3].current).zIndex + +transformationArray[0].zIndex;
    //refArray[3].current.style.marginLeft = transformationArray[0].marginLeft + 'px';
  }

    /*const testMovement = () => {
    if (refArray[3].current) {
      const computedStyle = window.getComputedStyle(refArray[4].current);
      const marginLeft = computedStyle.marginLeft;
      const zIndex = computedStyle.zIndex;
      const curPosition = refArray[3].current.getBoundingClientRect();
      const nextPosition = refArray[4].current.getBoundingClientRect();

      console.log((refArray[4].current.offsetTop - refArray[3].current.offsetTop) + 'px');
      console.log(computedStyle.marginLeft);
      refArray[3].current.style.top = '103px';
      refArray[3].current.style.zIndex = zIndex;
      refArray[3].current.style.marginLeft = marginLeft;
    }
  };*/

  function slideEntryUp(entry) {
    const timePassed = Date.now() - animationStartTime
    console.log(timePassed);
    let j = 3;

    refArray[5].current.style.top = (transformationArray[1].top)/10*AnimationStep + 'px'; //NEEDS TO BE ADDED ONTO CURRENT NOT JUST ASSIGNED A FRACTION OF IT!!!!!!!
    refArray[5].current.style.zIndex = (+window.getComputedStyle(refArray[5].current).zIndex + +transformationArray[1].zIndex)/10*AnimationStep;
    refArray[5].current.style.marginLeft = (transformationArray[1].marginLeft/10)*AnimationStep + 'px';
    refArray[5].current.style.filter = 'brightness(' + (transformationArray[1].brightness/10*AnimationStep) + ')'
    console.log(refArray[5].current.style.marginLeft)

    for (let i = Math.floor(refArray.length/2); i < refArray.length - 1; i++){
      //refArray[i].current.style.top = (transformationArray[Math.abs(4-i)].top)/10*AnimationStep + 'px';
      //refArray[i].current.style.zIndex = (+window.getComputedStyle(refArray[i].current).zIndex + +transformationArray[Math.abs(4-i)].zIndex)/10*AnimationStep;
      //refArray[i].current.style.marginLeft = (transformationArray[Math.abs(4-i)].marginLeft/10)*AnimationStep + 'px';
      //refArray[i].current.style.filter = 'brightness(' + (transformationArray[Math.abs(4-i)].brightness/10*AnimationStep) + ')'
    }
    //console.log(refArray[0])
    //console.log(transformationArray[3])

    j = 0;
    AnimationStep++;
    //console.log(transformationArray[0])

    if(AnimationStep == 11){
      AnimationStep = 1;
      clearInterval(intervalRef.current);
    }
  }

  function slideEntryDown(entry) {
    const initialTime = Date.now();
    console.log(Date.now()-initialTime);
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

  function Entry({index}){ //fill refArray and the DOM with our pokemon entries
    let id_string = 'entry' + (index-dexnum);
    if(index > -1 && index < items.length){
      return (
        <>
          <div className="entry" ref={refArray[index - dexnum + Math.floor(refArray.length/2)]} id={id_string}>{index+1}: {items[index].name}</div>
        </>
      )
    }
    else {
      return (
      <>
        <div className="invisibleEntry" ref={refArray[index - dexnum + Math.floor(refArray.length/2)]} id={id_string}></div>
      </>
      )
    }
  }

  function VisibleEntries({num}){
    return(
      <>
        <div className="entries" >
          <Entry index={num-4}/>
          <Entry index={num-3}/>
          <Entry index={num-2}/>
          <Entry index={num-1}/>
          <Entry index={num}/>
          <Entry index={num+1}/>
          <Entry index={num+2}/>
          <Entry index={num+3}/>
          <Entry index={num+4}/>
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
        <div className='directionButtons'>
          <div className="decrementButton">
            <button onClick={() => {
              //DecrementDex();

              animationStartTime = Date.now();
              intervalRef.current = setInterval(slideEntryUp, 10);
            }}>Decrement</button>
          </div>
          <div className="incrementButton">
            <button onClick={IncrementDex}>Increment</button>
          </div>
        </div>
        <VisibleEntries num={dexnum} />
      </div>
    </div>
    </>
  )
}

export default App
