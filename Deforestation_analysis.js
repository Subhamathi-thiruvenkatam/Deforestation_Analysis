//Deforestation analysis 2013 to 2022 
//Importing landsat imagery and studyarea in shapefile format

 var studyArea = ee.FeatureCollection('projects/ee-subhamathithiruvenkatam/assets/Deforestation_China');
 var imageCollection = ee.ImageCollection('LANDSAT/LC08/C02/T1')
   .filterBounds(studyArea);
   
//Cloud masking
// the pixel_qa band of Landsat 8 SR data. 
// Bits 3 and 5 are cloud shadow and cloud, respectively.

 function maskL8sr(imageCollection) {
   var cloudShadowBitMask = 1 << 3;
   var cloudsBitMask = 1 << 5;

   var qa = imageCollection.select('QA_PIXEL');

   var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
       .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

   return imageCollection.updateMask(mask).divide(10000)
       .select("B[0-9]*")
       .copyProperties(imageCollection, ["system:time_start"]);
  }

// Make a list of years, then for each year filter the collection, 
// Mask clouds, and reduce by median. Important to add system:time_start 
// After reducing as this allows you to filter by date later.
 var stepList = ee.List.sequence(2013,2022);

 var filterCollection = stepList.map(function(year){
   var startDate = ee.Date.fromYMD(year,1,1);
   var endDate = ee.Date.fromYMD(year,12,31);
   var composite_i = imageCollection.filterDate(startDate, endDate)
                         .map(maskL8sr)
                        .median()
                       .set('system:time_start',startDate);
   return composite_i;
 });

 var yearlyComposites = ee.ImageCollection(filterCollection);
 print(yearlyComposites, 'Masked and Filtered Composites');

// // Add Normalized Difference Vegetation Index to a function and apply it.
// NDVI = ((NIR - Red) / (NIR + Red ))
 function ndvi(img){
   var ndviImg = img.select(['B5','B4'],['nir','red']);
   ndviImg = ndviImg.expression(
     '((NIR - RED) / (NIR + RED ))', {
       'NIR': ndviImg.select('nir'),
       'RED': ndviImg.select('red'),
     }).rename('NDVI');
   return img.addBands(ndviImg);
 }

 yearlyComposites = yearlyComposites.map(function(image){
   return ndvi(image);
 });



// Create image collection of yearly composites, selecting the NDVI band.
 var ndviCollection = yearlyComposites.select('NDVI');

// Define the NDVI threshold for deforestation
var ndviThreshold = 0.2;

// Function to classify deforestation based on NDVI threshold
function classifyDeforestation(image) {
  var deforestation = image.select('NDVI').lt(ndviThreshold).rename('Deforestation');
  return image.addBands(deforestation);
}

// Apply the deforestation classification to yearly composites
var deforestationCollection = yearlyComposites.map(classifyDeforestation);

// Create variables for each deforestation composite
var deforestation2013 = deforestationCollection.filterDate('2013-01-01', '2013-12-31')
  .median()
  .clip(studyArea);

var deforestation2014 = deforestationCollection.filterDate('2014-01-01', '2014-12-31')
  .median()
  .clip(studyArea);
  
var deforestation2015 = deforestationCollection.filterDate('2015-01-01', '2015-12-31')
  .median()
  .clip(studyArea);

var deforestation2016 = deforestationCollection.filterDate('2016-01-01', '2016-12-31')
  .median()
  .clip(studyArea);
  
var deforestation2017 = deforestationCollection.filterDate('2017-01-01', '2017-12-31')
  .median()
  .clip(studyArea);

var deforestation2018 = deforestationCollection.filterDate('2018-01-01', '2018-12-31')
  .median()
  .clip(studyArea);

var deforestation2019 = deforestationCollection.filterDate('2019-01-01', '2019-12-31')
  .median()
  .clip(studyArea);

var deforestation2020 = deforestationCollection.filterDate('2020-01-01', '2020-12-31')
  .median()
  .clip(studyArea);

var deforestation2021 = deforestationCollection.filterDate('2021-01-01', '2021-12-31')
  .median()
  .clip(studyArea);

var deforestation2022 = deforestationCollection.filterDate('2022-01-01', '2022-12-31')
  .median()
  .clip(studyArea);

// Set the visualization parameters for deforestation
var deforestationParams = {min: 0, max: 1, palette: ['green', 'red'], bands: 'Deforestation'};

// Calculate deforested area for 2013
var deforestationArea2013 = deforestation2013.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2013:', deforestationArea2013);

// Calculate deforested area for 2014
var deforestationArea2014 = deforestation2014.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2014:', deforestationArea2014);

