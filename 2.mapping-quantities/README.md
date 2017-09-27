# Mapping Quantities, Categories, and Summarized Data

### Preliminaries

- Pull the most recent changes into your clone or fork of http://github.com/samizdatco/dvia-2017

For this assignment, brush up on these commands & constructs from last time:

- The [coordinate system](https://processing.org/tutorials/drawing/)
- Shape primitives: [`rect()`](https://p5js.org/reference/#/p5/rect)/[`ellipse()`](https://p5js.org/reference/#/p5/ellipse)/[`arc()`](https://p5js.org/reference/#/p5/arc)/
[`line()`](https://p5js.org/reference/#/p5/line)
- Setting colors: [`fill()`](https://p5js.org/reference/#/p5/fill)/[`stroke()`](https://p5js.org/reference/#/p5/stroke)
- Mixing colors: [`color()`](https://p5js.org/reference/#/p5/color)/[`lerpColor()`](https://p5js.org/reference/#/p5/lerpColor)
- Iteration: [`for(…;…;…)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for)/[`[].forEach(…)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)/[`while(…)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while)

Learn about dealing with data files & normalizing/interpolating numerical values:

- Structured data: [`loadTable()`](https://p5js.org/reference/#/p5/loadTable)/[`loadJSON()`](https://p5js.org/reference/#/p5/loadJSON)
- Interpolation: [`map()`](https://p5js.org/reference/#/p5/map)/[`norm()`](https://p5js.org/reference/#/p5/norm)

### Goal

- Create a visualization of recent seismic activity using one of the [live data feeds](http://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) provided by the USGS in CSV format
- Either choose from one of the ‘significant earthquakes’ feeds ([hourly](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.csv), [daily](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.csv), [weekly](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.csv), [monthly](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv)), or pick your own Richter scale threshold from the items in the sidebar. 
	- Note that if you pick a shorter timescale, your visualization should  account for the fact that there may be no datapoints and/or pick a lower threshold to increase the number of points.
- Use the depth, magnitude, location, time, and text fields to design a visualization that reflects current earthquake activity in terms of magnitude and recency. Examine quantitative differences in 1-hour, 1-day, 7-day, or 30-day data sets.
- For the extra-ambitious:
	- Experiment with pre-processing the data. Try grouping different events based on commonalities (e.g., location, size, depth range) and reporting them in terms of sums or averages. In other words, just because there are 36 rows in your CSV, that doesn't mean there have to be precisely 36 dots in your visualization!
	- Consider using latitude and longitude for a roughly geographic representation. Don't worry about projections or base-maps for this exercise, but note that directly mapping lat/long to x/y coordinates will give you potentially surprising results in terms of scale & rotation

### Process

- As always, only create or modify files within the `students/<your-name>` subdirectory.
- Start off by making pencil sketches for at least **three different approaches** to representing the data in the feeds. The point of these sketches is not to accurately represent the data as it exists but to illustrate your strategy for mapping the quantities, times, text strings, etc. to formal elements. These three sketches should be *conceptually* different from one another; not just *stylistic* tweaks of the same idea. 
	- Place these sketches in the `process` folder of your subdirectory.
- While developing the P5 version of your final direction, use the `server.sh` shell-script to launch a local HTTP server and navigate to your subdirectory within the browser window that pops up. This is necessary since you’ll be loading data from external CSV files and the browser’s security model will prevent this if you simply open your `index.html` file by double-clicking it.
	- To run the script on a mac, first find the `server.sh` file in the Finder
	- Next, open Terminal.app and drag the file into an open terminal window. It will automatically open a browser window pointint to the top-level of this Exercise.
	- When you’re done working for a while, you can type `ctrl-c` in the terminal window to shut down the web server.
- Sync your local repository with the copy on GitHub before the start of class on 4 Oct.


