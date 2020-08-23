// Define "SVG"
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 60,
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

// Initial Params
let chosenXaxis = "hair_length";
let chosenYaxis = "healthcare";

// functions used for updating x-scale and y-scale axis upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  const xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.9,
    d3.max(healthData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, chartWidth]);

  return xLinearScale;

};

function yScale(healthData, chosenYAxis) {
  // create scales
  const xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.9,
    d3.max(healthData, d => d[chosenYAxis]) * 1.1
    ])
    .range([0, chartWidth]);

  return yLinearScale;

};

// functions used for updating xAxis/yAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  const bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// functions used for updating xAxis/yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  const bottomAxis = d3.axisBottom(newYScale);

  xAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  const bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// Import source data from csv file and create promise and then-catch methods

d3.csv('data/data.csv').then(function(healthData){
    console.log(healthData);

  // loop over "healthData" to convert data to numeric
  healthData.forEach(function(data){
    data.poverty = +data.poverty
    data.healthcare = +data.healthcare
  });

  // define xLinearScale & yLinearScale

  const xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d =>d.poverty) * 0.9, 
      d3.max(healthData, d => d.poverty) *1.1])
    .range([0, chartWidth]);

  const yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.healthcare) * 0.9, d3.max(healthData, d => d.healthcare) * 1.1])
    .range([chartHeight, 0]);

  // create xAxis and yAxis

  const bottomAxis = d3.axisBottom(xLinearScale);
  const leftAxis = d3.axisLeft(yLinearScale);

  // Append axis to a group within "chartGroup"

  chartGroup.append('g')
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  chartGroup.append('g')
    .call(leftAxis);
  
  //create scatter plot circles within chartGroup

  const circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .classed("stateCircle", true);

  // Add state abbr to the chart
  const circlesText = chartGroup.selectAll(null)
      .data(healthData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare) + 3)
      .attr("class", "stateText")
      .text(d => d.abbr);
      
  // Add chart labels

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
    .attr("class", "aText")
    .text("In Poverty (%)");
}).catch(function (error) {
    console.log(error);
  });
