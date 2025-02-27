import { createRequire } from 'module';
import { readFile } from 'fs/promises';

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

async function RawToJSON(url) {
    const response = await fetch(url);
    const body = await response.json();
    return body;
}

async function GetItems() { //write to separate file
    let body = JSON.parse(await readFile("./public/items.json", "utf8"));
    return body;
}

const items = await GetItems();

async function GetMoves() { //write to separate file
    let body = JSON.parse(await readFile("./public/moves.json", "utf8"));
    return body;
}

const moves = await GetMoves();

function RetrieveItemName(key) {
    for(let item of items){
        if(item.key == key) {
            return item.name;
        }
    }
}

function RetrieveMoveName(key) {
    for(let move of moves){
        if(move.key == key) {
            return move.name;
        }
    }
}

//code goes here for creating some sort of "evolution string" that notes the conditions. Maybe even an array of strings? ["Level", "Knows Move", "Female"] for ex
function GetEvoStringArray(details) {
    const strArray = [];
    if (details.gender != null) {
        strArray.push(details.gender == 2 ? "Male" : "Female");
    }
    if (details.held_item != null) {
        strArray.push("While Holding" + RetrieveItemName(details.held_item.name));
    }
    if (details.item != null) {
        strArray.push(RetrieveItemName(details.item.name));
    }
    if (details.known_move != null) {
        strArray.push(RetrieveMoveName(details.known_move.name));
    }
    if (details.known_move_type != null) {
        //Usually avoid the uppercase hack but it will work for types
        let type = details.known_move_type.name[0].toUpperCase() +  details.known_move_type.name.slice(1);
        strArray.push("Knows a " + type + " move");
    }

    //skipping location, probably not needed for anyone as of gen 9. Will probably have to handwrite ones like runerigus that involve a location anyways.
    //skippng affection
    //skipping beauty

    if (details.min_level != null) {
        strArray.push("Lvl " + details.min_level);
    }
    if (details.needs_overworld_rain == true) {
        strArray.push("Rain");
    }
    if (details.party_species != null) {
        strArray.push("Remoraid in party"); //hardcoded for mantine
    }
    if (details.party_type != null) {
        strArray.push("Dark type in party"); //hardcoded for pangoro
    }
    if (details.relative_physical_stats != null) {
        let hitmonArray = ["Attack < Defense", "Attack = Defense", "Attack > Defense"]
        strArray.push(hitmonArray[details.relative_physical_stats + 1]); //hardcoded for hitmon line
    }

    //Time of day (TOD) conditions
    if (details.time_of_day == "day") {
        strArray.push("Day"); 
    }
    if (details.time_of_day == "night") {
        strArray.push("Night"); 
    }
    if (details.time_of_day == "dusk") {
        strArray.push("Dusk"); 
    }
    if (details.time_of_day == "full-moon") {
        strArray.push("Full Moon"); 
    }

    if (details.trade_species != null) {
        //Usually avoid the uppercase hack but it will work for these 2 pokemon
        strArray.push(details.trade_species.name[0].toUpperCase() +  details.trade_species.name.slice(1)); 
    }    
    if (details.turn_upside_down == true) {
        strArray.push("Upside Down")
    }

    return strArray;
}

function StringifyAllDetails(chain) {
    for (let evo of chain.evolves_to){
        for (let details of evo.evolution_details){
            const evoStringArr = GetEvoStringArray(details);
            details.conditionArray = evoStringArr;
        }
        StringifyAllDetails(evo);
    }
}

async function GetEvoLines() { //write to separate file
    const response = await fetch('https://pokeapi.co/api/v2/evolution-chain?limit=100000&offset=0');
    const body = await response.json();
    const chains = [];
    for (let obj of body.results){
        const chain = await RawToJSON(obj.url);
        StringifyAllDetails(chain.chain);
        chains.push(chain);
    }
    return chains;
}

const evo_lines = await GetEvoLines();

//Will have to now insert code to merge in some other handwritten json file to account for forms
//Algorithmically treating certain forms like a "species" has too many variables and there's no way I can think of to account for every scenario

SaveToFile(evo_lines, 'evolutions.json');