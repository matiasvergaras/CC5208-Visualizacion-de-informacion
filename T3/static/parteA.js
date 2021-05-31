// Fuente: http://bl.ocks.org/williaster/af5b855651ffe29bdca1
const makeVis = function(data) {
    // Common pattern for defining vis size and margins
    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width  = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // Add the visualization svg canvas to the vis-container <div>
    const canvas = d3.select("#GA1").append("svg")
    .attr("width",  width  + margin.left + margin.right)
    .attr("height", height + margin.top  + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define our scales
    const colorScale = d3.scale.category10();

    const xScale = d3.scale.linear()
    .domain([ d3.min(data, function(d) { return d.TOTAL_MATRICULA_2015; }) - 1,
    d3.max(data, function(d) { return d.TOTAL_MATRICULA_2015; }) + 1 ])
    .range([0, width]);

    const yScale = d3.scale.linear()
    .domain([ d3.min(data, function(d) { return d.IVE_SINAE_2016; }) - 1,
    d3.max(data, function(d) { return d.IVE_SINAE_2016; }) + 1 ])
    .range([height, 0]); // flip order because y-axis origin is upper LEFT

    // Define our axes
    const xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

    const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

    // Add x-axis to the canvas
    canvas.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") // move axis to the bottom of the canvas
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width) // x-offset from the xAxis, move label all the way to the right
    .attr("y", -6)    // y-offset from the xAxis, moves text UPWARD!
    .style("text-anchor", "end") // right-justify text
    .text("Total matriculados año 2015");

    // Add y-axis to the canvas
    canvas.append("g")
    .attr("class", "y axis") // .orient('left') took care of axis positioning for us
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("font-size", 13)
    .attr("transform", "rotate(-90) translate(-100, -43)") // although axis is rotated, text is not
    .attr("y", 15) // y-offset from yAxis, moves text to the RIGHT because it's rotated, and positive y is DOWN
    .style("text-anchor", "end")
    .text("% Vulnerabilidad IVE-SINAE 2016 Colegio");


    // Adding a title
    canvas.append("text")
        .attr("x", (width / 2))
        .attr("y", -7)
        .attr("text-anchor", "middle")
        .style('font-weight','bold')
        .style("font-size", "18px")
        //.style("text-decoration", "underline")
        .text("Total matriculas año 2015 v/s porcentaje de vulnerabilidad INE-SINAE del colegio");

    // Add the tooltip container to the vis container
    // it's invisible and its position/contents are defined during mouseover
    const tooltip = d3.select("#GA1").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    //Legend
    var legend = canvas.selectAll(".legend")
        .data([... new Set(data.map(function (d) {return d.DEPENDENCIA;}))])
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i) { return "translate(0," + (i+17) * 20 + ")"; })
        .style("opacity","0");

    legend.append("rect")
        .attr("x", width - 21)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return colorScale(d); })

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {return d; });

    legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");


    // tooltip mouseover event handler
    const tipMouseover = function (d) {
        const color = colorScale(d.DEPENDENCIA);
        const html = d.NOMBRE_ESTABLECIMIENTO + "<br/>" +
            "<span style='color:" + color + ";'>" + d.DEPENDENCIA + "</span><br/>" +
            "</b> RBD:<b/>" + d.RBD + "-" + d.DV_RBD + "<br/> " + "</b> Tipo:<b/>" + d.AREA + "</b> Comuna:<b/>" + d.COMUNA;

        tooltip.html(html)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .transition()
            .duration(200) // ms
            .style("opacity", .9) // started as 0!

    };
    // tooltip mouseout event handler
    const tipMouseout = function(d) {
    tooltip.transition()
    .duration(300) // ms
    .style("opacity", 0); // don't care about position!
};

    // Add data points!
    canvas.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 5.5) // radius size, could map to another data dimension
    .attr("cx", function(d) { return xScale( d.TOTAL_MATRICULA_2015 ); })     // x position
    .attr("cy", function(d) { return yScale( d.IVE_SINAE_2016 ); })  // y position
    .style("fill", function(d) { return colorScale(d.DEPENDENCIA); })
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout);
};
// (Template para Scatter-Plot)

d3.csv('IVE-SINAE-BASICA.csv', function loadCallback(error, data) {
    data.forEach(function(d) { // convert strings to numbers
        d.TOTAL_MATRICULA_2015 = +d.TOTAL_MATRICULA_2015;
        d.IVE_SINAE_2016 = +d.IVE_SINAE_2016;
        d.PRIMERA_PRIORIDAD = +d.PRIMERA_PRIORIDAD;
    });
    makeVis(data);
});