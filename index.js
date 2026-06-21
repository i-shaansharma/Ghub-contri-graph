import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = './data.json';

const start = moment('2025-01-01');
const end = moment('2025-12-31');
const diffDays = end.diff(start, 'days');

const makeCommits = (n) => {
    if (n === 0) return simpleGit().push();

    // pick a random day in full range
    const r = random.int(0, diffDays);
    const date = start.clone().add(r, 'days');

    // human behavior simulation
    const dayOfWeek = date.day(); // 0 = Sunday, 6 = Saturday

    // base probability logic
    let commitChance = 0.35; // baseline (low density)

    // weekdays more active
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        commitChance += 0.25;
    }

    // weekends less active
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        commitChance -= 0.15;
    }

    // randomness spike (some productive days)
    if (random.int(0, 100) > 92) {
        commitChance = 0.95;
    }

    // decide whether to commit or skip (creates natural gaps)
    if (Math.random() > commitChance) {
        return makeCommits(n); // skip silently, try another
    }

    const finalDate = date.add(random.int(0, 6), 'hours').format();

    const data = { date: finalDate };

    console.log(finalDate);

    jsonfile.writeFile(
        path,
        data,
        () => {
            simpleGit()
                .add([path])
                .commit(finalDate, { '--date': finalDate }, () => {
                    makeCommits(n - 1);
                });
        }
    );
};

// moderate number of commits (not dense, realistic)
makeCommits(31);