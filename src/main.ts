import axios from "axios";
import cheerio from "cheerio";
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

        ingredients.each((_, ele) => {
			const food = <List>{}

			let menge = $(ele).children(".td-left").children("span").text();
			// weird format thats why this slicing
			let first = menge?.trim().split(' ')[0];
			let last = menge?.trim().split(' ').pop();

            food.menge = first + ' ' + last
            food.zutat = $(ele).children(".td-right").children("span").text();

            table.push(food);
        });
		console.table(table)
    } catch (err) {
        console.error(err);
    }
}

getDate()

