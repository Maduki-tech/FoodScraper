import axios from "axios";
import cheerio from "cheerio";
import { children } from "cheerio/lib/api/traversing";
import pretty from "pretty";

const URL =
    "https://www.chefkoch.de/rezepte/1367011241524338/Der-weltbeste-Kraeuterquark.html";

interface List {
	menge: string | null
	zutat: string

}

async function getDate() {
    try {
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);
        const ingredients = $(".table-header tbody tr ");
        const table: object[] = [];

        ingredients.each((idx, ele) => {
			const food = <List>{}

			let menge = $(ele).children(".td-left").children("span").text();
			let first = food.menge?.trim().split(' ')[1]
			let last = food.menge?.trim().split(' ').pop()
            food.menge = menge
            food.zutat = $(ele).children(".td-right").children("span").text();

			console.log(first + ' ' + last)
            table.push(food);
        });
		// console.table(table)
		// console.dir(table)
        // console.dir(ingredients.text());
    } catch (err) {
        console.error(err);
    }
}

getDate()

