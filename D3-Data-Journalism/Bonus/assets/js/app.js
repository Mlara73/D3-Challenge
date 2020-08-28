// Define "SVG"
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 90,
  left: 100
};

// Substract margins to calculate "chartWidth" and "chartHeight"
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// Append "svg" within div id "scatter" section
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group within "ChartGroup" that will hold the chart
  const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initialize default chart params
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

// functions used for updating x-scale and y-scale axis upon click on axis label

function xScale(healthData, chosenXAxis) {
  // create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.9,
    d3.max(healthData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, chartWidth]);

  return xLinearScale;

};

function yScale(healthData, chosenYAxis) {
  // create scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.9,
    d3.max(healthData, d => d[chosenYAxis]) * 1.1
    ])
    .range([chartHeight, 0]);

  return yLinearScale;

};

// functions used for updating xAxis/yAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(800)
    .call(bottomAxis);

  return xAxis;
};

function renderYAxes(newYScale, yAxis) {
  const leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(800)
    .call(leftAxis);

  return yAxis;
};

// function used for updating circles group with a transition to
// new circles

// X coordinates
function renderXCircles(circlesGroup, newXScale,chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))

  return circlesGroup;
};

// Y coordinates
function renderYCircles(circlesGroup, newYScale,chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
};

//function used for updating circles text group with a transition to
// new text

// X coordinates
function renderXText(circlesText, newXScale, chosenXAxis) {

  circlesText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
  return circlesText;
};

// Y coordinates
function renderYText(circlesText, newYScale, chosenYAxis) {

  circlesText.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis]) + 3);

  return circlesText;
}

// function used for updating circles group with new tooltip
function updateToolTip( circlesGroup, circlesText, chosenXAxis, chosenYAxis) {

  // define a conditional to define X & Y labels, and whether it needs or not a "%" symbol

  let xPercentageSymbol = "";
  let xLabel;

  if (chosenXAxis === "poverty") {
    xLabel = "Poverty:";
    xPercentageSymbol = "%";

  }
  else if (chosenXAxis === "age") {
  
    xLabel = "Age:";
  }
  else{
  
    xLabel = "Income:";
  }

  let yPercentageSymbol = "";
  let yLabel;

  if (chosenYAxis === "healthcare") {
    yLabel = "HealthCare:";
    yPercentageSymbol = "%";
  }
  else if (chosenYAxis === "smokes") {
  
    yLabel = "Smokes:";
    yPercentageSymbol = "%";

  }
  else {
  
    yLabel = "Obesity:";
    yPercentageSymbol = "%";
  }

  // define tooltip, chain and html with the required tooltip info
  const toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, -80])
    .html(function (d) {
      return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}${xPercentageSymbol}<br>${yLabel} ${d[chosenYAxis]}${yPercentageSymbol}`);
    });

  circlesGroup.call(toolTip);

  //mouseover event
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
  // onmouseout event
  .on("mouseout", function (data, index) {
    toolTip.hide(data);
  });

  circlesText.on("mouseover", function (data) {
    toolTip.show(data);
  })
  .on("mouseout", function (data, index) {
    toolTip.hide(data);
  });
    
  return circlesGroup;
}

// Import source data from csv file and create promise and then-catch methods

d3.csv('assets/data/data.csv').then(function(healthData, err){
    if (err) throw err;
    console.log(healthData);

  // loop over "healthData" to convert data to numeric (parseInt)
  healthData.forEach(function(data){
    data.poverty = +data.poverty
    data.age = +data.age
    data.income = +data.income
    data.healthcare = +data.healthcare
    data.obesity = +data.obesity
    data.smokes = +data.smokes
  });

  // xLinearScale, yLinearScale function above csv import
  let xLinearScale = xScale(healthData, chosenXAxis);
  let yLinearScale = yScale(healthData, chosenYAxis);

  // create xAxis and yAxis
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  // Append axis to a group within "chartGroup"
  let xAxis = chartGroup.append('g')
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  let yAxis =chartGroup.append('g')
    .call(leftAxis);
  
  //create initial scatter plot circles within chartGroup

  let circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "12")
    .classed("stateCircle", true);

  // Add initial state abbr's to the chart
  let circlesText = chartGroup.selectAll(null)
      .data(healthData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]) + 3)
      .attr("class", "stateText");
      
  // Add chart labels

  // Create group for three x-axis labels
  const xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight})`);

  const povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") // value to grab for event listener
    .attr("class", "aText")
    .classed("active", true)
    .text("In Poverty (%)");

  const agesLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .attr("class", "aText")
    .classed("inactive", true)
    .text("Age (Median)");

  const incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "income") // value to grab for event listener
    .attr("class", "aText")
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for three y-axis labels

  const yLabelsGroup = chartGroup.append("g")

  const healthCareLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (chartHeight / 2))
      .attr("value", "healthcare") // value to grab for event listener
      .attr("dy", "1em")
      .attr("class", "aText")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

  const smokesLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (chartHeight / 2))
      .attr("value", "smokes") // value to grab for event listener
      .attr("dy", "1em")
      .attr("class", "aText")
      .classed("inactive", true)
      .text("Smokes (%)");

  const ObesityLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (chartHeight / 2))
      .attr("value", "obesity") // value to grab for event listener
      .attr("dy", "1em")
      .attr("class", "aText")
      .classed("inactive", true)
      .text("Obesity (%)");

  // updateToolTip function above csv import
  circlesGroup = updateToolTip(circlesGroup, circlesText, chosenXAxis, chosenYAxis);

// x axis labels event listener
xLabelsGroup.selectAll("text")
.on("click", function () {
  // get value of selection
  const value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;
  
    // updates x scale for new data
    xLinearScale = xScale(healthData, chosenXAxis);

    // updates x axis with transition
    xAxis = renderXAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

    // updates text with new x values
    circlesText = renderXText(circlesText, xLinearScale,chosenXAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(circlesGroup, circlesText, chosenXAxis, chosenYAxis);

    // changes classes to change bold text
    if (chosenXAxis === "age") {
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      agesLabel
        .classed("active", true)
        .classed("inactive", false);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
    }

    else if (chosenXAxis === "income") {
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      agesLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", true)
        .classed("inactive", false);
    }
    else {

      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
      agesLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
    }
  }
});

// y axis labels event listener
yLabelsGroup.selectAll("text")
.on("click", function () {
  // get value of selection
  const value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    // replaces chosenXAxis with value
    chosenYAxis = value;

    console.log(chosenXAxis)

    // functions here found above csv import
    // updates y scale for new data
    yLinearScale = yScale(healthData, chosenYAxis);

    // updates y axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new y values
    circlesGroup = renderYCircles(circlesGroup, yLinearScale,chosenYAxis);

    // updates text with new x values
    circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(circlesGroup, circlesText, chosenXAxis, chosenYAxis);

    // changes classes to change bold text
    if (chosenYAxis === "healthcare") {
      healthCareLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      ObesityLabel
        .classed("active", false)
        .classed("inactive", true);
    }

    else if (chosenYAxis === "smokes") {
      healthCareLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
      ObesityLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      healthCareLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      ObesityLabel
      .classed("active", true)
      .classed("inactive", false);
    }
  }
});
}).catch(function (error) {
    console.log(error);
  });
