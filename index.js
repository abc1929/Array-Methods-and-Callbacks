import { fifaData } from './fifa.js';

// ⚽️ M  V P ⚽️ //

/* 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 Task 1: 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
Practice accessing data by console.log-ing the following pieces of data note, you may want to filter the data first 😉*/

let finalmatch2014 = fifaData.filter(e => e["Year"]===2014 && e["Stage"]==="Final")[0];

//(a) Home Team name for 2014 world cup final
console.log(finalmatch2014["Home Team Name"]) 

//(b) Away Team name for 2014 world cup final
console.log(finalmatch2014["Away Team Name"]) 
//(c) Home Team goals for 2014 world cup final
console.log(finalmatch2014["Home Team Goals"]) 
//(d) Away Team goals for 2014 world cup final
console.log(finalmatch2014["Away Team Goals"]) 
//(e) Winner of 2014 world cup final */

let winner;
if(finalmatch2014["Home Team Goals"] !== finalmatch2014["Away Team Goals"]){
    winner = finalmatch2014["Home Team Goals"] > finalmatch2014["Away Team Goals"] ? finalmatch2014["Home Team Name"] : finalmatch2014["Away Team Name"]
} else { 
    // we account for penalty kicks and stuff when finals are tied in regulation
    winner = finalmatch2014["Win conditions"].split(" ")[0]
}
console.log(winner) 

/* 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 Task 2: 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 
Use getFinals to do the following:
1. Receive data as a parameter
2. Return an array of objects with the data of the teams that made it to the final stage

hint - you should be looking at the stage key inside of the objects
*/

function getFinals(data) {
    return data.filter(e => e["Stage"]==="Final");
}



/* 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 Task 3: 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
Use the higher-order function called getYears to do the following: 
1. Receive an array
2. Receive a callback function getFinals from task 2 
3. Return an array called years containing all of the years in the getFinals data set*/

function getYears(arr, getFinalscb) {
    return getFinalscb(arr).map(i => i["Year"])
}



/* 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 Task 4: 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
Use the higher-order function getWinners to do the following:  
1. Receives an array
2. Receives the callback function getFinals from task 2 
3. Determines the winner (home or away) of each `finals` game. 
4. Returns the names of all winning countries in an array called `winners` */ 

function getWinners(arr,getFinalscb) {
    const winners =  getFinalscb(arr).map(i => function(j){
        let winner;
        if(j["Home Team Goals"] !== j["Away Team Goals"]){
            winner = j["Home Team Goals"] > j["Away Team Goals"] ? j["Home Team Name"] : j["Away Team Name"]
        } else { 
            winner = j["Win conditions"].split(" ")[0] //this is not exactly correct since country name might exceed one word, but there isn't any world cup winner that exceed one word, so it's fine for now.
        }
        return winner;
    }(i))


    return winners;
}



/* 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 Task 5: 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 
Use the higher-order function getWinnersByYear to do the following:
1. Receive an array
2. Receive a callback function getYears from task 3
3. Receive a callback function getWinners from task 4
4. Return an array of strings that say "In {year}, {country} won the world cup!" 

hint: the strings returned need to exactly match the string in step 4.
 */

function getWinnersByYear(arr,getYearscb,getWinnerscb) {
    let winners = getWinnerscb(arr,getFinals);
    let years = getYearscb(arr,getFinals);
    return years.map((e,i) => `In ${e}, ${winners[i]} won the world cup!`)
}



/* 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 Task 6: 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
Use the higher order function getAverageGoals to do the following: 
 1. Receive the callback function getFinals from task 2 ensure you pass in the data as an argument
 2. Return the the average number of the total home team goals and away team goals scored per match and round to the second decimal place. 
 
 (Hint: use .reduce and do this in 2 steps) 
 
 Example of invocation: getAverageGoals(getFinals(fifaData));
*/

function getAverageGoals(data) {
    // the test wants 2 digit decimal
   return (data.reduce((a,b) => a+b['Home Team Goals']+b['Away Team Goals'],0)/data.length).toFixed(2)
}




/// 🥅 STRETCH 🥅 ///

/* 💪💪💪💪💪 Stretch 1: 💪💪💪💪💪 
Create a function called `getCountryWins` that takes the parameters `data` and `team initials` and returns the number of world cup wins that country has had. 

Hint: Investigate your data to find "team initials"!
Hint: use `.reduce` */

