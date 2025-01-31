import { useState, useEffect } from 'react'

function Abilities({pokemon}) {
    const [abilityIndex, setAbilityIndex] = useState(0);
    const [textEnd, setTextEnd] = useState(generateTextEnd(0));
    const [pokeName, setPokeName] = useState(pokemon.name)
    let abilityName = "";
    let abilityEffect = "";

    function incrementAbility() {
        if (abilityIndex + 1 < pokemon.abilities.length) {
            setTextEnd(generateTextEnd(abilityIndex + 1));
            setAbilityIndex(abilityIndex + 1);
        }
    }
    function decrementAbility() {
        if (abilityIndex - 1 > -1) {
            setTextEnd(generateTextEnd(abilityIndex - 1));
            setAbilityIndex(abilityIndex - 1);
        }
    }
    function generateTextEnd(index) {
        if (pokemon.abilities[index].hidden) {
            return "(Hidden)";
        }
        else {
            return "(Ability " + (index + 1) + ")";
        }
    }

    if(pokeName != pokemon.name){ //somewhat contrived logic to avoid remounting and reset the ability back to the first one every time a new pokemon is selected.
        setAbilityIndex(0);
        setPokeName(pokemon.name);
        setTextEnd(generateTextEnd(0));
        abilityName = pokemon.abilities[0].name;
        abilityEffect = pokemon.abilities[0].effect;
    }
    else {
        abilityName = pokemon.abilities[abilityIndex].name;
        abilityEffect = pokemon.abilities[abilityIndex].effect;
    }

    return (
        <div className='abilityBox'>
            <div className='abilityHeader'>
                <div className='abilityName'>
                    <strong>{abilityName}</strong> <span id="abilityTextEnd">{textEnd}</span>
                </div>
                <div className='directionBtns'>
                    <button className='abilityBtn' onClick={decrementAbility}>
                        <img id='leftArrow' src='/triangle.svg' />
                    </button>
                    <button className='abilityBtn' onClick={incrementAbility}>
                        <img id='rightArrow' src='/triangle.svg' />
                    </button>
                </div>
            </div>
            <div className='abilityDescription'>
                {abilityEffect}
            </div>
        </div>
    )
}

export default Abilities;