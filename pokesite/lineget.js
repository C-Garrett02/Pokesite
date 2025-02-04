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

async function GetChain(id) {
    const response = await fetch('https://pokeapi.co/api/v2/evolution-chain/'+id);
    const body = await response.json();
    return body;
}

async function GetEvoLines() { //write to separate file
    const response = await fetch('https://pokeapi.co/api/v2/evolution-chain?limit=100000&offset=0');
    const body = await response.json();
}

const evo_lines = await GetEvoLines();

SaveToFile(evo_lines, 'evolutions.json');