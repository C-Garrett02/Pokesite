import { useState } from 'react'
 
function SearchBar({updateFunc, items}) {
    const [inputStr, setInputStr] = useState('');

    function filterByInput(input) { //should only call if input.length >= 3. While this likely doesnt cause performance issues, can be optimized if needed.
        return(
            items.filter((p) => p.name.toLowerCase().includes(input.toLowerCase())
            )
        )
    }

    function FilteredDex({input}){ //returns list of divs that provide matches. Does not exist in dom unless there are results to be returned.
        const jumpToMon = (e) => {
            const updatedDex = parseInt(e.target.getAttribute('number'))-1;
            updateFunc(updatedDex);
        }
        let filteredList = <></>

        if (input.length >= 3){
            filteredList = filterByInput(input).map(p => 
                <button key={p.name} number={p.id} className='monButton' onClick={jumpToMon}>{p.name}</button>
            )
        }

        if(filteredList.length){
            return <div className='listedMon'>{filteredList}</div>
        }
        else{
            return null;
        }
    }

    const handleState = (e) => {
        setInputStr(e.target.value);
    };

    return (
    <div className='searchBar'>
        <input name='Pokemon Search Bar' className='monInput' placeholder='Search for Pokemon' value={inputStr} onChange={handleState}></input>
        <FilteredDex input={inputStr} />
    </div>
    )
}
 
export default SearchBar;