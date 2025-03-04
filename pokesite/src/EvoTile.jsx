import { useState, useEffect } from 'react'

function EvoTile({ pokemon, items }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (stage.length > 1) {
      //bring up sub menu?
    }
  }

  let imgsrc = "";

  for (let item of items){ //finds pokemon in items. Really should find a way to pass the index or img in more easily, but this operation takes very little time overall.
    if (item.species.toLowerCase() == pokemon.name || item.key == pokemon.name){ 
      imgsrc = item.image;
      break;
    }
    else {
      for (let form of item.forms){
        if (form.key == pokemon.name){
          imgsrc = form.image;
          break;
        }
      }
    }
  }

  return (
    <div className="evoTile" onClick={handleClick}>
      <img className="tileImage" src={imgsrc} />
    </div>
  )
}

export default EvoTile;