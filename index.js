// need to encode more data about these later
// I guess you could potentially do it by scraping https://{year}.igem.org/Judging/Medals
var pages = [
    'Attributions',
    'Description',
    'Contribution',
    'Engineering',
    'Collaborations',
    'Human_Practices',
    'Implementation',
    'Model',
    'Proof_Of_Concept',
    'Partnership',
    'Education',
];

window.addEventListener('load', (event) => {
    var form = document.getElementById("checker");
    form.addEventListener("submit", check);
});


function check(event) {
    event.preventDefault();
    var elements = event.srcElement.elements;
    var team = elements.team.value;
    var year = elements.year.value;
    for (page of pages) {
        console.log(`${team}`);
        var request = new XMLHttpRequest
        request.addEventListener("load", displayResults)
        request.open("GET", `https://${year}.igem.org/Team:${team}/${page}`)
        request.send();
    }
}

function displayResults(event) {
    p = document.createElement('p')
    p.innerText = this.responseURL;
    if (
        this.responseText.includes("There is currently no text on this page") ||
        this.responseText.includes("Delete this box in order to be evaluated for this medal criterion")
    ) {
        p.innerText += " Failed";
        p.style.backgroundColor = 'red';
    } else {
        p.innerText += " Worked!"
        p.style.backgroundColor = 'green';
    }
    document.getElementById("results").appendChild(p);
}
