// need to encode more data about these later
// I guess you could potentially do it by scraping https://{year}.igem.org/Judging/Medals
var pages = {
    'Attributions': {
        medals: ['bronze']
    },
    'Description': {
        medals: ['bronze']
    },
    'Contribution': {
        medals: ['bronze']
    },
    'Engineering': {
        medals: ['silver']
    },
    'Collaborations': {
        medals: ['silver']
    },
    'Human_Practices': {
        medals: ['silver', 'gold']
    },
    'Implementation': {
        medals: ['silver']
    },
    'Model': {
        medals: ['gold']
    },
    'Proof_Of_Concept': {
        medals: ['gold']
    },
    'Partnership': {
        medals: ['gold']
    },
    'Education': {
        medals: ['gold']
    },
};

window.addEventListener('load', (event) => {
    var form = document.getElementById("checker");
    form.addEventListener("submit", check);
});


function check(event) {
    event.preventDefault();
    var elements = event.srcElement.elements;
    var team = elements.team.value;
    var year = elements.year.value;
    for (page of Object.keys(pages)) {
        var request = new XMLHttpRequest
        request.addEventListener("load", displayResults)
        request.open("GET", `https://${year}.igem.org/Team:${team}/${page}`)
        request.send();
    }
}

function displayResults(event) {
    p = document.createElement('p')
    page = this.responseURL.split('/')[4];
    p.classList.add(pages[page].medals)
    p.innerText = page;
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
