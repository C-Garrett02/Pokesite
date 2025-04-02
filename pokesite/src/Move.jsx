import { useState, useEffect } from 'react'

function Move({index, moveDetails}) {
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
     <div className={"move " + (clicked ? "moveClicked " : " ") + (index % 2 ? "altMoveColor" : "")} onClick={handleClick}>
       {levelDiv}
       <div className="moveName">{moveDetails.name}</div>
       <div className={moveDetails.type + " moveType"}>{moveDetails.type.toUpperCase()}</div>
       <img className="moveClass" src={moveDetails.class + ".png"}></img>
       <div className="movePower">{moveDetails.power ?? "--"}</div>
       <div className="moveAccuracy">{moveDetails.accuracy ?? "--"}</div>
     </div>
     <div className={"movePanel " + (clicked ? "" : "hidden")}>
       <span className="topOfPanel"><strong>Targets: </strong>{moveDetails.target + "\t"}<strong>PP: </strong>{moveDetails.pp + "\t"}<strong>Priority: </strong>{moveDetails.priority + "\n\n"}</span>
       <span className="bodyOfPanel"><strong>Effect: </strong>{moveDetails.effect}</span>
     </div>
     </>
   )
}

export default Move;