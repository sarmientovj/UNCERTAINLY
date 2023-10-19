function putText(id, msg) {
    document.getElementById(id).innerHTML = msg;
}

function clear(col) {
    if( col == 'X' ) {
        putText("Average_X", "");
        putText("Standard_Deviation_X", "");
        putText("Standard_Uncertainty_X", "");
        putText("Uncertainty_Reading_X", "");
        putText("Total_Uncertainty_X", "");
    }
    else if( col == 'Y' ) {
        putText("Average_Y", "");
        putText("Standard_Deviation_Y", "");
        putText("Standard_Uncertainty_Y", "");
        putText("Uncertainty_Reading_Y", "");
        putText("Total_Uncertainty_Y", "");
    }
    else {
        putText("Average_X", "");
        putText("Standard_Deviation_X", "");
        putText("Standard_Uncertainty_X", "");
        putText("Uncertainty_Reading_X", "");
        putText("Total_Uncertainty_X", "");
        putText("Average_Y", "");
        putText("Standard_Deviation_Y", "");
        putText("Standard_Uncertainty_Y", "");
        putText("Uncertainty_Reading_Y", "");
        putText("Total_Uncertainty_Y", "");
    }
}

function calculateStatistics() {
    var x = document.getElementById("frm1");
    var ur = parseFloat(document.getElementById("uncRead").value);
    var v, valuesX = [], valuesY = [];

    for(i=0; i<8; i++) {
        v = parseFloat(x.elements[i].value);
        if( ! isNaN(v) ) valuesX.push(v);
        i++;
        v = parseFloat(x.elements[i].value);
        if( ! isNaN(v) ) valuesY.push(v);
    }

    if( ((valuesX.length == 0) && (valuesY.length == 0)) || isNaN(ur)){
        document.getElementById("Statistics").style.display = "none";
        return;
    }
    // if( isNaN(ur)){
    //     document.getElementById("Statistics").style.display = "none";
    //     return;
    // }
    document.getElementById("Statistics").style.display = "block";

    if( valuesX.length == 0 ){
        clear('X');
    }
    else {
        putText("Average_X", Average(valuesX));
        putText("Standard_Deviation_X", standardDeviation(valuesX));
        putText("Standard_Uncertainty_X", standardUncertainty(valuesX));
        putText("Uncertainty_Reading_X", ur);
        putText("Total_Uncertainty_X", totalUncertainty(valuesX, ur));
    }

    if( valuesY.length == 0 ){
        clear('Y');
    }
    else {
        putText("Average_Y", Average(valuesY));
        putText("Standard_Deviation_Y", standardDeviation(valuesY));
        putText("Standard_Uncertainty_Y", standardUncertainty(valuesY));
        putText("Uncertainty_Reading_Y", ur);
        putText("Total_Uncertainty_Y", totalUncertainty(valuesY, ur));
    }

    if( (valuesX.length == 0) && (valuesY.length == 0)){
        clear('XY');
    }

    putText("Volumen", Volumen(valuesX, valuesY));
    putText("V_Uncertainty", uncertaintyVolumen(valuesX, valuesY, ur));

    putText("Theta_Average", Average(valuesX));
    putText("Theta_Uncertainty", totalUncertainty(valuesX, ur));

    putText("Ue", Ue(valuesX));
    putText("Ue_Uncertainty", uncertaintyUe(valuesX, ur));
}

function Average(data) {
    var sum, avg = 0;

    if (data.length) {
        sum = data.reduce(function(a, b) { return a + b; });
        avg = sum / data.length;
    }

    return avg;
}

function standardDeviation(data){
    var avg = Average(data);
    if( avg == 0) return 0;

    var squareDiffs = data.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var sum = squareDiffs.reduce(function(a, b) { return a + b; });
    var avgSquareDiff = sum / (squareDiffs.length - 1);

    return Math.sqrt(avgSquareDiff);
}

function standardUncertainty(data) {
    try {
        var stdDev = standardDeviation(data);
        return stdDev / Math.sqrt(data.length);
    } catch(err) {
        return 0;
    }
}

function totalUncertainty(data, uncRead) {
    try {
        var stdUnc = standardUncertainty(data);
        if( isNaN(stdUnc)) return 0;
        return Math.sqrt( stdUnc*stdUnc + uncRead*uncRead);
    } catch(err) {
        return 0;
    }
}

function Volumen(Height, Diameter) {
    var D = Average(Diameter);
    var H = Average(Height);
    return Math.PI * D * D * H / 4;
}

function uncertaintyVolumen(Height, Diameter, uncRead) {
    var D = Average(Diameter);
    var H = Average(Height);
    var V = Volumen(Height, Diameter);

    if( V == 0) return 0;

    var iD = totalUncertainty(Diameter, uncRead);
    var iH = totalUncertainty(Height, uncRead);
    var a = 4 * iD * iD / (D * D);
    var b = iH * iH / (H * H);

    return V * Math.sqrt(a + b);
}

function Ue(theta) {
    var degree = Average(theta);
    if( degree == 0) return 0;

    return Math.tan( degree * (Math.PI / 180) );
}

function uncertaintyUe(theta, uncRead) {
    var radians = Average(theta) * (Math.PI / 180);
    if( radians == 0) return 0;

    var iT = totalUncertainty(theta, uncRead);
    var uncUe = (1 / (Math.cos(radians) * Math.cos(radians)) ) * 0.0174533 * iT;
    return uncUe;
}