// Calculate deforested area for 2015
var deforestationArea2015 = deforestation2015.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2015:', deforestationArea2015);

// Calculate deforested area for 2016
var deforestationArea2016 = deforestation2016.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2016:', deforestationArea2016);

// Calculate deforested area for 2017
var deforestationArea2017 = deforestation2017.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2017:', deforestationArea2017);

// Calculate deforested area for 2018
var deforestationArea2018 = deforestation2018.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2018:', deforestationArea2018);

// Calculate deforested area for 2019
var deforestationArea2019 = deforestation2019.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2019:', deforestationArea2019);

// Calculate deforested area for 2020
var deforestationArea2020 = deforestation2020.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2020:', deforestationArea2020);

// Calculate deforested area for 2021
var deforestationArea2021 = deforestation2021.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2021:', deforestationArea2021);

// Calculate deforested area for 2022
var deforestationArea2022 = deforestation2022.select('Deforestation')
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e9
  }).get('Deforestation');

print('Deforested Area 2022:', deforestationArea2022);

// Create an empty list to store the histograms
var ndviHistograms = [];

// Iterate over the years and create histograms for each year
for (var i = 2013; i <= 2022; i++) {
  var year = i.toString();

  // Filter the yearly composites by the current year
  var composite = yearlyComposites.filter(ee.Filter.calendarRange(i, i, 'year')).first();

  var ndviHistogram = ui.Chart.image.histogram({
    image: composite.select('NDVI'),
    region: studyArea,
    scale: 10,
    maxBuckets: 30
  }).setOptions({
    title: 'NDVI Histogram ' + year,
    hAxis: { title: 'NDVI' },
    vAxis: { title: 'Count' },
  });

  // Add the histogram to the list
  ndviHistograms.push(ndviHistogram);
}

// Display the histograms
ndviHistograms.forEach(function(histogram) {
  print(histogram);
});

// Center the map view on the AOI
Map.centerObject(studyArea);

// Add the deforestation composites to the map
Map.addLayer(deforestation2013, deforestationParams, '2013 Deforestation');
Map.addLayer(deforestation2014, deforestationParams, '2014 Deforestation');
Map.addLayer(deforestation2015, deforestationParams, '2015 Deforestation');
Map.addLayer(deforestation2016, deforestationParams, '2016 Deforestation');
Map.addLayer(deforestation2017, deforestationParams, '2017 Deforestation');
Map.addLayer(deforestation2018, deforestationParams, '2018 Deforestation');
Map.addLayer(deforestation2019, deforestationParams, '2019 Deforestation');
Map.addLayer(deforestation2020, deforestationParams, '2020 Deforestation');
Map.addLayer(deforestation2021, deforestationParams, '2021 Deforestation');
Map.addLayer(deforestation2022, deforestationParams, '2022 Deforestation');

// Define the export parameters
var exportParams = {
  scale: 10,
  region: studyArea.geometry(),
  maxPixels: 1e9,
  crs: 'EPSG:4326'
};

// Export deforestation layer for 2013
Export.image.toDrive({
  image: deforestation2013.select('Deforestation'),
  description: 'Deforestation_2013',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});

// Export deforestation layer for 2014
Export.image.toDrive({
  image: deforestation2014.select('Deforestation'),
  description: 'Deforestation_2014',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});

// Export deforestation layer for 2015
Export.image.toDrive({
  image: deforestation2015.select('Deforestation'),
  description: 'Deforestation_2015',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});

// Export deforestation layer for 2016
Export.image.toDrive({
  image: deforestation2016.select('Deforestation'),
  description: 'Deforestation_2016',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});

// Export deforestation layer for 2017
Export.image.toDrive({
  image: deforestation2017.select('Deforestation'),
  description: 'Deforestation_2017',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});


// Export deforestation layer for 2018
Export.image.toDrive({
  image: deforestation2018.select('Deforestation'),
  description: 'Deforestation_2018',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});

// Export deforestation layer for 2019
Export.image.toDrive({
  image: deforestation2019.select('Deforestation'),
  description: 'Deforestation_2019',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});

// Export deforestation layer for 2020
Export.image.toDrive({
  image: deforestation2020.select('Deforestation'),
  description: 'Deforestation_2020',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});

// Export deforestation layer for 2021
Export.image.toDrive({
  image: deforestation2021.select('Deforestation'),
  description: 'Deforestation_2021',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});

// Export deforestation layer for 2022
Export.image.toDrive({
  image: deforestation2022.select('Deforestation'),
  description: 'Deforestation_2022',
  folder: 'Deforestation_Export',
  scale: exportParams.scale,
  region: exportParams.region,
  maxPixels: exportParams.maxPixels,
  crs: exportParams.crs
});