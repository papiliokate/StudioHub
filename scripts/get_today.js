function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
function getSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}
const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Kiritimati', year: 'numeric', month: '2-digit', day: '2-digit' });
const dateStr = formatter.format(new Date());
let seed = getSeed(dateStr);
let rand = mulberry32(seed);
let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let cyphers = [];
for(let k=0; k<3; k++) {
    let str = "";
    for(let j=0; j<4; j++) { str += chars.charAt(Math.floor(rand() * chars.length)); }
    cyphers.push(str);
}
let assignment = [0,1,2];
for (var i = assignment.length - 1; i > 0; i--) {
    var j = Math.floor(rand() * (i + 1));
    var temp = assignment[i];
    assignment[i] = assignment[j];
    assignment[j] = temp;
}
let result = ["","",""];
result[assignment[0]] = cyphers[0];
result[assignment[1]] = cyphers[1];
result[assignment[2]] = cyphers[2];
console.log("C1: ", result[0]);
console.log("C2: ", result[1]);
console.log("C3: ", result[2]);

console.log("Combination 1: ", result[0] + result[1] + result[2]);
