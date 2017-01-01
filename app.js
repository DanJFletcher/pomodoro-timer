// Timer from:
// http://codepen.io/anodpixels/pen/dxJmi?editors=0010
function _timer(sessionLength, breakLength, callback)
{
    var time = 0;     //  The default time of the timer
    var mode = 1;     //    Mode: count up or count down
    var status = 0;    //    Status: timer is running or stoped
    var timer_id;    //    This is used by setInterval function
    this.state = 0;  // 0 if in session, 1 if in break
    this.sessionLength = sessionLength;
    this.breakLength = breakLength;
    var self = this;
    
    // this will start the timer ex. start the timer with 1 second interval timer.start(1000) 
    this.start = function(interval)
    {
        interval = (typeof(interval) !== 'undefined') ? interval : 1000;
 
        if(status == 0)
        {
            status = 1;
            timer_id = setInterval(function()
            {
                switch(mode)
                {
                    default:
                    if(time)
                    {
                        time--;
                        generateTime();
                        if(typeof(callback) === 'function') callback(time);
                        
                        // If session finished, start break
                        if (time <= 0 && self.state === 0) {
                          self.state = 1;
                          self.reset(self.breakLength);
                          $('.state').html('<h1>Break Started</h1>');
                        } 
                      
                        // If break finished, start session
                        if (time <= 0 && self.state === 1) {
                          self.state = 0;
                          self.reset(self.sessionLength);
                          $('.state').html('<h1>Pomodoro Started</h1>');
                        } 
                    }
                    break;
                    
                    case 1:
                    if(time < 86400)
                    {
                        time++;
                        generateTime();
                        if(typeof(callback) === 'function') callback(time);
                    }
                    break;
                }
            }, interval);
        }
    }
    
    //  Same as the name, this will stop or pause the timer ex. timer.stop()
    this.stop =  function()
    {
        if(status == 1)
        {
            status = 0;
            clearInterval(timer_id);
        }
    }
    
    // Reset the timer to zero or reset it to your own custom time ex. reset to zero second timer.reset(0)
    this.reset =  function(sec)
    {
        sec = (typeof(sec) !== 'undefined') ? sec : 0;
        time = sec;
        generateTime(time);
    }
    
    // Change the mode of the timer, count-up (1) or countdown (0)
    this.mode = function(tmode)
    {
        mode = tmode;
    }
    
    // This methode return the current value of the timer
    this.getTime = function()
    {
        return time;
    }
    
    // This methode return the current mode of the timer count-up (1) or countdown (0)
    this.getMode = function()
    {
        return mode;
    }
    
    // This methode return the status of the timer running (1) or stoped (1)
    this.getStatus
    {
        return status;
    }
  
    // This metho returns he state session (0) or break (1)
    this.getState
  {
    return state;
  }
    
    // This methode will render the time variable to hour:minute:second format
    function generateTime()
    {
        var second = time % 60;
        var minute = Math.floor(time / 60) % 60;
        var hour = Math.floor(time / 3600) % 60;
        
        second = (second < 10) ? '0'+second : second;
        minute = (minute < 10) ? '0'+minute : minute;
        hour = (hour < 10) ? '0'+hour : hour;
        
        $('div.timer span.second').html(second);
        $('div.timer span.minute').html(minute);
        // $('div.timer span.hour').html(hour);
    }
}

//-----------------------------------------
// THE APP
(function() {
  
  // Default length of a pomodoro (seconds)
  var sessionLength = 25 * 60;
  
  // Default length of break (seconds)
  var breakLength = 5 * 60;
  
  // State
  var inSession = false, inBreak = false;
  
  // Create timer
  var timer = new _timer(sessionLength, breakLength);

  // Set the start time and initialize display
  timer.reset(sessionLength);
  
  // Set mode to countdown
  timer.mode(0);
  
  // toggle menu
  document.querySelector( "#nav-toggle" )
  .addEventListener( "click", function() {
    this.classList.toggle( "active" );
  });
  
	var body = $('body');
  var main = $('main');
	$('.menu-toggle').bind('click', function() {
		body.toggleClass('menu-open');
    main.toggleClass('menu-open');
		return false;
	});
  
  // Start timer
  $('.button-start').click(function() {
    timer.start();
    $(this).hide();
    $('.button-stop').show();
    
    if (timer.state === 0)
      $('.state').html('<h1>Pomodoro Started</h1>');
    
    if (timer.state === 1)
      $('.state').html('<h1>Break Started</h1>');
  });
  
  // Stop timer
  $('.button-stop').click(function() {
    timer.stop();
    $(this).hide();
    $('.button-start').show();
    
    if (timer.state === 0)
      $('.state').html('<h1>Pomodoro Stopped</h1>');
    
    if (timer.state === 1)
      $('.state').html('<h1>Break Stopped</h1>');
  });
  
  // reset
  $('.button-reset').click(function() {
    timer.state = 0;
    timer.reset(sessionLength);
  });
  
  // Add to pomodoro length
  $('.option-session .plus').click(function() {
    if (sessionLength < 60 * 60)
      sessionLength += (5 * 60);
    timer.reset(sessionLength);
    $('.option-session .option-time').html(sessionLength / 60 + ':00');
  });
  
  // Subtract from pomodoro length
  $('.option-session .minus').click(function() {
    if (sessionLength > 5 * 60)
      sessionLength -= (5 * 60);
    timer.reset(sessionLength);
    $('.option-session .option-time').html(sessionLength / 60 + ':00');
  });
  
  // Add to break length
  $('.option-break .plus').click(function() {
    if (breakLength < 60 * 60)
      breakLength += (5 * 60);
    $('.option-break .option-time').html(breakLength / 60 + ':00');
  });
  
  // Subtract from break length
  $('.option-break .minus').click(function() {
    if (breakLength > 5 * 60)
      breakLength -= (5 * 60);
    $('.option-break .option-time').html(breakLength / 60 + ':00');
  });
  
  // =========================
  // Quote generation
  var quotes = [
    "You can do anything as long as you have the passion, the drive, the focus, and the support. ~ Sabrina Brian",
    "Aim higher. Stay focused.",
    "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus. ~ Alexander Graham Bell",
    "In due time. Until then, Just grind.",
    "Where focus goes energy flows. ~ Tony Robins"
  ];
  
  var rndNum = getRandomInt(0, quotes.length);
  var rndQuote = quotes[rndNum];
  
  // Set random quote
  $('.quote').html(rndQuote);

  
})();

// Helper functions
// ================

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


