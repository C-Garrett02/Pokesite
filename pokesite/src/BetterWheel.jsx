import { useState, useEffect } from 'react'

let indexArray = [];
for (let i = -4; i < 5; i++){
    indexArray.push(i);
}

function BetterWheel({items, pokemon, updateFunc}) {
    const [down, setDown] = useState(false);
    const [up, setUp] = useState(false);
    const handleDown = () => {
        if(down == false && pokemon.dexnum > 0){
            setDown(true);
            console.log(down);
        }
    }
    const handleUp = () => {
        if(up == false && pokemon.dexnum < items.length-1){
            setUp(true);
            console.log(up);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if(down){
                setDown(false);
                updateFunc(pokemon.dexnum+1);
            }
            if(up){
                setUp(false);
                updateFunc(pokemon.dexnum+1);
            }
        }, 400)
    }, [down, up])

    console.log('test');

    //now that position is absolute, probably dont need invisible entry
    return (
        <div className='wheel'>
            <button onClick={handleDown}></button>
            <button onClick={handleUp}></button>
            <div className="entries">
                {indexArray.map((ind) => {
                    if (pokemon.dexnum + ind < 0 || pokemon.dexnum + ind >= items.length){
                        return(
                            <div className={"invisibleEntry"} id={'entry' + (ind)} key={'entry' + (ind)}></div>
                        )
                    }
                    else {
                        return(
                            <div className={"entry " + (down || up ? "transitionActive" : "")} id={'entry' + (ind + (down ? 1 : 0) - (up ? 1 : 0))} key={'entry' + (ind)}>{pokemon.dexnum+ind}: {items[pokemon.dexnum+ind].name}</div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default BetterWheel;