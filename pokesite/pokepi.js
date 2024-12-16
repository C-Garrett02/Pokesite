import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function GetPokemon2(dex) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + dex.toString());
    const body = await response.json();
    return body.varieties;
}

async function GetFormData2(varieties) {
    const response = await fetch(varieties[0].pokemon.url); //Will need to update this method, or another one, to deal with alternate types. Mega/gmax/regional/gender/etc
    const body = await response.json();
    const uppercaseName = body.name.charAt(0).toUpperCase() + body.name.slice(1);
    let base_stats = {};
    let type_array = [];
    for (let stat of body.stats){ 
        base_stats[stat.stat.name] = stat.base_stat
    }
    for (let type of body.types){
        type_array.push(type.type.name)
    }
    return {
        id: body.id,
        name: uppercaseName,
        stats: base_stats,
        image: body.sprites.front_default,
        types: type_array,
        forms: []
    };
}

async function PushPokemon(dex) {
    const varieties = await GetPokemon2(dex);
    const pokemon = await GetFormData2(varieties);
    console.log(pokemon)
    pokedex.push(pokemon)
}

function SaveToFile(array) {
    const fs = require('fs');
    const jsonDex = JSON.stringify(array, null, 4);

    fs.writeFile("./public/pokedex.json", jsonDex, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    });
        
}

let promises = [];
let pokedex = [];

for (let i = 1; i <= 151; i++) {
    promises.push(PushPokemon(i))
}

Promise.all(promises)
    .then(() => {
        pokedex.sort((a, b) => {
            return a.id - b.id
        })
        SaveToFile(pokedex)
    })