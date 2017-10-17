# Textual and Qualitative Data: A Festival Schedule (DOM + CSS)


### Preliminaries

Install [Homebrew](https://brew.sh) as a means to installing [node.js](https://nodejs.org/en/) on your system. After installing Homebrew, you can install node by typing into a Terminal window:

```
brew install node
```

In your student subdirectory, you should first install the project dependencies by typing:

```
npm install
```

You can then start up the development server by typing:

```
npm start
```

There are three different versions of the schedule data that have been pre-processed to make different groupings possible. Look in the `assets` directory at the files `artists.json`, `venues.json`, and `shows.json` and choose your source file accodingly.

Your work for this project will mostly take place in three places:

  - `template.html` – edit this to establish the ‘rules’ for how your HTML should be constructed from your JSON data.
  - `render.js` – organize, rename, and pre-process the data you want to display in this script. When you’re ready to re-generate your HTML, run the script.
  - `site/styles.css` – establish CSS rules to format the data differently based on its hierarchical significance, location, time, etc.

Whenever you make changes to the template or render script, you'll need to re-generate the resulting `site/index.html` file by executing the script (after first having `cd`’d into your student directory):

```
node render.js
```

The two Javascipt libraries we’ll be using heavily in this project are:

 - [Handlebars](http://handlebarsjs.com) for HTML generation from data + templates.
 - [Lodash](https://lodash.com/docs/) for data manipulation and extraction

### Goal

- Focusing on typography, text layout, and organization, visualize the schedule for last summer’s Northside music festival. The [original schedule](http://northsidefestival.com/northside-2017/schedule/music/by-venue/) organizes the information horizontally according to day and vertically according to venue, but don’t feel constrained to this scheme (or satisfied with simply replicating it for that matter).

- The goal of this 2-week exercise is the deliberate and appropriate use of text as a qualitative source of information. Focus on either *Artist* names, *Venue* names, or *date & time* as the first hierarchy level, before adding optional information such as the line-up of opening acts or show durations. No visual or UI element should be introduced without consideration and intent.

- Use any available typography approaches at your discretion. Organization via text files, HTML markup, global and local uses of CSS, p5 text functions and p5 style() function for CSS.

- Feel free to use sorting, filtering, or UI if you feel sufficiently comfortable with HTML forms and JavaScript mouse events, without shifting focus away from the primary goals and the objective of the exercise-typography and qualitative information.

### Process

- As always, only create or modify files within the `students/<your-name>` subdirectory.Also make sure you stay out of the `students/<your-name>/site/lib` directory since it’s a symbolic link to a folder all your projects share.

- You **must** constrain yourself to using the [Libre Franklin](https://fonts.google.com/specimen/Libre+Franklin) type family for this assignment. It’s already been set as the default family in the `styles.css` file. Limit yourself to modifying the `font-weight` (in the range 100–900) and `font-style` (if you want to italicize). Also look into changing the `color`, `font-size`, and `line-height`, as well as experimenting with `text-transform` to change case.

- Sync your local repository with the copy on GitHub before the start of class on 18 Oct.
