import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

const URL = process.argv.slice(2)[0];
let dishName:string;

interface List {
    menge: string | null;
    zutat: string;
}

async function getDate() {
    try {
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);
		dishName = $("h1").text().replace(/ /g, '_')
        const ingredients = $(".table-header tbody tr ");
        const table: object[] = [];


        ingredients.each((_, ele) => {
            const food = <List>{};

            let menge = $(ele).children(".td-left").children("span").text();
            // weird format thats why this slicing
            let first = menge?.trim().split(" ")[0];
            let last = menge?.trim().split(" ").pop();

            food.menge = first + " " + last;

            food.zutat = $(ele)
                .children(".td-right")
                .children("span")
                .text()
                .replace(/,/g, ".");

            table.push(food);
        });
		console.log(dishName)
        return table;
    } catch (err) {
        console.error(err);
    }
}

const convertToCSV = (table: any) => {
    const CSVdate = ConvertToCSV(table);
    fs.writeFileSync(`/Users/davidschluter/Documents/essen/${dishName}.csv`, CSVdate);
};

function ConvertToCSV(objArray: any) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
            if (line != "") line += ",";

            line += array[i][index];
        }

        str += line + "\r\n";
    }

    return str;
}

const main = async () => {
    const table = await getDate();
    convertToCSV(table);
};

main();
