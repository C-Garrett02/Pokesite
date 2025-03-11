import { useState, useEffect, Fragment } from 'react';
import EvoTile from './EvoTile.jsx'
import EvoArrow from './EvoArrow.jsx'
import './Evo.css'

function EvoChains({chains, chainid, items, name, updateFunc}) {
    //The topmost entry should be one that includes the pokemon passed in

    useEffect(() => { //Resets the scroll position of the chart to 0. Ensures that the right chain is in view on pokemon change.
        document.getElementById("evoChart").scrollTop = 0;
    }, [name])

    const chainList = [];

    let chain = null;

    for (let obj of chains){
        if (obj.id == chainid){
            chain = obj;
        }
    }

    function pushLine(remainingChain, currentChain = []){ //to start, pass in chain.chain and the a blank conditions array. conditions are what it takes to evolve to this pokemon, not for this pokemon to be evolved. For example meowth has no conditions, persian does.
        const newCurrent = [...currentChain];
        let conditions = [];

        if (remainingChain.evolution_details.length > 1){ //Looks for longest string array. Will just pick the topmost or the only one if there isn't a longest
            remainingChain.evolution_details.sort(function(x,y){ return x.condition_array.length > y.condition_array.length ? -1 : x.condition_array.length < y.condition_array.length ? 1 : 0; });
            conditions = remainingChain.evolution_details[0].condition_array;
        }
        else if (remainingChain.evolution_details.length == 1){
            conditions = remainingChain.evolution_details[0].condition_array;
        }

        newCurrent.push({
            name: remainingChain.species.name,
            species_id: remainingChain.species.url.replace(/.*\/(\d+)\//g, '$1'),
            conditions: conditions
        });
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
        for (let line of chain.chain){
            pushLine(line);
        }
    }

    if(chainList.length > 1){
        chainList.reverse();
        chainList.sort(function(x,y){ 
            for (let chain of x){
                if(chain.name == name){
                    return -1;
                }
            }
            for (let chain of y){
                if(chain.name == name){
                    return 1;
                }
            }
            return 0;
        });
    }

    return (
        <div id="evoChart">
                {chainList?.map((line, index) => (
                    <div className="evoChain" key={index}>
                        {line.map((stage, index) => (
                            <Fragment key={index} >
                                {stage.conditions.length > 0 ? <EvoArrow conditions={stage.conditions} /> : null}
                                <EvoTile pokemon={stage} items={items} updateFunc={updateFunc} />
                            </Fragment>
                        ))}
                    </div>
                ))}
        </div>
    )
}

export default EvoChains;