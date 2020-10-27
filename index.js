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

var awards = {
    'Best Education': {
        url: 'Education',
    },
    'Best Hardware': {
        url: 'Hardware',
    },
    'Inclusivity Award': {
        url: 'Inclusion',
    },
    'Best Integrated Human Practices': {
        url: 'Human_Practices',
    },
    'Best Measurement': {
        'url': 'Measurement',
    },
    'Best Model': {
        'url': 'Model',
    },
    'Best Plant Synthetic Biology': {
        'url': 'Plant',
    },
    'Best Software Tool': {
        'url': 'Software',
    },
    'Best Supporting Entrepreneurship': {
        'url': 'Entrepreneurship',
    },
    'Best Sustainable Development Impact': {
        'url': 'Sustainable',
    }
};

window.addEventListener('load', (event) => {
    var form = document.getElementById("checker");
    form.addEventListener("submit", check);

    var awards_select = document.getElementById("awards");
    for (award of Object.keys(awards)) {
        div = document.createElement('div');
        checkbox = document.createElement('input');
        checkbox.type="checkbox";
        checkbox.name=award;
        label = document.createElement('label');
        label.innerText = award

        div.appendChild(checkbox);
        div.appendChild(label);
        awards_select.appendChild(div);
    }
});


function check(event) {
    event.preventDefault();
    var elements = event.srcElement.elements;
    var team = elements.team.value;
    var year = elements.year.value;

    urls = Object.keys(pages);

    checked = []
    for (element of elements) {
        if (element.checked == true) {
            checked.push(element.name)
            urls.push(awards[element.name].url)
        }
    }

    for (page of urls) {
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
