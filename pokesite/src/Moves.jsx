import Move from './Move.jsx'

function Moves({pokemon, moveList}) {
    const levelArray = [];
    const machineArray = [];
    const eggArray = [];
    const otherArray = [];
    for (let move of pokemon.moves["level-up"]) {
        for (let details of moveList) {
            if (move.key == details.key) {
                details.level = move.level;
                levelArray.push(details);
            }
        }
    }
    for (let move of pokemon.moves["machine"]) {
        for (let details of moveList) {
            if (move.key == details.key) {
                details.level = -1;
                machineArray.push(details);
            }
        }
    }
    for (let move of pokemon.moves["egg"]) {
        for (let details of moveList) {
            if (move.key == details.key) {
                details.level = -1;
                eggArray.push(details);
            }
        }
    }
    for (let move of pokemon.moves["other"]) {
        for (let details of moveList) {
            if (move.key == details.key) {
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
                    <div className="categoryTitle">LEVEL MOVES</div>
                    <div className="levelHeaderDetails">
                        <div className="level">Level</div>
                        <div className="moveName">Move</div>
                        <div className="typeHeader">Type</div>
                        <div className="moveClass">Class</div>
                        <div className="movePower">Power</div>
                        <div className="moveAccuracy">Accuracy</div>
                    </div>
                </div>
                : <div className="levelHeader maxMoves"><strong>STANDARD MOVES CONVERTED TO MAX MOVES</strong></div>
            }
            {levelArray?.map((move, index) => (
                <Move key={move.key} index={index} moveDetails={move} />
            ))}

            {machineArray.length > 0 ?
                <div className="levelHeader">
                    <div className="categoryTitle">MACHINE MOVES</div>
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
            {machineArray?.map((move, index) => (
                <Move key={move.key} index={index} moveDetails={move} />
            ))}

            {eggArray.length > 0 ?
                <div className="levelHeader">
                    <div className="categoryTitle">EGG MOVES</div>
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
            {eggArray?.map((move, index) => (
                <Move key={move.key} index={index} moveDetails={move} />
            ))}

            {otherArray.length > 0 ?
                <div className="levelHeader">
                    <div className="categoryTitle">OTHER MOVES</div>
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
            {otherArray?.map((move, index) => (
                <Move key={move.key} index={index} moveDetails={move} />
            ))}
        </div>
    )
}

export default Moves;