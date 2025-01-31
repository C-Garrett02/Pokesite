import { useState, useEffect } from 'react'

function Abilities({pokemon}) {
    const [abilityIndex, setAbilityIndex] = useState(0);
    const [textEnd, setTextEnd] = useState(generateTextEnd(0));

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

    return (
        <div className='abilityBox'>
            <div className='abilityHeader'>
                <div className='abilityName'>
                    <strong>{pokemon.abilities[abilityIndex].name}</strong> <span id="abilityTextEnd">{textEnd}</span>
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
                {pokemon.abilities[abilityIndex].effect}
            </div>
        </div>
    )
}

export default Abilities;