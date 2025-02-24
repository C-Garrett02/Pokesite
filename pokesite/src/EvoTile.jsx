import { useState, useEffect } from 'react'

function EvoTile({ pokemonName, items }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (stage.length > 1) {
      //bring up sub menu?
    }
  }

  let imgsrc = "";

  for (let item of items){ //finds pokemon in items. Really should find a way to pass the index or img in more easily, but this operation takes very little time overall.
    console.log(item.key);
    if (item.species.toLowerCase() == pokemonName || item.key == pokemonName){
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