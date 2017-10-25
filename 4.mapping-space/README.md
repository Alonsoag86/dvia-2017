# Mapping Space

### Preliminaries

- We’ll be using the [leaflet.js](http://leafletjs.com/index.html) library to add a geospatial component to your prior work on visualizing the [USGS earthquake feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php)

- Take a look at the P5 wiki page on [Integrating other Libraries](https://github.com/processing/p5.js/wiki/Integrating-other-libraries) for an overview of how to interact with the functions provided by external libraries.

- The Leaflet.js [Quick Start](http://leafletjs.com/examples/quick-start/) provides a good introduction to setting up a map and adding markers to it.

- Make use of the Leaflet [API Reference](http://leafletjs.com/reference-1.2.0.html) as you make your visualization more elaborate.

### Goal

- Add a geospatial dimension to your previous visualization, either to complement your prior work or as an enhancement of your initial stab at mapping the earthquake events.

- Incorporate magnitude and one other earthquake attribute (depth, time, etc) and experiment with different ways of encoding numerical values using size, shape, texture, and (especially in light of the week's assigned reading) **color**.

- Add at least one UI element to control the representation of your data (e.g. range, focus, filter)

### Process

- Install the local HTTP server by typing `npm install` from within your `student` subdirectory, then type `npm start` to spin it up.
- Consider the feedback you received in Exercise 2 as you decide how to proceed. If your previous project had a mapping component to it, use Leaflet to improve the fidelity of it but consider adding a secondary diagram/legend to provide context for (or to summarize) the information being conveyed in the map. If your prior work was more diagrammatic, try to find a way in which it can be integrated with the mapped representation.
- Sync your local repository with the copy on GitHub before the start of class on 1 Nov.
