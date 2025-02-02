import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function PushPokemon(dex) { //Make a base pokemon and attach its forms to it.
    const pokemon = await GetPokemon2(dex);
    pokedex.push(pokemon)
}

async function GetPokemon2(dex) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + dex.toString());
    const body = await response.json();
    const alternateForms = [];
    let basePokemon;
    for (let form of body.varieties){
        if (form.is_default == true){
            basePokemon = await GetAltFormData(form);
            for (let record of body.names){
                if (record.language.name == "en") {
                    basePokemon.species = record.name;
                    if (basePokemon.name == "placeholder"){
                        basePokemon.name = record.name;
                    }
                }
            }
        }
        else {
            const other_form = await GetAltFormData(form);
            if(other_form !== null){
                alternateForms.push(other_form);
            }
        }
    }
    basePokemon.forms = alternateForms;
    return basePokemon;
}

async function GetFormData(variety) {
    const versions = await GetVersions(); //Should really only call this once and pass it to this function or something. Will maybe work on that later.
    const response = await fetch(variety.pokemon.url); //Will need to update this method, or another one, to deal with alternate types. Mega/gmax/regional/gender/etc
    const body = await response.json();
    if(body.sprites.front_default == null){
        return null;
    }
    let latestIndex = 0;
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
    for (let move of body.moves){ //iterates through moves an extra time up front to determine which generation has the latest moveset
        let arrayLength = move.version_group_details.length;
        let moveIndex = versions.indexOf(move.version_group_details[arrayLength - 1].version_group.name);
        if (moveIndex > latestIndex){
            latestIndex = moveIndex;
        }
    }
    for (let move of body.moves){
        for (let version of move.version_group_details){
            if (version.version_group.name == versions[latestIndex]){
                let current_move = {};
                current_move.key = move.move.name;
                current_move.level = version.level_learned_at;
                current_move.method = version.move_learn_method.name;
                if((current_move.method in move_arrays)){
                    move_arrays[current_move.method].push(current_move);
                }
                else {
                    if(current_move.method == "stadium-surfing-pikachu"){
                        current_move.method = "Pokemon Stadium";
                    }
                    else if(current_move.method == "tutor"){
                        current_move.method = "Tutor"
                    }
                    else if(current_move.method == "form-change"){
                        current_move.method = "Form Change"
                    }
                    else {
                        current_move.method = "Other"
                    }
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
        name: "placeholder name",
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

async function GetAltFormData(variety) { //Currently does not differentiate between purely cosmetic forms (e.g. polteageist antique vs phony)
    const versions = await GetVersions(); //Should really only call this once and pass it to this function or something. Will maybe work on that later.
    const response = await fetch(variety.pokemon.url); //Will need to update this method, or another one, to deal with alternate types. Mega/gmax/regional/gender/etc
    const body = await response.json();
    if(body.sprites.front_default == null){
        return null;
    }
    let latestIndex = 0;
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
    let form_name = "placeholder"
    if(body.forms.length == 1){ //Currently avoiding multiple forms per one variety
        form_name = await GetFormName(body.forms[0]);
    }
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
    for (let move of body.moves){ //iterates through moves an extra time up front to determine which generation has the latest moveset
        let arrayLength = move.version_group_details.length;
        let moveIndex = versions.indexOf(move.version_group_details[arrayLength - 1].version_group.name);
        if (moveIndex > latestIndex){
            latestIndex = moveIndex;
        }
    }
    for (let move of body.moves){
        for (let version of move.version_group_details){
            if (version.version_group.name == versions[latestIndex]){
                let current_move = {};
                current_move.key = move.move.name;
                current_move.level = version.level_learned_at;
                current_move.method = version.move_learn_method.name;
                if((current_move.method in move_arrays)){
                    move_arrays[current_move.method].push(current_move);
                }
                else {
                    if(current_move.method == "stadium-surfing-pikachu"){
                        current_move.method = "Pokemon Stadium";
                    }
                    else if(current_move.method == "tutor"){
                        current_move.method = "Tutor"
                    }
                    else if(current_move.method == "form-change"){
                        current_move.method = "Form Change"
                    }
                    else {
                        current_move.method = "Other"
                    }
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
        name: form_name,
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

async function GetFormName(form) {
    const response = await fetch(form.url); //Will need to update this method, or another one, to deal with alternate types. Mega/gmax/regional/gender/etc
    const body = await response.json();
    for (let record of body.names){
        if (record.language.name == "en") {
            return record.name;
        }
    }
    return "placeholder";
}

async function GetVersions() { //get versions in chronological order
    const response = await fetch('https://pokeapi.co/api/v2/version-group?limit=30');
    const body = await response.json();
    let versions = [];
    for (let group of body.results) {
        versions.push(group.name);
    }
    return versions;
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

for (let i = 1; i <= 1025; i++) {
    promises.push(PushPokemon(i));
}

Promise.all(promises)
    .then(() => {
        pokedex.sort((a, b) => {
            return a.id - b.id
        })
        SaveToFile(pokedex, 'pokedex.json')
    })