window.onload = function () {
	var dataPoints = [];
	for(i=0;i<allYears.length;i++){
		if(allYears[i].population!=highestSavedYear.population){
			dataPoints.push({label: allYears[i].year, y: allYears[i].population});
		}else{
			dataPoints.push({label: allYears[i].year, y: allYears[i].population, markerColor: "red", markerType: "triangle"});
		}
	}
	var chart = new CanvasJS.Chart("chartContainer", {
		title:{
			text: chartText
		},
		animationEnabled: true,
		interactivityEnabled: true,
		axisY:{
			title: "Population",
			maximum: (Math.ceil(highestSavedYear.population/10)*10)+20,
			labelFontFamily: "arial"
		},
		axisX:{
			title: "Year",
			labelFontFamily: "arial",
		},
		toolTip:{
			labelFontFamily: "arial",
		},
		data: [
		{
			type: "line",
			dataPoints: dataPoints
		}
		]
	});
	chart.render();
};

var allYears = [];
var chartText = "";
var dataSet = [];
var endYear = "";
var highestSavedYear = "";
var startYear = "";
var tiedHighestArray = [];

loadJSON('dataSet.json',
         function(data) {
					 	dataSet = data.dataSet;
						getYearsRepresented();
						countPopulation();
						findYearWithHighestPopulation();
            textForChart();
					},
         function(xhr) { console.error(xhr); }
);

function countPopulation(){
  for(i=0;i<dataSet.length;i++){
    var birthYear = dataSet[i].birth;
    var deathYear = dataSet[i].death;
    while(birthYear <= deathYear){
      var yearNeeded = birthYear - startYear;
      allYears[yearNeeded].population++;
      birthYear++;
    }
  }
}

function findYearWithHighestPopulation(){
  highestSavedYear = allYears[0];
  for(i=0;i<allYears.length;i++){
    if(allYears[i].population > highestSavedYear.population){
      highestSavedYear = allYears[i];
    }
  }
  for(i=0;i<allYears.length;i++){
    if(allYears[i].population === highestSavedYear.population && allYears[i].year != highestSavedYear.year){
      tiedHighestArray.push(allYears[i].year);
    }
  }
}

function getYearsRepresented(){
  startYear = dataSet[0].birth;
  endYear = dataSet[0].death;
  for(i=0;i<dataSet.length;i++){
    if(dataSet[i].birth < startYear){
      startYear = dataSet[i].birth;
    }
  }
  for(i=0;i<dataSet.length;i++){
    if(dataSet[i].death > endYear){
      endYear = dataSet[i].death;
    }
  }
  var createYearVar = startYear;
  while(createYearVar <= endYear){
    var year = new YearInfo(createYearVar, 0);
    allYears.push(year);
    createYearVar++;
  }
}

function loadJSON(path, success, error){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if(xhr.status === 200) {
        if(success)
          success(JSON.parse(xhr.responseText));
      }else{
        if(error)
          error(xhr);
      }
  	}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

function textForChart(){
  if(tiedHighestArray.length === 0){
    chartText = "Question 1: The year with the highest population in this sample is " + highestSavedYear.year + ".";
  }else if(tiedHighestArray.length ==1){
    chartText = "Question 1: The years with the highest population in this sample are " + highestSavedYear.year + " and " + tiedHighestArray[0] + ".";
  }else{
    chartText = "Question 1: The years with the highest population in this sample are " + highestSavedYear.year + ", ";
		for(i=0; i<tiedHighestArray.length;i++){
			if(i != tiedHighestArray.length-1){
				chartText += tiedHighestArray[i] + ", ";
			}else{
				chartText += "and " + tiedHighestArray[i] + ".";
			}
		}
  }
}

function YearInfo(year, population){
  this.year = year;
  this.population = population;
}
