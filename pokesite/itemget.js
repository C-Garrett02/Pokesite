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

async function GetItems() { //write to separate file
    const response = await fetch('https://pokeapi.co/api/v2/item?limit=100000&offset=0');
    const body = await response.json();
    let items = [];
    for (let item of body.results){
        const item_response = await fetch(item.url); //could make this a series of promises then use promise.all maybe? Would be faster. But not a huge deal.
        const details = await item_response.json();
        let item_name = "";
        const item_key = item.name;
        console.log(item_key);

        for (let name of details.names) { //need a fallback for this, some items such as peat-block don't have detailed name data.
            if(name.language.name == "en"){
                item_name = name.name;
            }
        }

        if (item_name == "") {
            item_name = item_key;
            item_name = item_name.replace("-", " ");
            item_name = item_name.charAt(0).toUpperCase() + item_name.slice(1);
            for(let i = 0; i < item_name.length; i++){
                if (item_name[i] == " "){
                    item_name = item_name.slice(0, i+1) + item_name[i+1].toUpperCase() + item_name.slice(i+2);
                }
            }
        }

        items.push({
            key: item_key,
            name: item_name
        })
    }
    return items;
}

const items = await GetItems();

SaveToFile(items, 'items.json');