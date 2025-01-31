import Entry from './Entry.jsx'

function VisibleEntries({ num, pokemon, refArray, items }) {

    //should probably use map for the below.
    return (
        <>
            <div className="entries" > 
                <Entry index={num - 4} pokemon={pokemon} refArray={refArray} items={items}/>
                <Entry index={num - 3} pokemon={pokemon} refArray={refArray} items={items}/>
                <Entry index={num - 2} pokemon={pokemon} refArray={refArray} items={items}/>
                <Entry index={num - 1} pokemon={pokemon} refArray={refArray} items={items}/>
                <Entry index={num} pokemon={pokemon} refArray={refArray} items={items}/>
                <Entry index={num + 1} pokemon={pokemon} refArray={refArray} items={items}/>
                <Entry index={num + 2} pokemon={pokemon} refArray={refArray} items={items}/>
                <Entry index={num + 3} pokemon={pokemon} refArray={refArray} items={items}/>
                <Entry index={num + 4} pokemon={pokemon} refArray={refArray} items={items}/>
            </div>
        </>
    )
}

export default VisibleEntries;