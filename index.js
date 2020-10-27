// I guess you could potentially do it by scraping https://{year}.igem.org/Judging/type
var pages = [
  {
    name: "Attributions",
    type: ["bronze"],
  },
  {
    name: "Description",
    type: ["bronze"],
  },
  {
    name: "Contribution",
    type: ["bronze"],
  },
  {
    name: "Engineering",
    type: ["silver"],
  },
  {
    name: "Collaborations",
    type: ["silver"],
  },
  {
    name: "Human_Practices",
    type: ["silver", "gold", "award"],
    award: "Best Integrated Human Practices",
  },
  {
    name: "Implementation",
    type: ["silver"],
  },
  {
    name: "Model",
    type: ["gold", "award"],
    award: "Best Model",
  },
  {
    name: "Proof_Of_Concept",
    type: ["gold"],
  },
  {
    name: "Partnership",
    type: ["gold"],
  },
  {
    name: "Education",
    type: ["gold", "award"],
    award: "Best Education",
  },
  {
    name: "Hardware",
    type: ["award"],
    award: "Best Hardware",
  },
  {
    name: "Inclusion",
    type: ["award"],
    award: "Inclusivity Award",
  },
  {
    name: "Measurement",
    type: ["award"],
    award: "Best Measurement",
  },
  {
    name: "Plant",
    type: ["award"],
    award: "Best Plant Synthetic Biology",
  },
  {
    name: "Software",
    type: ["award"],
    award: "Best Software Tool",
  },
  {
    name: "Entrepreneurship",
    type: ["award"],
    award: "Best Supporting Entrepreneurship",
  },
  {
    name: "Sustainable",
    type: ["award"],
    award: "Best Sustainable Development Impact",
  },
];

defaultMessages = [
    "There is currently no text on this page",
    "Delete this box in order to be evaluated for this medal criterion",
    "iGEM introduced an award for plant synthetic biology for the first time in 2016.",
    "To compete for the Best Hardware prize, please describe your work on this page and also fill out the description on the judging form.",
    "We should all recognize the importance of building an open and welcoming scientific community.",
    "There are a lot of exciting parts in the Registry, but many parts have still not been characterized.",
    "In previous years, iGEM had an entrepreneurship track. Teams were encouraged to build projects and focus on commercializing their work."
]

var checked = [];
var year;
var team;
var bronze;
var silver;
var gold;
var award;
var last;

window.addEventListener("load", (event) => {
  var form = document.getElementById("checker");
  form.addEventListener("submit", check);

  var awards_select = document.getElementById("awards");
  for (award of pages.filter((page) => page.type.includes("award"))) {
    div = document.createElement("div");
    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = award.name;
    label = document.createElement("label");
    label.innerText = award.award;

    div.appendChild(checkbox);
    div.appendChild(label);
    awards_select.appendChild(div);
  }
});

function check(event) {
  event.preventDefault();

  var results = document.getElementById("results");
  results.innerText = "";
  summary = document.getElementById("summary");
    summary.innerText = "";

  var elements = event.srcElement.elements;
  team = elements.team.value;
  year = elements.year.value;

  // reset totals
  bronze = 0;
  silver = 0;
  gold = 0;
  award = 0;

  checked = [];
  for (element of elements) {
    if (element.checked) {
      checked.push(element.name);
    }
  }

  for (page of pages.filter(
    (page) =>
      page.type.includes("bronze") ||
      page.type.includes("silver") ||
      page.type.includes("gold") ||
      checked.includes(page.name)
  )) {
    var request = new XMLHttpRequest();
    request.addEventListener("load", displayResults);
    request.open("GET", `https://${year}.igem.org/Team:${team}/${page.name}`);
    request.send();
    last = page.name;
  }
}

function displayResults(event) {
  div = document.createElement("div");
  div.classList.add("result-line");
  p = document.createElement("p");
  page = this.responseURL.split("/")[4];
  page = pages.filter((obj) => obj.name == page)[0];

  pageNotEdited = false;
  for (message of defaultMessages) {
      if (this.responseText.includes(message)) {
          pageNotEdited = true;
          break;
      }
  }
  if (pageNotEdited) {
      p.innerText = "FAILURE: "
      p.style.color = "red";
    } else {
        p.innerText = "SUCCESS: "
        p.style.color = "green";
  }
  div.appendChild(p);
  link = document.createElement('a');
  link.href = `https://${year}.igem.org/Team:${team}/${page.name}`
  link.innerText += `/${page.name}`;
  div.appendChild(link);
  for (type of page.type) {
    if (type != "award" || checked.includes(page.name)) {
      span = document.createElement("span");
      span.classList.add(type, "medal");
      div.appendChild(span);
      if (type == "award") {
          awardName = document.createElement("p");
          awardName.innerText = `(${page.award})`;
          div.appendChild(awardName);
      }

      if (!pageNotEdited) {
          if (type == 'bronze') {
              bronze++;
          } else if (type == 'silver') {
              silver++;
          } else if (type == 'gold') {
              gold++;
          } else if (type == 'award') {
              award++;
          }
      }
    }
  }

  document.getElementById("results").appendChild(div)

  if (page.name == last) {
    summary = document.getElementById("summary");
    summaryP = document.createElement('p');
    if (bronze == 3) {
        summaryP.innerText = "All 3 required bronze pages present\n";
    } else {
        summaryP.innerText = "less than 3 required bronze pages present\n";
    }
    summary.appendChild(summaryP);
    summaryP = document.createElement('p');
    if (silver == 4) {
        summaryP.innerText = "All 4 required silver pages present\n";
    } else {
        summaryP.innerText = "less than 4 required silver pages present\n";
    }
    summary.appendChild(summaryP);
    summaryP = document.createElement('p');

    if (gold >= 2) {
        summaryP.innerText = "2 or more required gold pages present";
    } else {
        summaryP.innerText = "less than 2 required gold pages present\n";
    }
    summary.appendChild(summaryP);
  }
}
