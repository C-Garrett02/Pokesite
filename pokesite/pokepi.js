import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function GetPokemon2(dex) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + dex.toString());
    const body = await response.json();
    return body.varieties;
}

async function GetAbility(ability) {
    const response = await fetch(ability.url);
    const body = await response.json();
    let description = "";
    let ability_name = "";
    for (let name of body.names) {
        if(name.language.name == "en"){
            ability_name = name.name;
        }
    }
    if(body.effect_entries.length > 0){
        for (let entry of body.effect_entries) {
            if(entry.language.name == "en"){
                description = entry.effect;
                //description = description.replace(/\n/g, '');
                //description = description.replace(/([a-z, A-Z])\.([a-z, A-Z])/g, '$1. $2');
                //description = description.replace('Overworld', '\n\nOverworld');
            }
        }
    }
    else {
        for (let i = body.flavor_text_entries.length - 1; i >= 0; i--){ //Want to get the most recent entry, start from back
            if(body.flavor_text_entries[i].language.name == "en"){
                description = body.flavor_text_entries[i].flavor_text;
                //description = description.replace(/\n/g, '');
                //description = description.replace(/([a-z, A-Z])\.([a-z, A-Z])/g, '$1. $2');
                //description = description.replace('Overworld', '\n\nOverworld');
            }
        }
    }
    return {
        name: ability_name,
        effect: description
    }
}

async function GetFormData2(varieties) {
    const response = await fetch(varieties[0].pokemon.url); //Will need to update this method, or another one, to deal with alternate types. Mega/gmax/regional/gender/etc
    const body = await response.json();
    const uppercaseName = body.name.charAt(0).toUpperCase() + body.name.slice(1);
    let base_stats = {};
    let type_array = [];
    let ability_list = [];
    let bst = 0;
    for (let stat of body.stats){ 
        base_stats[stat.stat.name] = stat.base_stat;
        bst += stat.base_stat;
    }
    base_stats['total'] = bst;
    for (let type of body.types){
        type_array.push(type.type.name);
    }
    for (let ability of body.abilities){
        let currentAbilityDescription = await GetAbility(ability.ability);
        currentAbilityDescription.hidden = ability.is_hidden;
        ability_list.push(currentAbilityDescription);
    }
    return {
        id: body.id,
        name: uppercaseName,
        stats: base_stats,
        image: body.sprites.front_default,
        types: type_array,
        abilities: ability_list,
        forms: []
    };
}

async function PushPokemon(dex) {
    const varieties = await GetPokemon2(dex);
    const pokemon = await GetFormData2(varieties);
    //console.log(pokemon)
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
    promises.push(PushPokemon(i));
}

Promise.all(promises)
    .then(() => {
        pokedex.sort((a, b) => {
            return a.id - b.id
        })
        SaveToFile(pokedex)
    })