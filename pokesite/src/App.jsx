import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import bulbasaur from '/Bulbasaur.png'
import ivysaur from '/Ivysaur.png'
import venusaur from '/Venusaur.png'
//import './App.css'
import './Temp.css'

const forwardArr = [];
const backwardsArr = [];

function App() {
  //console.log("rendering...");
  const [items, setItems] = useState([new Array(10).fill({index: 1, name: "bulbasaur", image:bulbasaur})]);
  const [dexnum, setDexnum] = useState(0);
  const [name, setName] = useState(items[dexnum].name);
  const [image, setImage] = useState(items[dexnum].image);
  const refArray = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  let animationStep = 1;
  const totalAnimationSteps = 30;
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
    //console.log("calculating...")
    forwardArr.length = 0;
    const matchStr = /\((\d*\.*\d*)\)/;

    for (let i = 0; i < refArray.length - 1; i++){ //For decrements
      const curElement = refArray[i].current;
      const nextElement = refArray[i+1].current;
      const curElementStyle = window.getComputedStyle(curElement);
      const nextElementStyle = window.getComputedStyle(nextElement);

      const transformation = { //Values we'll have to add on to current values, gradually, to create a slide effect. Everything but top will need a starting and ending reference.
        top: (nextElement.offsetTop - curElement.offsetTop), 
        marginLeft: {
          start: parseInt(curElementStyle.marginLeft),
          increment: parseInt(nextElementStyle.marginLeft) - parseInt(curElementStyle.marginLeft),
          end: parseInt(nextElementStyle.marginLeft)
        },
        brightness: {
          start: curElementStyle.filter.match(matchStr)[1],
          increment: nextElementStyle.filter.match(matchStr)[1] - curElementStyle.filter.match(matchStr)[1],
          end: nextElementStyle.filter.match(matchStr)[1]
        }
      };
      forwardArr.push(transformation)
      console.log(transformation)
    }

    console.log('--------------')

    for (let i = 1; i < refArray.length; i++){ //For increments
      const curElement = refArray[i].current;
      const nextElement = refArray[i-1].current;
      const curElementStyle = window.getComputedStyle(curElement);
      const nextElementStyle = window.getComputedStyle(nextElement);

      const transformation = { //Values we'll have to add on to current values, gradually, to create a slide effect. Everything but top will need a starting and ending reference.
        top: (nextElement.offsetTop - curElement.offsetTop), 
        marginLeft: {
          start: parseInt(curElementStyle.marginLeft),
          increment: parseInt(nextElementStyle.marginLeft) - parseInt(curElementStyle.marginLeft),
          end: parseInt(nextElementStyle.marginLeft)
        },
        brightness: {
          start: curElementStyle.filter.match(matchStr)[1],
          increment: nextElementStyle.filter.match(matchStr)[1] - curElementStyle.filter.match(matchStr)[1],
          end: nextElementStyle.filter.match(matchStr)[1]
        }
      };
      backwardsArr.push(transformation)
      console.log(transformation)
    }
  
  }

  function slideEntriesUp() {
    const multiplyBy = animationStep/totalAnimationSteps

    for (let i = 0; i < refArray.length - 1; i++){ //loop through 
      refArray[i].current.style.top = (+forwardArr[i].top)*multiplyBy + 'px'; 
      refArray[i].current.style.marginLeft = +forwardArr[i].marginLeft.start + (+forwardArr[i].marginLeft.increment)*multiplyBy + 'px'; //offload the addition here to the calculation function in the future, perhaps.
      refArray[i].current.style.filter = 'brightness(' + +(+forwardArr[i].brightness.start + (+forwardArr[i].brightness.increment)*multiplyBy) + ')';
    }

    animationStep++;
    if(animationStep > totalAnimationSteps - 1){ //last frame will be rendered
      animationStep = 1;
      clearInterval(intervalRef.current);
      DecrementDex();
    }
  }

  function slideEntriesDown() {
    const multiplyBy = animationStep/totalAnimationSteps
    for (let i = 1; i < refArray.length; i++){ //loop through 
      refArray[i].current.style.top = (+backwardsArr[i-1].top)*multiplyBy + 'px'; 
      refArray[i].current.style.marginLeft = +backwardsArr[i-1].marginLeft.start + (+backwardsArr[i-1].marginLeft.increment)*multiplyBy + 'px'; //offload the addition here to the calculation function in the future, perhaps.
      refArray[i].current.style.filter = 'brightness(' + +(+backwardsArr[i-1].brightness.start + (+backwardsArr[i-1].brightness.increment)*multiplyBy) + ')';
    }

    //refArray[0].current.style.top = (+backwardsArr[3].top)*multiplyBy + 'px'; 
    //refArray[0].current.style.marginLeft = +backwardsArr[3].marginLeft.start + (+backwardsArr[3].marginLeft.increment)*multiplyBy + 'px'; //offload the addition here to the calculation function in the future, perhaps.
    //refArray[0].current.style.filter = 'brightness(' + +(+backwardsArr[3].brightness.start + (+backwardsArr[3].brightness.increment)*multiplyBy) + ')';

    animationStep++;
    if(animationStep > totalAnimationSteps - 1){ //last frame will be rendered
      animationStep = 1;
      clearInterval(intervalRef.current);
      IncrementDex();
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
              if(dexnum != 0){
                intervalRef.current = setInterval(slideEntriesUp, 1000/60);
              }
            }}>Decrement</button>
          </div>
          <div className="incrementButton">
            <button onClick={() => {
              if(dexnum < items.length - 1){
                intervalRef.current = setInterval(slideEntriesDown, 10);
              }
            }}>Increment</button>
          </div>
        </div>
        <VisibleEntries num={dexnum} />
      </div>
    </div>
    </>
  )
}

export default App
