function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}





// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(x => x.id == sample); //filtering an object in the array. "sampleOBJ is boiler plate for working with object array"
    //console.log(resultArray)
    

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    //console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var PANEL = d3.select("#sample-samples"); // this selects the entire meta data record

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values=result.sample_values;
    //PANEL.append("h6").text(result.otu_labels);
    //console.log(otu_labels)
    //console.log(sample_values)


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var y = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    
    
    //console.log(sorted);
        
    //console.log(y)

    // 8. Create the trace for the bar chart.
    
    var trace = {
      x: sample_values.slice(0, 10).reverse(),
      y: y,
      hovertext: otu_labels.slice(0, 10).reverse(),
      orientation: "h",
      name: 'Top Bacteria',
      type: 'bar'
    }
    
    

  var barData = [trace];

    // 9. Create the layout for the bar chart. 

    var barLayout = {title: "Top Ten Bacteria Cultures Found"};

    // 10. Use Plotly to plot the data with the layout. 
    
    Plotly.newPlot('bar', barData, barLayout);


// ------Bubble Chart--------


    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      { x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          color: otu_ids,
          size: sample_values,
        }
      }
    ];

    // 2. Create the layout for the bubble chart.

    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      margin: {t:0},
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      
      
    };




    // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout); 



  // ------ Gauge chart -------

    // Create a variable that holds the samples array. 

  var samples = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.

  var resultArray = samples.filter(x => x.id == sample);
    

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

  var metadata = data.metadata;
  console.log(metadata)

  var metaArray = metadata.filter(x => x.id == sample);
  console.log(metaArray)

    // Create a variable that holds the first sample in the array.
  
  var result = resultArray[0]
  

    // 2. Create a variable that holds the first sample in the metadata array.

    var metaresult = metaArray[0]; 
    console.log(metaresult)

    // Create variables that hold the otu_ids, otu_labels, and sample_values.

  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels;
  var sample_values=result.sample_values;

    

    // 3. Create a variable that holds the washing frequency.

  var washfreq = metaresult.wfreq;
  console.log(washfreq)

    // Create the yticks for the bar chart.

    // Use Plotly to plot the bar data and layout.
    //Plotly.newPlot();
    
    // Use Plotly to plot the bubble data and layout.
    //Plotly.newPlot();

    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      { 
        domain: { x:[0, 1], y:[0,1] },
        value: washfreq,
        title: {text: "Belly Button Washing (Frequency)" },
        label: {text: "Scrubs per Week"},

        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: {color: 'black'},
          axis:{ range: [null, 9]},
            steps:[
            {range:[0,2], color: 'rgb(245,75,66)' },
            {range:[2,4], color: 'rgb(245,152,66)' },
            {range:[4,6], color: 'rgb(245,242,66)' },
            {range:[6,8], color: 'rgb(167,245,66)' },
            {range:[8,10], color: 'rgb(66,245,72)' },

            ],
        },
      },
    ];
    
    // 5. Create the layout for the gauge chart.
  var gaugeLayout = { width: 500, height: 400, margin: {t:0, b:0}};

    // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}
