import _ from 'lodash';
import fetch from 'node-fetch';
import readline from 'readline';

interface Hero {
    id: number;
    name: string;
    name_loc: string;
    name_english_loc: string;
    primary_attr: number;
    complexity: number;
}

async function generateRandom(query, heroes) : Promise<Hero> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return await new Promise((resolve, reject) => rl.question(query, ans => {
        rl.close();
        if (ans === 'exit') {
            return reject()
        }
        
        return resolve(_.sample(heroes));
    }));
}

async function getHeroes() : Promise<Hero[]> {
    const response = await fetch('https://www.dota2.com/datafeed/herolist?language=english');
    const data = await response.json();
    const heroes = _.get(data, 'result.data.heroes', []);
    return heroes;
}

async function main() : Promise<void> {
    const heroes = await getHeroes();
    while(true) {
        try {
            let randomHero : Hero = await generateRandom('Random?', heroes);
            console.log(`\x1b[32m${randomHero.name_loc}\x1b[0m`);
        } catch(e) {
            break;
        }
    }
    process.exit(0);
}

main();