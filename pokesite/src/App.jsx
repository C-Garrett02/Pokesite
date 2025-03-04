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
import Abilities from './Abilities.jsx'
import Moves from './Moves.jsx'
import BetterWheel from './BetterWheel.jsx'
import EvoChains from './EvoChains.jsx'

function debounce(callback, wait) {
  let timeout = null;
  return (() => {
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
    "forms": [],
    "species": "Bulbasaur",
    "chain_id": "1"
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
    forms: items[0].forms,
    species: items[0].species,
    chainid: items[0].chain_id
  })
  const [moveList, setMoveList] = useState([]); //the specific data for each move, not the moves of each pokemon
  const [chains, setChains] = useState([]);
  //let animationStep = 1;
  //const totalAnimationSteps = 30;
  //const intervalRef = useRef(null);
  //let isScrolling = false;

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
      forms: items[num].forms,
      species: items[num].species,
      chainid: items[num].chain_id
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
      forms: pokemon.forms,
      species: pokemon.species,
      chainid: pokemon.chainid
    }
    setPokemon(newMon);
  }

  function incrementDex() {
    if (pokemon.dexnum < items.length - 1) {
      //let updatedDex = dexnum + 1;
      let updatedDex = pokemon.dexnum + 1;
      updateMon(updatedDex);
    }
    else {
      updateMon(0);
    }
  }

  function decrementDex() {
    if (pokemon.dexnum != 0) {
      //let updatedDex = dexnum - 1;
      let updatedDex = pokemon.dexnum - 1;
      updateMon(updatedDex);
    }
    else {
      updateMon(items.length - 1);
    }
  }

  function Type({ typeName }) {
    const classString = typeName + ' type';
    const typeCaps = typeName.toUpperCase();
    return (
      <div className={classString}>{typeCaps}</div>
    )
  }

  function Cry() {
    let volume = 0.05;
    const [soundCry] = useSound(pokemon.cry, { volume });
    return (
      <button className="cry" onClick={() => soundCry()}>
        <img src="speaker.svg" id="speakerIcon" />
      </button>
    )
  }

  function handleSelect(e) {
    //updateForm(e.target.getAttribute('key'));
    const index = e.target.options.selectedIndex;
    if (index == 0) {
      updateMon(pokemon.dexnum);
    }
    else {
      updateForm(index - 1);
    }
  }

  useEffect(() => { //sets the items to the array of json objects, where each object represents 1 pokemon
    async function fetchData() {
      const moveFile = await fetch('./moves.json');
      const moveJson = await moveFile.json();
      setMoveList(moveJson);
      const chainFile = await fetch('./evolutions.json');
      const chainJson = await chainFile.json();
      setChains(chainJson);
      const response = await fetch('./pokedex.json');
      const body = await response.json();
      setItems(body);
    }
    fetchData();
  }, []);

  useEffect(() => { //updates the pokemon once that ^ loads
    updateMon(0);
  }, [items]);

  return (
    <>
      <div className='topBar'>
        <SearchBar updateFunc={updateMon} items={items} />
      </div>
      <div className='leftAndRight'>
        <div className='left'>
          <div className='visuals'>
            <div className='imageAndType'>
              <div className='imageContainer'>
                <img className='pokeImage' src={pokemon.image} />
                <Cry />
                <select id="formSelection" onChange={handleSelect}>
                  <option key='0' place='0'>{items[pokemon.dexnum].name}</option>
                  {pokemon.forms?.map((form, index) => (
                    <option key={index + 1} place={index + 1}>{form.name}</option>
                  ))}
                </select>
              </div>
              <div className="extraInfo">
                <div className='typeBox'>
                  <Type key={pokemon.types[0]} typeName={pokemon.types[0]} />
                  {pokemon.types.length > 1 ? //This was previously mapped, but for styling I wanted to define manually
                    <Type key={pokemon.types[1]} typeName={pokemon.types[1]} />
                    : <></>
                  }
                </div>
                <div className="heightAndWeight">
                  <div className="height">
                    {"Height: " + pokemon.height}
                  </div>
                  <div className="weight">
                    {"Weight: " + pokemon.weight + " lbs"}
                  </div>
                </div>
              </div>
            </div>
            <div className="rightOfImage">
              <div className='statsChartBox'>
                <StatsChart stats={pokemon.stats} />
              </div>
              <div className='baseStatTotal'>
                <strong>Total: {pokemon.stats.total}</strong>
              </div>
              <EvoChains chains={chains} chainid={pokemon.chainid} items={items} name={pokemon.species}/>
            </div>
          </div>
          <div className="test">
            <Moves pokemon={pokemon} moveList={moveList} />
            <Abilities key={pokemon.name} pokemon={pokemon} />
          </div>
        </div>
        <BetterWheel items={items} pokemon={pokemon} updateFunc={updateMon} />
      </div>
      <div className='navBar'>
        <div className='pokeName'>
          {pokemon.species}
        </div>
      </div>
    </>
  )
}

export default App
