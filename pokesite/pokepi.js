import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function GetPokemon2(dex) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + dex.toString());
    const body = await response.json();
    return body.varieties;
}

async function GetFormData2(varieties) {
    const response = await fetch(varieties[0].pokemon.url); //later when dealing with alt forms, consider slicing the varieties array to handle the others. Plan to nest them into that forms category.
    const body = await response.json();
    return {
        id: body.id,
        name: body.name,
        imageurl: body.sprites.front_default,
        forms: []
    };
}

async function PushPokemon(dex) {
    const varieties = await GetPokemon2(dex);
    const pokemon = await GetFormData2(varieties);
    pokedex.push(pokemon)
}

function SaveToFile(array) {
    const fs = require('fs');
    const jsonDex = JSON.stringify(array, null, 4);

    fs.writeFile("./pokedex.json", jsonDex, 'utf8', function (err) {
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