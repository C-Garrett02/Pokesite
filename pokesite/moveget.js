import { createRequire } from 'module';
const require = createRequire(import.meta.url);

function SaveToFile(array, filename) {
    const fs = require('fs');
    const jsonData = JSON.stringify(array, null, 4);

    fs.writeFile("./public/"+filename, jsonData, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    });
        
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

const moves = await GetMoves();

SaveToFile(moves, 'moves.json');