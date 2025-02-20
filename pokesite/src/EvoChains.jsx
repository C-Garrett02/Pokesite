import { useState, useEffect } from 'react';
import EvoTile from './EvoTile.jsx'
import './Evo.css'

function EvoChains({chains, chainid, items}) { //Pass in chain (chains[pokemon.chainid-1]), or the chain where pokemon.chainid == chains[i].id, but I think chains[i].id should be equal to i+1
    //For now, just create a vertical list of x->y->z
    //The topmost entry should be one that includes the pokemon passed in
    //pokemon is based on species by default, will need to do tolower() on pokemon.species to match it up with species.name in a chain

    //console.log(chain)

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
            //console.log(newCurrent);
        }
    }

    if(chain != undefined){
        pushLine(chain.chain);
    }

    return (
        <div className="evoChart">
                {chainList?.map((line) => (
                    <div className="evoChain">
                        {line.map(stage => (
                            <EvoTile pokemonName={stage} items={items}/>
                        ))}
                    </div>
                ))}
        </div>
    )
}

export default EvoChains;