const margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

const x1 = d3.scale.ordinal();

const y = d3.scale.linear()
    .range([height, 0]);

const xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

const yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

const color = d3.scale.ordinal()
    .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

    d3.csv("IVE-SINAE-BASICA.csv", function(error, data) {
        createVis(data)
    });

function countDependenciasGral(nested, dependenciaNames){
    const dict = {}
    dependenciaNames.forEach((el, index) => dict[el] = 0);
    for(index in nested){
        const dict_reg = {}
        dependenciaNames.forEach((el, index) => dict_reg[el] = 0);
        getInfoByReg(nested, index, dict_reg)
        for(key in dependenciaNames){
            if (dict_reg[dependenciaNames[key]] > dict[dependenciaNames[key]]){
                dict[dependenciaNames[key]] = dict_reg[dependenciaNames[key]];
            }
        }
    }
    const arr = [];
    for (const key in dict) {
        arr.push(dict[key])
    }

    return arr;
}

function getInfoByReg(nested, index, dict_reg){
    for(k in nested[index].values){
        let dependencia = nested[index].values[k];
        dict_reg[dependencia.key] += dependencia.values.length;
    }
    return dict_reg;
}

// function that wraps around the d3 pattern (bind, add, update, remove)
// Fuente: https://stackoverflow.com/questions/24193593/d3-how-to-change-dataset-based-on-drop-down-box-selection
function createVis(data) {
    const canvas = d3.select('#GA2').append("svg")
        .attr("id", "svg-ga2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const nested = d3.nest()
        .key(function (d) {
            return d.COD_REGION;
        })
        .key(function (d) {
            return d.DEPENDENCIA;
        })
        .entries(data);

    console.log(nested)

    const regionIDs = nested.map(function (d) {
        return d.key;
    });
    const dependenciaNames = nested[0].values.map(function (d) {
        return d.key;
    });

    x0.domain(regionIDs);
    x1.domain(dependenciaNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(countDependenciasGral(nested, dependenciaNames))]);


    canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2) // x-offset from the xAxis, move label all the way to the right
        .attr("y", 26)    // y-offset from the xAxis, moves text UPWARD!
        .style("text-anchor", "end") // right-justify text
        .style('font-weight', 'bold')
        .text("Región");

    canvas.append("g")
        .attr("class", "y axis")
        .style('opacity', '0')
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90) translate(-200, 0)") // although axis is rotated, text is not
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight', 'bold')
        .text("Cantidad");


    // Adding a title
    canvas.append("text")
        .attr("x", (width / 2))
        .attr("y", -7)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style('font-weight', 'bold')
        //.style("text-decoration", "underline")
        .text("Distribución de alumnos vulnerables por región con respecto a dependencia.");

    canvas.select('.y').transition().duration(500).delay(1300).style('opacity', '1');
    updateData(nested)

    //Legend
    const legend = canvas.selectAll(".legend")
        .data(nested[0].values.map(function(d) { return d.key; }).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i) { return "translate(-600," + (i+5) * 20 + ")"; })
        .style("opacity","0");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {return d; });

    legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
}
function updateData(nested){
    console.log("updating data")
    const canvas = d3.select('#svg-ga2')
    const slice = canvas.selectAll(".slice")
        .data(nested)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

    slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.key); })
        .style("fill", function(d) { return color(d.key) })
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return height - y(0); })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.key)).darker(1));
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(d.key));
        });

    // update both new and existing elements
    slice.transition()
        .duration(0)

    // remove old elements
    slice.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) { return y(d.values.length); })
        .attr("height", function(d) { return height - y(d.values.length); });

}

document.addEventListener("DOMContentLoaded", function(event) {
    d3.select('#opts').on('change', function() {
        var newData = document.getElementById('opts').value;
        if (newData == "MEDIA"){
            console.log("Changing to media 1");
            d3.csv("IVE-SINAE-MEDIA.csv", function(error, data) {
                const nested = d3.nest()
                    .key(function (d) {return d.COD_REGION;})
                    .key(function (d) {return d.DEPENDENCIA;})
                    .entries(data);
                updateData(nested)
            });
        } else {
            console.log("Changing to basica 1");
            d3.csv("IVE-SINAE-BASICA.csv", function (error, data) {
                const nested = d3.nest()
                    .key(function (d) {return d.COD_REGION;})
                    .key(function (d) {return d.DEPENDENCIA;})
                    .entries(data);
                updateData(data)
            })
        }
    });
});
