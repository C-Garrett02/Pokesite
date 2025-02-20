import { useState, useEffect } from 'react'

function EvoTile({ pokemonName, items }) {

  // What to do here...
  // I need this tile to know whether it's a "mystery" tile or not. This is based on two factors.
  // 1) does this evo stage have multiple possibilities
  // 2) is the viewed/current pokemon this stage?

  // If 1 but not 2, mystery tile until clicked
  // If 1 && 2, then default to current pokemon

  //Mystery tile is... maybe convoluted. 
  //Maybe just default to a *line* where the selected pokemon appears.

  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (stage.length > 1) {
      //bring up sub menu?
    }
  }

  let imgsrc = "";

  for (let item of items){
    //console.log(pokemonName);
    if (item.species.toLowerCase() == pokemonName){
      imgsrc = item.image;
      break;
    }
  }

  return (
    <div className="evoTile" onClick={handleClick}>
      <img className="tileImage" src={imgsrc} />
    </div>
  )
}

export default EvoTile;