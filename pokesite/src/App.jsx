import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import bulbasaur from '/Bulbasaur.png'
import ivysaur from '/Ivysaur.png'
import venusaur from '/Venusaur.png'
//import './App.css'
import './Temp.css'
import './Types.css'
import './Moves.css'
import useSound from 'use-sound'
import StatsChart from './StatsChart.jsx'
import SearchBar from './SearchBar.jsx'
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
        "speed": 45,
        "total": 318
    },
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    "types": [
        "grass",
        "poison"
    ],
    "height": "2' 4\"",
    "weight": 15.2,
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg",
    "abilities": [
        {
            "name": "Overgrow",
            "effect": "When this Pokémon has 1/3 or less of its HP remaining, its grass-type moves inflict 1.5× as much regular damage.",
            "hidden": false
        },
        {
            "name": "Chlorophyll",
            "effect": "This Pokémon's Speed is doubled during strong sunlight.\n\nThis bonus does not count as a stat modifier.",
            "hidden": true
        }
    ],
    "moves": {
        "level-up": [
            {
                "key": "tackle",
                "level": 1,
                "method": "level-up"
            },
            {
                "key": "growl",
                "level": 1,
                "method": "level-up"
            },
            {
                "key": "vine-whip",
                "level": 3,
                "method": "level-up"
            },
            {
                "key": "growth",
                "level": 6,
                "method": "level-up"
            },
            {
                "key": "leech-seed",
                "level": 9,
                "method": "level-up"
            },
            {
                "key": "razor-leaf",
                "level": 12,
                "method": "level-up"
            },
            {
                "key": "poison-powder",
                "level": 15,
                "method": "level-up"
            },
            {
                "key": "sleep-powder",
                "level": 15,
                "method": "level-up"
            },
            {
                "key": "seed-bomb",
                "level": 18,
                "method": "level-up"
            },
            {
                "key": "take-down",
                "level": 21,
                "method": "level-up"
            },
            {
                "key": "sweet-scent",
                "level": 24,
                "method": "level-up"
            },
            {
                "key": "synthesis",
                "level": 27,
                "method": "level-up"
            },
            {
                "key": "worry-seed",
                "level": 30,
                "method": "level-up"
            },
            {
                "key": "power-whip",
                "level": 33,
                "method": "level-up"
            },
            {
                "key": "solar-beam",
                "level": 36,
                "method": "level-up"
            }
        ],
        "machine": [
            {
                "key": "swords-dance",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "body-slam",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "double-edge",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "rest",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "substitute",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "protect",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "sludge-bomb",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "giga-drain",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "endure",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "charm",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "false-swipe",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "sleep-talk",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "sunny-day",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "facade",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "helping-hand",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "knock-off",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "weather-ball",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "bullet-seed",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "magical-leaf",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "energy-ball",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "leaf-storm",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "grass-knot",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "venoshock",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "acid-spray",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "grass-pledge",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "grassy-terrain",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "grassy-glide",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "tera-blast",
                "level": 0,
                "method": "machine"
            },
            {
                "key": "trailblaze",
                "level": 0,
                "method": "machine"
            }
        ],
        "egg": [
            {
                "key": "petal-dance",
                "level": 0,
                "method": "egg"
            },
            {
                "key": "toxic",
                "level": 0,
                "method": "egg"
            },
            {
                "key": "curse",
                "level": 0,
                "method": "egg"
            },
            {
                "key": "ingrain",
                "level": 0,
                "method": "egg"
            }
        ],
        "tutor": [],
        "other": []
    },
    "forms": []
  }));
  const [pokemon, setPokemon] = useState({
    dexnum: 0,
    name: items[0].name,
    image: items[0].image,
    types: items[0].types,
    stats: items[0].stats,
    abilities: items[0].abilities,
    moves: items[0].moves,
    height: items[0].height,
    weight: items[0].weight,
    cry: items[0].cry,
    forms: items[0].forms
  })
  const [moveList, setMoveList] = useState([]) //the specific data for each move, not the moves of each pokemon
  const refArray = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [hovering, setHovering] = useState(false);
  let animationStep = 1;
  const intervalRef = useRef(null);
  let isScrolling = false;
  const totalAnimationSteps = 30;

  function updateMon(num) {
    let newMon = {
      dexnum: num,
      name: items[num].name,
      image: items[num].image,
      types: items[num].types,
      stats: items[num].stats,
      abilities: items[num].abilities,
      moves: items[num].moves,
      height: items[num].height,
      weight: items[num].weight,
      cry: items[num].cry,
      forms: items[num].forms
    };
    setPokemon(newMon);
    //normally try and avoid the below but it was the easiest solution to a bug where selectedIndex would persist between pokemon
    document.getElementById("formSelection").selectedIndex = 0; 
  }

  function updateForm(num) {
    let newMon = {
      dexnum: pokemon.dexnum,
      name: pokemon.forms[num].name,
      image: pokemon.forms[num].image,
      types: pokemon.forms[num].types,
      stats: pokemon.forms[num].stats,
      abilities: pokemon.forms[num].abilities,
      moves: pokemon.forms[num].moves,
      height: pokemon.forms[num].height,
      weight: pokemon.forms[num].weight,
      cry: pokemon.forms[num].cry,
      forms: pokemon.forms
    }
    setPokemon(newMon);
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
    if(pokemon.dexnum < items.length - 1){
      //let updatedDex = dexnum + 1;
      let updatedDex =  pokemon.dexnum + 1;
      updateMon(updatedDex);
    }
    else {
      updateMon(0);
    }
  }

  function decrementDex() {
    if(pokemon.dexnum != 0){
      //let updatedDex = dexnum - 1;
      let updatedDex =  pokemon.dexnum - 1;
      updateMon(updatedDex);
    }
    else {
      updateMon(items.length-1);
    }
  }

  function Abilities(){
    const [abilityIndex, setAbilityIndex] = useState(0);
    const [textEnd, setTextEnd] = useState(generateTextEnd(0));

    function incrementAbility(){
      if (abilityIndex+1 < pokemon.abilities.length){
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
      if(pokemon.abilities[index].hidden){
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
            <strong>{pokemon.abilities[abilityIndex].name}</strong> <span id="abilityTextEnd">{textEnd}</span>
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
          {pokemon.abilities[abilityIndex].effect}
        </div>
      </div>
    )
  }

  function Move({moveDetails}) {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
      clicked ? setClicked(false) : setClicked(true);
    }

    let levelDiv = <></>;

    if(moveDetails.level >= 0){
      levelDiv = <div className="level">{moveDetails.level}</div>;
    }
    else if(moveDetails.method){
      levelDiv = <div className="level">{moveDetails.method}</div>;
    }

    return (
      <>
      <div className={"move " + (clicked ? "moveClicked" : "")} onClick={handleClick}>
        {levelDiv}
        <div className="moveName">{moveDetails.name}</div>
        <div className={moveDetails.type + " moveType"}>{moveDetails.type.toUpperCase()}</div>
        <img className="moveClass" src={moveDetails.class + ".png"}></img>
        <div className="movePower">{moveDetails.power ?? "--"}</div>
        <div className="moveAccuracy">{moveDetails.accuracy ?? "--"}</div>
      </div>
      <div className={"movePanel " + (clicked ? "" : "hidden")}>
        <span className="topOfPanel"><strong>Targets: </strong>{moveDetails.target + "\t"}<strong>PP: </strong>{moveDetails.pp + "\t"}<strong>Priority: </strong>{moveDetails.pp + "\n\n"}</span>
        <span className="bodyOfPanel"><strong>Effect: </strong>{moveDetails.effect}</span>
      </div>
      </>
    )
  }

  function Moves(){
    const levelArray = [];
    const machineArray = [];
    const eggArray = [];
    const otherArray = [];
    for (let move of pokemon.moves["level-up"]){
      for (let details of moveList){
        if (move.key == details.key){
          details.level = move.level;
          levelArray.push(details);
        }
      }
    }
    for (let move of pokemon.moves["machine"]){
      for (let details of moveList){
        if (move.key == details.key){
          details.level = -1;
          machineArray.push(details);
        }
      }
    }
    for (let move of pokemon.moves["egg"]){
      for (let details of moveList){
        if (move.key == details.key){
          details.level = -1;
          eggArray.push(details);
        }
      }
    }
    for (let move of pokemon.moves["other"]){
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
        {levelArray.length > 0 ?
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
        : <div className="levelHeader maxMoves"><strong>MAX MOVES</strong></div>
        }
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

  function Wheel(){ 
    const handleMouseEnter = () => {console.log("enter"); setHovering(true)};
    const handleMouseLeave = () => {console.log("leave"); setHovering(false)};

    //<div className={'wheel ' + (hover ? '' : '')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

    return(
      <div className={'wheel ' + (hovering ? 'wheelExtend' : 'wheelRetract')} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
        <div className='pulloutBar'>
          <img id='leftArrow' src='/triangle.svg' />
        </div>
        <div className='directionButtons'>
          <div className="decrementButton">
            <button onClick={() => {
              if(pokemon.dexnum != 0 && isScrolling == false){
                isScrolling = true;
                intervalRef.current = setInterval(slideEntriesUp, 10);
              }
            }}></button>
          </div>
          <div className="incrementButton">
            <button onClick={() => {
              if(pokemon.dexnum < items.length - 1 && isScrolling == false){
                isScrolling = true;
                intervalRef.current = setInterval(slideEntriesDown, 10);
              }
            }}></button>
          </div>
        </div>
        <VisibleEntries num={pokemon.dexnum} />
      </div>
    )
  }

  function Entry({index}){ //fill refArray and the DOM with our pokemon entries
    let id_string = 'entry' + (index-pokemon.dexnum);
    if(index > -1 && index < items.length){
      return (
        <>
          <div className="entry" ref={refArray[index - pokemon.dexnum + Math.floor(refArray.length/2)]} id={id_string}>{index+1}: {items[index].name}</div> 
        </>
      )
    }
    else {
      return (
      <>
        <div className="invisibleEntry" ref={refArray[index - pokemon.dexnum + Math.floor(refArray.length/2)]} id={id_string}></div>
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
    const [soundCry] = useSound(pokemon.cry, {volume});

    return (
      <button className="cry" onClick={() => soundCry()}>
         Cry
      </button>
    )
  }

  function handleSelect(e) {
    //updateForm(e.target.getAttribute('key'));
    const index = e.target.options.selectedIndex;
    if (index == 0) {
      updateMon(pokemon.dexnum);
    }
    else{
      updateForm(index-1);
    }
  }

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
  
  useEffect(() => { //sets the items to the array of json objects, where each object represents 1 pokemon
    async function fetchData() {
      const moveFile = await fetch('./moves.json');
      const moveJson = await moveFile.json();
      setMoveList(moveJson);
      const response = await fetch('./pokedex.json');
      const body = await response.json();
      setItems(body);
    }
    fetchData();
  }, []);

  useEffect(() => { //updates the pokemon once that ^ loads
    updateMon(0);
  }, [items]);

  //These are just used for my wheel. If the wheel is taken out, these need to be commented out. Not awesome but it's how I'm doing it for the moment.
  const windowSizeRef = useWindowSize();
  useLayoutEffect(calculateTransformations, []);


  return (
    <>
    <div className='topBar'>
      <SearchBar updateFunc={updateMon} items={items}/>
    </div>
    <div className='leftAndRight'>
      <div className='left'>
        <div className='visuals'>
          <div className='imageAndType'>
              <div className='imageContainer'>
                <img className='pokeImage' src={pokemon.image} />
                <select id="formSelection" onChange={handleSelect}> 
                  <option key='0' place='0'>{items[pokemon.dexnum].name}</option>
                  {pokemon.forms?.map((form, index) => (
                    <option key={index+1} place={index+1}>{form.name}</option>
                  ))}
                </select>
              </div>
              <div className='typeBox'> 
                <Type key={pokemon.types[0]} typeName={pokemon.types[0]} />
                {pokemon.types.length > 1 ? //This was previously mapped, but for styling I wanted to define manually
                  <Type key={pokemon.types[1]} typeName={pokemon.types[1]} /> 
                  : <></>
                }
              </div>          
          </div>
          <div className="rightOfImage">
            <div className='statsChartBox'>
              <StatsChart stats={pokemon.stats}/>
            </div>
            <div className='baseStatTotal'>
                <strong>Total: {pokemon.stats.total}</strong>
            </div>
            <div className="heightAndWeight">
              <div>
                {"Height: " + pokemon.height}
              </div>
              <div>  
                {"Weight: " + pokemon.weight + "lbs"}
              </div>
            </div>
            <Cry />
          </div>
          <Wheel />
        </div>
        <div className="test">
          <Moves />
          <Abilities />
        </div>
      </div>
    </div>
    <div className='navBar'>
      <button className='monBtn' onClick={decrementDex}>
        &lt; {(pokemon.dexnum > 0) ? items[pokemon.dexnum-1].name : items[items.length-1].name}
      </button>
      <div className='pokeName'>
          {pokemon.name}
      </div>
      <button className='monBtn' onClick={incrementDex}>
          {(pokemon.dexnum < items.length-1) ? items[pokemon.dexnum+1].name : items[0].name} &gt;
      </button>
    </div>
    </>
  )
}

export default App
