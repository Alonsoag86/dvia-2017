// TODO:
// flow around abs div
// SORTA:crossfade divs without absolute  PROBLEM: can't crossfade overlapping divs w/o absolute positioning
// NOPE: nbsp
// DONE: reset / legend?
// DONE: cb w name
// DONE: schedule / slider pic / unselect
// DONE: color artist select bug
// BROWSER BUG: column flow issue
// DONE: scrape days
// DONE: hookup venue / date
// DONE: date > 80%
// DONE: title / titlediv
// DONE: dl stub
// DONE: css resizing / repositioning galore
// DONE: rid of datastructure

// adapted from stackexchange
hScroll = function (obj, amount) {
        amount = amount || 120;
        obj.bind("DOMMouseScroll mousewheel", function (event) {
            var oEvent = event.originalEvent, 
                direction = oEvent.detail ? oEvent.detail * -amount : oEvent.wheelDelta, 
                position = obj.scrollLeft();
            position += direction > 0 ? -amount : amount;
            obj.scrollLeft(position);
            event.preventDefault();
        })
}
// scroll through artists
hScroll($(".sList, .s"), 100);

function modShow(action, id, epoch, img, sub, venue, artist) {
  
  if (action == "del") {
    $(".s[data-id=" + id +"]").remove();
    return;
  }
  
  date = new Date(epoch).toDateString();
  //time = new Date(epoch).toTimeString();
  time = new Date(epoch).toLocaleTimeString('en-US').replace(":00 ", "");

  day = date.split(" ")[0]
  img = "http:" + img;
  var realSubt = "";
  if (sub != "")
    realSubt = sub + " <br>"
    
  show = `
    <div class="s" data-id='` + id + `' data-day='` + day + `' data-epoch='` + epoch + `' data-venue="` + venue + `" data-artist="` + artist + `">
      <div class="sSub">
      
        <div class="sSub">
          <span id="rmSpan">X</span> 
          <image class="sImg" src="` + img + `" ></image> 
          <div id="rm">X</div> 
        </div>

        <div class="sSub">
          ` + artist + ` <br>
          <div class="sSubInfo">
          ` + realSubt + `
          ` + time + " " +date.split(" ")[0] + ` <br>
          </div>
        </div>
      </div>
    </div>
  `
  $(".sList").append(show);
  
  var sorted = $(".s[data-epoch]").sort(function (a, b) { // sort divs by time
      var contentA =parseInt( $(a).attr('data-epoch'));
      var contentB =parseInt( $(b).attr('data-epoch'));
      return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
  })
  
  $(".sList").html(sorted);
  

  
  $('.s').click(function() {   // re-up schedule events
    $(this).remove();
    updateHiLite();
  });
  
  $('.s').mouseenter(function() {  // re-up schedule events
    //$(">div", this).css("opacity", "0")
    $(" .sImg", this).css("height", "0")
    $(" .sImg", this).css("opacity", "0")
    $(" #rm", this).css("height", "0")
    $(" #rm", this).css("opacity", "1")
    
    //$(">div img", this).css("display", "none");
    //$(">div span", this).css("display", "inline-block");
  });

  $('.s').mouseleave(function() {  // re-up schedule events
    //$(">div", this).css("opacity", "")
    $(" .sImg", this).css("height", "")
    $(" .sImg", this).css("opacity", "1")
    $(" #rm", this).css("height", "")
    $(" #rm", this).css("opacity", "0")
    
    //$(">div span", this).css("display", "none");
    //$(">div img", this).css("display", "inline-block");    
  });
}

oColor = $('.aList > div:nth-child(odd)').css("color");
eColor = $('.aList > div:nth-child(even)').css("color");
sColor = "rgb(51, 122, 183)"
sColor = "rgb(229, 68, 40)"

$('.a').mouseenter(function() {  
  color = $(this).css("color")
  
  if (color == eColor)
    $(this).css("color", oColor)
    
  if (color == oColor)
    $(this).css("color", eColor)   
});

$('.a').mouseleave(function() {  
  $(this).css("color", "")
  updateHiLite();
});

function updateHiLite() {
   // update artists
  var selArt = [];
  $('.s').map(function(){
    selArt.push($(this).attr('data-artist'));
  });
  
  selArt = Array.from(new Set(selArt)); // uniq them
  
  $(".a").css("color", "");                    // turn em off
  for(var idx=0; idx<selArt.length; idx++)
    $(".a[data-artist=\"" + selArt[idx] + "\"]").css("color", sColor); // light em up
    
  // update dates
  var selDays = [];
  $('.s').map(function(){
    selDays.push($(this).attr('data-day'));
  });
  
  selDays = Array.from(new Set(selDays)); // uniq them
  
  $(".d").css("color", "");                    // turn em off
  for(var idx=0; idx<selDays.length; idx++)
    $(".d[data-fdate^=" + selDays[idx] + "]").css("color", sColor); // light em up
    
  // update venues
  var selVen = [];
  $('.s').map(function(){
    selVen.push($(this).attr('data-venue'));
  });
  
  selVen = Array.from(new Set(selVen)); // uniq them
  $(".v").css("color", "");                    // turn em off
  for(var idx=0; idx<selVen.length; idx++)
    $(".v[data-venue=\"" + selVen[idx] + "\"]").css("color", sColor); // light em up
}

$('.a').click(function() {

  var id = $(this).attr("data-id");
  
  if ($(this).css("color") != sColor) {
    $(this).css("color", sColor)
    var action = "add";
  } else {
    $(this).css("color", "")
    var action = "del";
  }
  
  var e = $(this).attr("data-epochs").split(",");
  for (var idx=0; idx < e.length; idx++) {
    modShow(action, $(this).attr("data-id"), parseInt(e[idx]), $(this).attr("data-image"), $(this).attr("data-sub"), $(this).attr("data-venues").split(",")[idx], $(this).attr("data-artist"));
  }    
  
  updateHiLite();
});

$('.titleDl').click(function() {
  alert("Fake Schedule Download to Infrastructure of Choice");
});

$('.titleDl').mouseenter(function() {  
  $(".title").css("height", "0%")
  $(".title").css("opacity", "0")
  $(".dl").css("height", "100%")
  $(".dl").css("opacity", "1")
});

$('.titleDl').mouseleave(function() {
  $(".title").css("height", "100%")
  $(".title").css("opacity", "1")
  $(".dl").css("height", "0%")
  $(".dl").css("opacity", "0")
});



  
