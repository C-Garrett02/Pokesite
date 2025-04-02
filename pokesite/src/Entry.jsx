function Entry({ index, pokemon, refArray, items }) { //fill refArray and the DOM with our pokemon entries
    let id_string = 'entry' + (index - pokemon.dexnum);
    if (index > -1 && index < items.length) {
        return (
            <>
                <div className="entry" ref={refArray[index - pokemon.dexnum + Math.floor(refArray.length / 2)]} id={id_string}>{index + 1}: {items[index].name}</div>
            </>
        )
    }
    else {
        return (
            <>
                <div className="invisibleEntry" ref={refArray[index - pokemon.dexnum + Math.floor(refArray.length / 2)]} id={id_string}></div>
            </>
        )
    }
}

export default Entry;