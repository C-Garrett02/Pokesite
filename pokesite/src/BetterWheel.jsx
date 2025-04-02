import { useState, useEffect, Fragment } from 'react'

let indexArray = [];
for (let i = -4; i < 5; i++){
    indexArray.push(i);
}

function BetterWheel({items, pokemon, updateFunc}) {
    const [down, setDown] = useState(false);
    const [up, setUp] = useState(false);
    const [hover, setHover] = useState(false);

    const handleDown = () => {
        if(down == false && pokemon.dexnum > 0){
            setDown(true);
        }
    }
    const handleUp = () => {
        if(up == false && pokemon.dexnum < items.length-1){
            setUp(true);
        }
    }

    const handleMouseEnter = () => {
        setHover(true);
    }
    const handleMouseLeave = () => {
        setHover(false);
    }

    useEffect(() => {
        setTimeout(() => {
            if(down){
                setDown(false);
                updateFunc(pokemon.dexnum-1);
            }
            if(up){
                setUp(false);
                updateFunc(pokemon.dexnum+1);
            }
        }, 400)
    }, [down, up])

    //now that position is absolute, probably dont need invisible entry
    return (
        <Fragment>
        <div className={"shadow " + (hover ? "shadowHover" : "")}/>
        <div className='wheel' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="pulloutBar">
                <div className='pulloutArrow'></div>
            </div>
            <div className="directionButtons">
                <button onClick={handleDown} className="decrementButton">
                </button>
                <button onClick={handleUp} className="incrementButton">
                </button>
            </div>
            <div className="entries">
                {indexArray.map((ind) => {
                    if (pokemon.dexnum + ind < 0 || pokemon.dexnum + ind >= items.length){
                        return(
                            <div className={"invisibleEntry"} id={'entry' + (ind)} key={'entry' + (ind)}></div>
                        )
                    }
                    else {
                        return(
                            <div className={"entry " + (down || up ? "transitionActive" : "")} id={'entry' + (ind + (down ? 1 : 0) - (up ? 1 : 0))} key={'entry' + (ind)}>{pokemon.dexnum+ind+1}: {items[pokemon.dexnum+ind].species}</div>
                        )
                    }
                })}
            </div>
        </div>
        </Fragment>
    )
}

export default BetterWheel;