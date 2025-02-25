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

async function RawToJSON(url) {
    const response = await fetch(url);
    const body = await response.json();
    return body;
}

async function GetEvoLines() { //write to separate file
    const response = await fetch('https://pokeapi.co/api/v2/evolution-chain?limit=100000&offset=0');
    const body = await response.json();
    const chains = [];
    for (let obj of body.results){
        const chain = await RawToJSON(obj.url);
        chains.push(chain);
    }
    return chains;
}

//code goes here for creating some sort of "evolution string" that notes the conditions. Maybe even an array of strings? ["Level", "Knows Move", "Female"] for ex
//may have to get/utilize all the types/items/moves to make this thing dynamic/neat. Types I can probably hack and just capitalize the first letter of. Items have a few unique cases that -
// - would make that less than ideal. Dashes in between words, maybe some apostrophes. We should probably do the same with moves to be safe, but I do have a moves json

const evo_lines = await GetEvoLines();

//Will have to now insert code to merge in some other handwritten json file to account for forms
//Algorithmically treating certain forms like a "species" has too many variables and there's no way I can think of to account for every scenario

SaveToFile(evo_lines, 'evolutions.json');