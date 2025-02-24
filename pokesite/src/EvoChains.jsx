import { useState, useEffect } from 'react';
import EvoTile from './EvoTile.jsx'
import './Evo.css'

function EvoChains({chains, chainid, items, name}) {
    //The topmost entry should be one that includes the pokemon passed in

    const chainList = [];

    let chain = null;

    for (let obj of chains){
        if (obj.id == chainid){
            chain = obj;
        }
    }

    function pushLine(remainingChain, currentChain = []){ //to start, pass in chain.chain
        const newCurrent = [...currentChain];
        newCurrent.push(remainingChain.species.name);
        if(remainingChain.evolves_to.length > 0) {
            for(let evolution of remainingChain.evolves_to){
                pushLine(evolution, newCurrent);
            }
        }
        else { //base case
            chainList.push(newCurrent);
        }
    }

    if(chain != undefined){
        pushLine(chain.chain);
    }

    if(chainList.length > 1){
        chainList.reverse();
        chainList.sort(function(x,y){ return x.includes(name.toLowerCase()) ? -1 : y.includes(name.toLowerCase()) ? 1 : 0; });
    }

    return (
        <div className="evoChart">
                {chainList?.map((line, index) => (
                    <div className="evoChain" key={index}>
                        {line.map(stage => (
                            <EvoTile pokemonName={stage} items={items} key={stage}/>
                        ))}
                    </div>
                ))}
        </div>
    )
}

export default EvoChains;