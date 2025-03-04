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

//Creates an array of descriptive strings about evo conditions. Many of these values will be hardcoded, possibly will convert some "hardcoded" data into json that merges with evolutions.json at some point.
function GetEvoStringArray(details, pokemon = "") {
    const strArray = [];

    //specific pokemon under the "other" category
    if(pokemon == "pawmot" || pokemon == "rabsca" || pokemon == "brambleghast"){
        strArray.push("1000 steps with your pokemon out");
    }
    if(pokemon == "annihilape"){
        strArray.push("Level after using Rage Fist 20 times");
    }
    if(pokemon == "palafin"){
        strArray.push("Union Circle");
    }
    if(pokemon == "kingambit"){
        strArray.push("Level after defeating 3 Bisharps holding a Leader's Crest");
    }
    if(pokemon == "gholdengo"){
        strArray.push("Level after collecting 999 Gimmighoul Coins");
    }

    //specific triggers
    if (details.trigger.name == "trade"){
        strArray.push("Trade");
    }
    if (details.trigger.name == "shed"){
        strArray.push("Open party slot");
    }
    if (details.trigger.name == "spin"){
        strArray.push("Spin w/ a held sweet");
    }
    if (details.trigger.name == "tower-of-darkness"){
        strArray.push("Evolve in Tower of Darkness or w/ Scroll of Darkness");
    }
    if (details.trigger.name == "tower-of-waters"){
        strArray.push("Evolve in Tower of Waters or w/ Scroll of Waters");
    }
    if (details.trigger.name == "three-critical-hits"){
        strArray.push("Land 3 crits in a battle");
    }
    if (details.trigger.name == "take-damage"){
        strArray.push("Walk under Dusty Bowl arch with at least -49hp");
    }
    if (details.trigger.name == "agile-style-move"){
        strArray.push("Use Agile Style Psyshield Bash in battle 20 times");
        return; //will capture redundant data if not returned
    }
    if (details.trigger.name == "strong-style-move"){
        strArray.push("Use Strong Style Barb Barrage in battle 20 times");
        return; //will capture redundant data if not returned
    }
    if (details.trigger.name == "recoil-damage"){
        strArray.push("Receive 294+ recoil damage in battle");
    }

    if (details.gender != null) {
        strArray.push(details.gender == 2 ? "Male" : "Female");
    }
    if (details.held_item != null) {
        strArray.push("Holding " + RetrieveItemName(details.held_item.name));
    }
    if (details.item != null) {
        strArray.push(RetrieveItemName(details.item.name));
    }
    if (details.known_move != null) {
        strArray.push("Knows " + RetrieveMoveName(details.known_move.name));
    }
    if (details.known_move_type != null) {
        //Usually avoid the uppercase hack but it will work for types
        let type = details.known_move_type.name[0].toUpperCase() +  details.known_move_type.name.slice(1);
        strArray.push("Knows a " + type + " move");
    }
    //skippng affection & beauty
    if (details.min_happiness != null) {
        strArray.push("High Happiness/Friendship");
    }
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
    if (details.trade_species != null) { 
        //Usually avoid the uppercase hack but it will work for these 2 pokemon
        strArray.push("Trade with " + details.trade_species.name[0].toUpperCase() +  details.trade_species.name.slice(1)); //hardcoded for escavalier/accelgor
    }
    if (details.turn_upside_down == true) {
        strArray.push("Upside Down");
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

    //specific pokemon with location evolutions. Put down here for more robust logic.
    if(pokemon == "probopass"){
        strArray.push("Level near magnetic field");
    }
    if(pokemon == "magnezone" && strArray.length > 0){ // > 0 ensures it will only attach it to the array I want to use
        strArray.push("Or level near magnetic field");
    }
    if(pokemon == "leafeon" && strArray.length > 0){
        strArray.push("Or level near mossy rock");
    }
    if(pokemon == "glaceon" && strArray.length > 0){
        strArray.push("Or level near icy rock");
    }
    if(pokemon == "crabominable"){
        strArray.push("Ice Stone");
        strArray.push("Or level at Mt. Lanikala");
    }
    if(pokemon == "vikavolt" && strArray.length > 0){
        strArray.push("Or level near magnetic field");
    }

    return strArray;
}

function StringifyAllDetails(chain) {
    for (let evo of chain.evolves_to){
        for (let details of evo.evolution_details){
            const evoStringArr = GetEvoStringArray(details, evo.species.name);
            console.log(evoStringArr);
            details.condition_array = evoStringArr;
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
        chain.chain = [chain.chain];
        StringifyAllDetails(chain.chain[0]);
        chains.push(chain);
    }
    return chains;
}

const evo_lines = await GetEvoLines();

//Will have to now insert code to merge in some other handwritten json file to account for forms
//Algorithmically treating certain forms like a "species" has too many variables and there's no way I can think of to account for every scenario

SaveToFile(evo_lines, 'evolutions.json');