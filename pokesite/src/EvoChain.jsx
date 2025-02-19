import { useState, useEffect } from 'react';
import EvoTile from './EvoTile.jsx'

function EvoChain({pokemon, chains}) {
    //need to get the chain_id from current pokemon
    //need to get the chain data from evolution.json
    //create x -> y -> z
    //Either default with split evolutions or have a ?
    //after this unknown is resolved, the rest of the tree will display (if there is more to display)
    //Possibly, a button/method that allows the user to see the full evo tree should be added

    //Will need to manually create a json that can be merged with evolutions.json to account for different forms or unique methods

    //FOR NOW, JUST WORRY ABOUT THE BASICS. GIVE EACH SPECIES ONLY ONE EVOLUTION CHAIN. NO REGIONAL FORMS BUT WILL DO SPLIT EVO LINES LIKE RALTS/EEVEE/ETC
    //STUFF LIKE CLODSIRE WILL JUST BE SCUFFED, AS IT WILL LIKELY SHOW REGULAR WOOPER
    //Have an image of each pokemon with a name under them. This name may have to be a selectable element like the one in the corner of the image. Otherwise a modal, scroll, or something else will have to be used.

    //chain is an array of arrays. Arraylen > 1 means it is an "uncertain" evolution.
    //Not sure how to format this. Will need to render the chain dynamically, would be harder to build the entire chain off the bat.



    return (
        <div className="evoChain">

        </div>
    )
}

export default EvoChain;