function getCountryWins(data,initials) {
    let finals = getFinals(data);
    let winners = getWinners(data,getFinals);

    
    return finals.reduce((a,b,i) => function(e){
        // we want to accumulate 1 if the given initial exists and the corresponding full name matches the winner name
        if(e["Home Team Initials"]===initials && winners[i]===e["Home Team Name"]){
            return 1;
        }
        if(e["Away Team Initials"]===initials && winners[i]===e["Away Team Name"]){
            return 1;
        }
        return 0;
    }(b) + a 
    ,0)

}

console.log(getCountryWins(fifaData,"ITA")) //4
console.log(getCountryWins(fifaData,"BRA")) //5
console.log(getCountryWins(fifaData,"ENG")) //1
console.log(getCountryWins(fifaData,"USA")) //0



/* 💪💪💪💪💪 Stretch 2: 💪💪💪💪💪 
Write a function called getGoals() that accepts a parameter `data` and returns the team with the most goals score per appearance (average goals for) in the World Cup finals */



function getGoals(data) {

    let finals = getFinals(data);
    let finalscore = {}; // we store preprocessed results as a pair of "Name": [totalgoal, total appearances]

    // loop through and accumulate to finalscore
    finals.forEach(e => {
        finalscore[e["Home Team Name"]] = finalscore[e["Home Team Name"]] === undefined ? [e["Home Team Goals"],1] : [finalscore[e["Home Team Name"]][0]+e["Home Team Goals"], finalscore[e["Home Team Name"]][1]+1]
        finalscore[e["Away Team Name"]] = finalscore[e["Away Team Name"]] === undefined ? [e["Away Team Goals"],1] : [finalscore[e["Away Team Name"]][0]+e["Away Team Goals"], finalscore[e["Away Team Name"]][1]+1]
    });
    let avg = [];
    // calculate avgs for each final entrants
    for(let i in finalscore){
        avg.push([i,finalscore[i][0]/finalscore[i][1]])
    }
    // return the highest
    return avg.sort((a,b) => b[1]-a[1])[0]

}
console.log(getGoals(fifaData)) // ["Uruguay", 4] Uruguay with 4 avg goals per final appearance


/* 💪💪💪💪💪 Stretch 3: 💪💪💪💪💪
Write a function called badDefense() that accepts a parameter `data` and calculates the team with the most goals scored against them per appearance (average goals against) in the World Cup finals */


// This is exactly the previous problem with accumulation logic flipped.
function badDefense(data) {
    let finals = getFinals(data);
    let finalscoreagainst = {};
    finals.forEach(e => {
        finalscoreagainst[e["Home Team Name"]] = finalscoreagainst[e["Home Team Name"]] === undefined ? [e["Away Team Goals"],1] : [finalscoreagainst[e["Home Team Name"]][0]+e["Away Team Goals"], finalscoreagainst[e["Home Team Name"]][1]+1]
        finalscoreagainst[e["Away Team Name"]] = finalscoreagainst[e["Away Team Name"]] === undefined ? [e["Home Team Goals"],1] : [finalscoreagainst[e["Away Team Name"]][0]+e["Home Team Goals"], finalscoreagainst[e["Away Team Name"]][1]+1]
    });
    let avg = [];
    for(let i in finalscoreagainst){
        avg.push([i,finalscoreagainst[i][0]/finalscoreagainst[i][1]])
    }
    return avg.sort((a,b) => b[1]-a[1])[0]
}
console.log(badDefense(fifaData))

/* If you still have time, use the space below to work on any stretch goals of your chosing as listed in the README file. */

// Account for ties in your 'finals' data set
// > it's already done above

// Create a function that takes country initials as a parameter and returns their total number of World Cup appearances.
function getCountryAppearances(data,initials) {
    let years = [... new Set(data.map(e => e["Year"]))];
    // 1950 is a special case, so we don't use the previous get years for finals.
    // console.log(years)
    
    let appearances = 0;
    for(let i of years){
        let appear = data.filter(e => e["Year"]==i).filter(e => (e["Home Team Initials"] === initials || e["Away Team Initials"]===initials))
        if(appear.length>0){
            appearances++;
            // console.log(i)
        }
    }
    return appearances;

}

console.log(getCountryAppearances(fifaData,"BRA")) // brazil => returns 20
console.log(getCountryAppearances(fifaData,"PRK")) // north korea => returns 2

// console.log(getFinals(fifaData))


/* 🛑🛑🛑🛑🛑 Please do not modify anything below this line 🛑🛑🛑🛑🛑 */
function foo(){
    console.log('its working');
    return 'bar';
}
export default{
    foo,
    getFinals,
    getYears,
    getWinners,
    getWinnersByYear,
    getAverageGoals
}
