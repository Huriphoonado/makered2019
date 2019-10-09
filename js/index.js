// Willie Payne
// index.js
// September 2019

// ---------------- Variables ----------------
let xAxis = [];

let xAccel = [];
let yAccel = [];
let zAccel = [];

let samplingRate = 20;

// ---------------- On Load ----------------
document.addEventListener('DOMContentLoaded', updatePlot, false);
document.addEventListener('DOMContentLoaded', function() {
    let menuToggle = document.getElementById("mob-toggle");
    let mobMenu = document.getElementById("mob-menu");
    let body = document.getElementsByTagName("BODY")[0];
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        mobMenu.style.display = '';
    });

    body.addEventListener('click', function() {
        mobMenu.style.display = 'none';
    });
});

/*
$('.mobile-menu-toggle').on('click', function(e) {
    e.preventDefault()
    e.stopPropagation()
    $('.mobile-menu').show()
})

$('body').on('click', function() {
    $('.mobile-menu').hide()
})
*/

// ---------------- Functions ----------------
function handleUserInput() {
    let userInput = event.target.value;
    let parsedInput;

    try {
        parsedInput = JSON.parse(userInput);
    } catch(e) {
        if (userInput.length == 0) feedbackAfterInput(0);
        else feedbackAfterInput(1);
        return false;
    }
    let parsedSuccess = sortAccelerationData(parsedInput);

    if (!parsedSuccess) feedbackAfterInput(2);
    else  {
        updatePlot();
        feedbackAfterInput(3);
    }

    return parsedSuccess;
}

function handleSampleRateInput() {
    let validNumFeedback = document.getElementById("validNumFeedback");
    let userInput = event.target.value;
    let parsedInput = parseInt(userInput);

    console.log(parsedInput);
    if (isNaN(parsedInput)) {
        event.target.classList.add("invalid");
        validNumFeedback.innerHTML = "Please input a valid integer";
        return false;
    }
    else {
        event.target.classList.remove("invalid");
        validNumFeedback.innerHTML = "";
        samplingRate = parsedInput;
        updatePlot();
        return true;
    }


}

function sortAccelerationData(parsedInput) {
    // We'll use temporary containers so that we don't overwrite the original
    // values unless new data is acceptable
    let xAxisTest = [];
    let xAccelTest = [];
    let yAccelTest = [];
    let zAccelTest = [];

    try {
        for (let p of parsedInput) {
            if ("index" in p && "xAcceleration" in p && "yAcceleration" in p && "zAcceleration" in p) {
                xAxisTest.push(p.index);
                xAccelTest.push(p.xAcceleration);
                yAccelTest.push(p.yAcceleration);
                zAccelTest.push(p.zAcceleration);
            }
            else {
                throw "incorrect key in object";
                break;
            }
        }
    } catch(e) {
        console.log(e);
        return false;
    }

    xAxis = xAxisTest;
    xAccel = xAccelTest;
    yAccel = yAccelTest;
    zAccel = zAccelTest;

    return true;
}

function updatePlot() {
    let layout = {title:"Acceleromerator Data"};
    let plotLoc = "plots";

    let xAxisInTime = xAxis.map(x => x / samplingRate);

    let xTrace = {x: xAxisInTime, y: xAccel, name: "X", mode: "lines"};
    let yTrace = {x: xAxisInTime, y: yAccel, name: "Y", mode: "lines"};
    let zTrace = {x: xAxisInTime, y: zAccel, name: "Z", mode: "lines"};
    let data = [xTrace, yTrace, zTrace];

    Plotly.newPlot(plotLoc, data, layout, {responsive: true});
}

function feedbackAfterInput(caseNum) {
    let pBar = document.getElementById("progress");
    let validFeedback = document.getElementById("validFeedback");
    let jsonInput = document.getElementById("jsonInput");

    switch (caseNum) {
        case 0:
            pBar.style.width = "0%";
            pBar.className = "progress-bar-red";
            jsonInput.classList.add("invalid");
            validFeedback.innerHTML = "Please paste your JSON data."
            break;
        case 1:
            pBar.style.width = "25%";
            pBar.className = "progress-bar-red";
            jsonInput.classList.add("invalid");
            validFeedback.innerHTML = "Text inputted is not proper JSON."
            break;
        case 2:
            pBar.style.width = "75%";
            pBar.className = "progress-bar-red";
            jsonInput.classList.add("invalid");
            validFeedback.innerHTML = "JSON contains incorrect fields."
            break;
        case 3:
            pBar.style.width = "100%";
            pBar.className = "progress-bar-green";
            validFeedback.innerHTML = "";
            jsonInput.classList.remove("invalid");
            break;
    }
}
