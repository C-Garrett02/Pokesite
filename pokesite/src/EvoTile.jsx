import { useState, useEffect } from 'react'

function EvoTile({moveDetails, stage}) {

    // What to do here...
    // I need this tile to know whether it's a "mystery" tile or not. This is based on two factors.
    // 1) does this evo stage have multiple possibilities
    // 2) is the viewed/current pokemon this stage?

    // If 1 but not 2, mystery tile until clicked
    // If 1 && 2, then default to current pokemon
    // This class should probably be passed the next stage
    // Should probably be built from the first evolution every time

   const [clicked, setClicked] = useState(false);

   const handleClick = () => {
     clicked ? setClicked(false) : setClicked(true);
   }

   if(moveDetails.level >= 0){
     levelDiv = <div className="level">{moveDetails.level}</div>;
   }
   else if(moveDetails.method){
     levelDiv = <div className="level">{moveDetails.method}</div>;
   }

   return (
     <div className="evoTile" onClick={handleClick}>
     </div>
   )
}

export default EvoTile;