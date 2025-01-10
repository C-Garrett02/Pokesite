import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import bulbasaur from '/Bulbasaur.png'
import ivysaur from '/Ivysaur.png'
import venusaur from '/Venusaur.png'
//import './App.css'
import './Temp.css'
import './Types.css'
import './Moves.css'
import useSound from 'use-sound'
import StatsChart from './StatsChart.jsx'
import Chart from 'chart.js/auto';

const forwardArr = [];
const backwardsArr = [];

function debounce(callback, wait) {
  let timeout = null;
  return(() => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(callback, wait);
  })
}

function App() {
  const [items, setItems] = useState(new Array(10).fill({
    "id": 1,
    "name": "Bulbasaur",
    "stats": {
      "hp": 45,
      "attack": 49,
      "defense": 49,
      "special-attack": 65,
      "special-defense": 65,
      "speed": 45
    },
    "height": 7,
    "weight": 10,
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    "types": [
      "grass",
      "poison"
    ],
    "abilities": [
      {
          "name": "Overgrow",
          "effect": "When this Pokémon has 1/3 or less of its HP remaining, its grass-type moves inflict 1.5× as much regular damage.",
          "hidden": false
      },
      {
          "name": "Chlorophyll",
          "effect": "This Pokémon's Speed is doubled during strong sunlight.This bonus does not count as a stat modifier.",
          "hidden": true
      }
    ],
    "moves": {
      "level-up": [],
      machine: [],
      egg: [],
      tutor: [],
      other: []
    },
    "forms": []
  }));
  const [moveList, setMoveList] = useState([])
  const [dexnum, setDexnum] = useState(0);
  const [name, setName] = useState(items[dexnum].name);
  const [image, setImage] = useState(items[dexnum].image);
  const [types, setTypes] = useState(items[dexnum].types)
  const [stats, setStats] = useState(items[dexnum].stats);
  const [abilities, setAbilities] = useState(items[dexnum].abilities);
  const [moves, setMoves] = useState(items[dexnum].moves);
  const [height, setHeight] = useState(items[dexnum].height);
  const [weight, setWeight] = useState(items[dexnum].weight);
  const [cry, setCry] = useState(items[dexnum].cry);
  const refArray = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const windowSizeRef = useWindowSize();
  let animationStep = 1;
  //const totalAnimationSteps = 30;
  const intervalRef = useRef(null);
  let isScrolling = false;
  
  function useWindowSize(){ //custom Hook that listens to window size, though its purpose currently is to rerender certain things on resize.
    const windowSizeRef = useRef([0, 0]);
    useLayoutEffect(() => {
      const updateSize = debounce (() => {
        windowSizeRef.current = [window.innerWidth, window.innerHeight];
        calculateTransformations();
      }, 100)
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return windowSizeRef;
  }

  function calculateTransformations() {  //Find difference between realtive top value, left margin, brightness. Do this every time the window resizes, optimally, so the logic doesn't have to rerun every rerender
    forwardArr.length = 0;
    backwardsArr.length = 0;
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
    }

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
    }
  
  }

  function slideEntriesUp(totalAnimationSteps = 30) {
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
      decrementDex();
      isScrolling = true;
    }
  }

  function slideEntriesDown(totalAnimationSteps = 30) {
    const multiplyBy = animationStep/totalAnimationSteps
    for (let i = 1; i < refArray.length; i++){ //loop through 
      refArray[i].current.style.top = (+backwardsArr[i-1].top)*multiplyBy + 'px'; 
      refArray[i].current.style.marginLeft = +backwardsArr[i-1].marginLeft.start + (+backwardsArr[i-1].marginLeft.increment)*multiplyBy + 'px'; //offload the addition here to the calculation function in the future, perhaps.
      refArray[i].current.style.filter = 'brightness(' + +(+backwardsArr[i-1].brightness.start + (+backwardsArr[i-1].brightness.increment)*multiplyBy) + ')';
    }

    animationStep++;
    if(animationStep > totalAnimationSteps - 1){ //last frame will be rendered
      animationStep = 1;
      clearInterval(intervalRef.current);
      incrementDex();
      isScrolling = false;
    }
  }

  function incrementDex() { 
    if(dexnum < items.length - 1){
      let updatedDex = dexnum + 1;
      setDexnum(updatedDex);
      setName(items[updatedDex].name);
      setImage(items[updatedDex].image);
      setTypes(items[updatedDex].types);
      setStats(items[updatedDex].stats);
      setAbilities(items[updatedDex].abilities);
      setMoves(items[updatedDex].moves);
      setWeight(items[updatedDex].weight);
      setHeight(items[updatedDex].height);
      setCry(items[updatedDex].cry);
    }
  }

  function decrementDex() {
    if(dexnum != 0){
      let updatedDex = dexnum - 1;
      setDexnum(updatedDex);
      setName(items[updatedDex].name);
      setImage(items[updatedDex].image);
      setTypes(items[updatedDex].types);
      setStats(items[updatedDex].stats);
      setAbilities(items[updatedDex].abilities);
      setMoves(items[updatedDex].moves);
      setWeight(items[updatedDex].weight);
      setHeight(items[updatedDex].height);
      setCry(items[updatedDex].cry);
    }
  }

  function filterByInput(input) { //should only call if input.length >= 3. While this likely doesnt cause performance issues, can be optimized if needed.
    return(
      items.filter((pokemon) => pokemon.name.toLowerCase().includes(input.toLowerCase())
      )
    )
  }

  function FilteredDex({input}){ //returns list of divs that provide matches. Does not exist in dom unless there are results to be returned.
    const jumpToMon = (e) => {
      const updatedDex = parseInt(e.target.getAttribute('number'))-1;
      setDexnum(updatedDex);
      setName(items[updatedDex].name);
      setImage(items[updatedDex].image);
      setTypes(items[updatedDex].types);
      setStats(items[updatedDex].stats);
      setAbilities(items[updatedDex].abilities);
      setMoves(items[updatedDex].moves);
      setWeight(items[updatedDex].weight);
      setHeight(items[updatedDex].height);
      setCry(items[updatedDex].cry);
    }
    let filteredList = <></>

    if (input.length >= 3){
        filteredList = filterByInput(input).map(pokemon => 
          <button key={pokemon.name} number={pokemon.id} className='monButton' onClick={jumpToMon}>{pokemon.name}</button>
        )
    }

    if(filteredList.length){
      return <div className='listedMon'>{filteredList}</div>
    }
    else{
      return null;
    }
  }

  function SearchBar(){ //The search bar for pokemon and the search results
    const [inputStr, setInputStr] = useState('');

    const handleState = (e) => {
      setInputStr(e.target.value);
    };

    return (
      <div className='searchBar'>
        <input name='Pokemon Search Bar' className='monInput' placeholder='Search for Pokemon' value={inputStr} onChange={handleState}></input>
        <FilteredDex input={inputStr} />
      </div>
    )
  }

  function Abilities(){
    const [abilityIndex, setAbilityIndex] = useState(0);
    const [textEnd, setTextEnd] = useState(generateTextEnd(0));
    function incrementAbility(){
      if (abilityIndex+1 < abilities.length){
        setTextEnd(generateTextEnd(abilityIndex+1));
        setAbilityIndex(abilityIndex+1);
      }
    }
    function decrementAbility(){
      if (abilityIndex-1 > -1){
        setTextEnd(generateTextEnd(abilityIndex-1));
        setAbilityIndex(abilityIndex-1);
      }
    }
    function generateTextEnd(index){
      if(abilities[index].hidden){
        return "(Hidden)";
      }
      else{
        return "(Ability " + (index+1) + ")";
      }
    }

    return (
      <div className='abilityBox'>
        <div className='abilityHeader'>
          <div className='abilityName'>
            <strong>{abilities[abilityIndex].name}</strong> <span id="abilityTextEnd">{textEnd}</span>
          </div>
          <div className='directionBtns'>
            <button className='abilityBtn' onClick={decrementAbility}>
              <img id='leftArrow' src='/triangle.svg' />
            </button>
            <button className='abilityBtn' onClick={incrementAbility}>
              <img id='rightArrow' src='/triangle.svg' />
            </button>
          </div>
        </div>
        <div className='abilityDescription'>
          {abilities[abilityIndex].effect}
        </div>
      </div>
    )
  }

  function Move({moveDetails}) {
    let levelDiv = <></>;

    if(moveDetails.level >= 0){
      levelDiv = <div className="level">{moveDetails.level}</div>;
    }
    else if(moveDetails.method){
      levelDiv = <div className="level">{moveDetails.method}</div>;
    }

    return (
      <div className="move">
        {levelDiv}
        <div className="moveName">{moveDetails.name}</div>
        <div className={moveDetails.type + " moveType"}>{moveDetails.type.toUpperCase()}</div>
        <img className="moveClass" src={moveDetails.class + ".png"}></img>
        <div className="movePower">{moveDetails.power ?? "--"}</div>
        <div className="moveAccuracy">{moveDetails.accuracy ?? "--"}</div>
      </div>
    )
  }

  function Moves(){
    const levelArray = [];
    const machineArray = [];
    const eggArray = [];
    const otherArray = [];
    for (let move of moves["level-up"]){
      for (let details of moveList){
        if (move.key == details.key){
          details.level = move.level;
          levelArray.push(details);
        }
      }
    }
    for (let move of moves["machine"]){
      for (let details of moveList){
        if (move.key == details.key){
          details.level = -1;
          machineArray.push(details);
        }
      }
    }
    for (let move of moves["egg"]){
      for (let details of moveList){
        if (move.key == details.key){
          details.level = -1;
          eggArray.push(details);
        }
      }
    }
    for (let move of moves["other"]){
      for (let details of moveList){
        if (move.key == details.key){
          details.level = -1;
          let copy = details
          copy.method = move.method;
          otherArray.push(copy);
        }
      }
    }

    return (
      <div className="moveList">
        <div className="levelHeader">
          <div className="categoryTitle">Level Moves</div>
          <div className="levelHeaderDetails">
            <div className="level">Level</div>
            <div className="moveName">Move</div>
            <div className="typeHeader">Type</div>
            <div className="moveClass">Class</div>
            <div className="movePower">Power</div>
            <div className="moveAccuracy">Accuracy</div>
          </div>
        </div>
        {levelArray?.map((move) => (
            <Move key={move.key} moveDetails={move} />
          ))}
        
        {machineArray.length > 0 ?
        <div className="levelHeader">
          <div className="categoryTitle">Machine Moves</div>
          <div className="levelHeaderDetails">
            <div className="moveName">Move</div>
            <div className="typeHeader">Type</div>
            <div className="moveClass">Class</div>
            <div className="movePower">Power</div>
            <div className="moveAccuracy">Accuracy</div>
          </div>
        </div>
          : <></>
        }
        {machineArray?.map((move) => (
            <Move key={move.key} moveDetails={move} />
          ))}

        {eggArray.length > 0 ?
        <div className="levelHeader">
          <div className="categoryTitle">Egg Moves</div>
          <div className="levelHeaderDetails">
            <div className="moveName">Move</div>
            <div className="typeHeader">Type</div>
            <div className="moveClass">Class</div>
            <div className="movePower">Power</div>
            <div className="moveAccuracy">Accuracy</div>
          </div>
        </div>
        : <></>
        }

        {eggArray?.map((move) => (
            <Move key={move.key} moveDetails={move} />
          ))}

        {otherArray.length > 0 ?
        <div className="levelHeader">
          <div className="categoryTitle">Other Moves</div>
          <div className="levelHeaderDetails">
            <div className="level">Method</div>
            <div className="moveName">Move</div>
            <div className="typeHeader">Type</div>
            <div className="moveClass">Class</div>
            <div className="movePower">Power</div>
            <div className="moveAccuracy">Accuracy</div>
          </div>
        </div>
        : <></>
        }

        {otherArray?.map((move) => (
            <Move key={move.key} moveDetails={move} />
          ))}
      </div>
    )
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

  function Type({typeName}){
    const classString = typeName + ' type';
    const typeCaps = typeName.toUpperCase();
    return(
      <div className={classString}>{typeCaps}</div>
    )
  }

  function Cry(){
    let volume = 0.05;
    const [soundCry] = useSound(cry, {volume});

    return (
      <button className="cry" onClick={() => soundCry()}>
         Play Sound
      </button>
    )
  }
  
  useEffect(() => { //sets the items to the array of json objects, where each object represents 1 pokemon
    async function fetchData() {
      const moveFile = await fetch('./moves.json');
      const moveJson = await moveFile.json();
      setMoveList(moveJson);
      const response = await fetch('./pokedex.json');
      const body = await response.json();
      setItems(body);
      setImage(body[0].image);
      setTypes(body[0].types);
      setStats(body[0].stats);
      setAbilities(body[0].abilities);
      setMoves(body[0].moves);
      setWeight(body[0].weight);
      setHeight(body[0].height);
      setCry(body[0].cry);
    }
    fetchData();
  }, []);

  useLayoutEffect(calculateTransformations, []);

  return (
    <>
    <div className='topBar'>
      <SearchBar />
    </div>
    <div className='leftAndRight'>
      <div className='left'>
        <div className='visuals'>
          <div className='imageAndType'>
              <div className='imageContainer'>
                <img className='pokeImage' src={image} />
              </div>
              <div className='typeBox'>
                {types?.map((type) => (
                  <Type key={type} typeName={type} />
                ))}
              </div>
          </div>
          <div className="rightOfImage">
            <div className='statsChartBox'>
              <StatsChart stats={stats}/>
            </div>
            <div className='baseStatTotal'>
                <strong>Total: {stats.total}</strong>
            </div>
            <div className="heightAndWeight">
              <div>
                {"Height: " + height}
              </div>
              <div>  
                {"Weight: " + weight + "lbs"}
              </div>
            </div>
            <Cry />
          </div>
        </div>
        <div className="test">
          <Moves />
          <Abilities />
        </div>
      </div>

      <div className='wheel'>
        <div className='directionButtons'>
          <div className="decrementButton">
            <button onClick={() => {
              if(dexnum != 0 && isScrolling == false){
                isScrolling = true;
                intervalRef.current = setInterval(slideEntriesUp, 10);
              }
            }}></button>
          </div>
          <div className="incrementButton">
            <button onClick={() => {
              if(dexnum < items.length - 1 && isScrolling == false){
                isScrolling = true;
                intervalRef.current = setInterval(slideEntriesDown, 10);
              }
            }}></button>
          </div>
        </div>
        <VisibleEntries num={dexnum} />
      </div>
    </div>
    </>
  )
}

export default App
