// Willie Payne
// index.js
// September 2019

// ---------------- Variables ----------------
let xAxis = [];
let xAccel = [];
let yAccel = [];
let zAccel = [];

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
    else  feedbackAfterInput(3);

    return parsedSuccess;
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

function feedbackAfterInput(caseNum) {
    let pBar = document.getElementById("progress");

    switch (caseNum) {
        case 0:
            pBar.style.width = "0%";
            break;
        case 1:
            pBar.style.width = "50%";
            break;
        case 2:
            pBar.style.width = "75%";
            break;
        case 3:
            pBar.style.width = "100%";
            break;
    }
}
