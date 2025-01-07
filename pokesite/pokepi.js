import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function GetPokemon2(dex) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + dex.toString());
    const body = await response.json();
    return body.varieties;
}

async function GetMoves() { //write to separate file
    const response = await fetch('https://pokeapi.co/api/v2/move?limit=100000&offset=0');
    const body = await response.json();
    let moves = [];
    for (let move of body.results){
        const move_response = await fetch(move.url);
        const details = await move_response.json();
        let description = "";
        let move_name = "";
        const move_key = move.name;
        const damage_class = details.damage_class.name;
        const move_accuracy = details.accuracy;
        const move_power = details.power;
        const move_pp = details.pp;
        const move_priority = details.priority;
        const move_target = details.target.name;
        const move_type = details.type.name
        for (let name of details.names) {
            if(name.language.name == "en"){
                move_name = name.name;
            }
        }
        if(details.effect_entries.length > 0){
            for (let entry of details.effect_entries) {
                if(entry.language.name == "en"){
                    description = entry.effect;
                }
            }
        }
        else {
            for (let i = details.flavor_text_entries.length - 1; i >= 0; i--){ //Want to get the most recent entry, start from back
                if(details.flavor_text_entries[i].language.name == "en"){
                    description = details.flavor_text_entries[i].flavor_text;
                }
            }
        }
        moves.push({
            key: move_key,
            name: move_name,
            class: damage_class,
            accuracy: move_accuracy,
            power: move_power,
            pp: move_pp,
            priority: move_priority,
            target: move_target,
            type: move_type,
            effect: description
        })
    }
    return moves;
}

async function GetAbility(ability) { //currently writes to pokedex, consider also making own file? Not as big of a deal as moves, though.
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
    let move_arrays = {
        "level-up": [],
        machine: [],
        egg: [],
        tutor: [],
        other: []
    };
    let bst = 0;
    const decimeters = body.height;
    const total_inches = Math.round(decimeters*3.93701);
    const feet = Math.floor(total_inches/12);
    const inches = total_inches%12;
    const height = feet + '\' ' + inches + '"' ;
    const weight = Math.round((body.weight * 0.220462)*10) / 10;
    const cry_url = body.cries.latest;
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
    for (let move of body.moves){
        for (let version of move.version_group_details){
            if (version.version_group.name = "scarlet-violet"){
                let current_move = {};
                current_move.key = move.move.name;
                current_move.level = version.level_learned_at;
                current_move.method = version.move_learn_method.name;
                if((current_move.method in move_arrays)){
                    move_arrays[current_move.method].push(current_move);
                }
                else {
                    move_arrays["other"].push(current_move);
                }
                break;
            }
        }
    }
    move_arrays["level-up"].sort((a, b) => { //need to sort by level, then by machine moves, then by egg moves. May need to separate into 3 arrays.
        return a.level - b.level;
    })
    return {
        id: body.id,
        name: uppercaseName,
        stats: base_stats,
        image: body.sprites.front_default,
        types: type_array,
        height: height,
        weight: weight,
        cry: cry_url,
        abilities: ability_list,
        moves: move_arrays,
        forms: []
    };
}

async function PushPokemon(dex) {
    const varieties = await GetPokemon2(dex);
    const pokemon = await GetFormData2(varieties);
    //console.log(pokemon)
    pokedex.push(pokemon)
}

function SaveToFile(array, filename) {
    const fs = require('fs');
    const jsonData = JSON.stringify(array, null, 4);

    fs.writeFile("./public/"+filename, jsonData, 'utf8', function (err) {
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

const moves = await GetMoves();

SaveToFile(moves, 'moves.json');

Promise.all(promises)
    .then(() => {
        pokedex.sort((a, b) => {
            return a.id - b.id
        })
        SaveToFile(pokedex, 'pokedex.json')
    })