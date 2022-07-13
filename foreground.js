// variables to hold the hotkeys
const tilde = 192;
const page_down = 34;
const page_up = 33;
const enter = 13;


// variables holding different metrics
var currentProdCount = 0;   //current utterance count
var startTime = 0;          //timestamp when tracker is started
var totalDuration = 0;      //total time taken till refresh 
var currentVelocity = 0;    //velocity w.r.t time and prod count
var activeDuration = 0;     //total duration of sessions before tracker is paused
var targetVelocity = 0;     //target velocity set by DA
var expectedCount = 0;      //expected prod count w.r.t target velocity set and duration of the tracker
var TrackerStatus ="pause"; 


//creating objects for buttons and layout
const startBtn = document.getElementById('startTimer');
const refreshBtn = document.getElementById('refresh');
const resetBtn = document.getElementById('resetAll');
const pauseBtn = document.getElementById("pauseTimer");
const setVelocityBtn = document.getElementById("setTargetVelBtn");


// UI update and reference
if(startBtn !== null) {
    startBtn.addEventListener('click',startTimeStamp,false);
}
    
if(refreshBtn !== null){
  refreshBtn.addEventListener('click',getData,false);
}

if(resetBtn !== null) {
    resetBtn.addEventListener('click',reset,false);
}

if(pauseBtn !== null) {
    pauseBtn.addEventListener('click', paused, false);
}
if(setVelocityBtn !== null) {
    setVelocityBtn.addEventListener('click',setVelocity,false);
}


//reading the locally stored metrics data
chrome.storage.local.get('prod', function(count) {
    if(count.prod === undefined) {
        currentProdCount = 0;
    } else {
        //getting the latest total processed count
        currentProdCount = count.prod;
    }
});

chrome.storage.local.get('startTimeStampCount', function(duration) {
    if(duration.startTimeStampCount === undefined) {
        startTime = 0;
        } else {
        //getting the start timestamp of the tracker
        startTime = duration.startTimeStampCount;
    }
});

chrome.storage.local.get('status', function(state) {
  if(startBtn !== null) {
      //button accessibility based on the current status of the tracker
    if(state.status === "active") {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        refreshBtn.disabled = false;
        } 
    if(state.status === "pause") {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        refreshBtn.disabled = true;
        }
    }
});

chrome.storage.local.get('activeSessionDuration', function(duration) {
    if(duration.activeSessionDuration === undefined) {
        activeDuration = 0;
    } else {
        ////total duration of sessions before tracker is paused
        activeDuration = duration.activeSessionDuration;
    }
});

chrome.storage.local.get('targetVel', function(velocity) {
    if(velocity.targetVel === undefined) {
        targetVelocity = 0;
    } else {
        //getting the locally stored target velocity set
        targetVelocity = velocity.targetVel;
    }

    if(startBtn !== null) {
        document.getElementById('dashboard').rows[4].cells[1].innerHTML = targetVelocity;
    }
});


//Hotkey implementation
document.addEventListener("keydown",function(event){

    //tilde (`) or pagedown(Pg Dn) hotkey to add the prod counter
    if(event.keyCode === tilde || event.keyCode === page_down){
            currentProdCount++;
            //locally storing the incremented count
            chrome.storage.local.set({
                'prod': currentProdCount
            });
        };
        //contol+enter hotkey to add the prod counter
        if(event.ctrlKey && event.keyCode === enter){
                currentProdCount++;
            chrome.storage.local.set({
                'prod': currentProdCount
            });
        };
        //pageUp (Pg Up) Hotkey to reduce the prod counter
        if(event.keyCode === page_up){
                currentProdCount--;
            chrome.storage.local.set({
                'prod': currentProdCount
            });
        };
});


//Timestamp of starting the tracker
function startTimeStamp() {
    var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    const active = "active";

    var d = new Date();
    var t = d.getTime();

    var minutesCount = Math.round(t / minutes);

    //UI updates
    TrackerStatus = active;
    startBtn.disabled = true; 
    pauseBtn.disabled = false;

    //locally storing the data
    chrome.storage.local.set({
        'startTimeStampCount': minutesCount,
        'status': TrackerStatus
    });  
}


//When the tracker is paused
function paused() {

    var minutes = 1000 * 60;
    var d = new Date();
    var t = d.getTime();

    var minutesCount = Math.round(t / minutes);

    //getting the worked duration by subtracting the current timestamp to the starting timestamp + duration of active sessions before pausing (if any)
    var time = (minutesCount - startTime) + activeDuration;

    //duration values for clean UI update
    if(time<=60){
        totalDuration = time;
    } else {
        totalDuration = (time/60).toFixed(2);
    }

    //calculating the current velocity
    var durationInHours = time/60;
    currentVelocity = (currentProdCount/durationInHours).toFixed(2);

    //updating the latest prod count to UI
    var prodCountNumber = document.getElementById('dashboard').rows[1].cells;
    prodCountNumber[1].innerHTML = currentProdCount;        

    //updating the velocity values to UI
    var velocityElt = document.getElementById('dashboard').rows[3].cells;
    velocityElt[1].innerHTML = currentVelocity;

    //updating the time duration to the UI
    var duration = document.getElementById('dashboard').rows[0].cells;
    duration[1].innerHTML = totalDuration;

    //changing the status of the tracker and updating the UI elements
    TrackerStatus = "pause";
    startBtn.disabled = false; 
    pauseBtn.disabled = true; 
    refreshBtn.disabled = true;

    //locally storing the data
    chrome.storage.local.set({
        'activeSessionDuration': time,
        'status': TrackerStatus
    });


}


//getting the data to UI when refresh is clicked
function getData() {
  
    var minutes = 1000 * 60;
    var d = new Date();
    var t = d.getTime();

    var minutesCount = Math.round(t / minutes);

    //getting the total worked duration by subtracting the current timestamp to the starting timestamp + duration of active sessions before pausing (if any)
    var time = (minutesCount - startTime) + activeDuration;
        
    if(time<=60){
        totalDuration = time;
    } else {
        totalDuration = (time/60).toFixed(2);
    }

    var durationInHours = time/60;
    currentVelocity = (currentProdCount/durationInHours).toFixed(2);

    //calculating the expected prod count w.r.t to target velocity set and the total duration worked
    expectedCount = Math.round(targetVelocity*durationInHours);

    refreshBtn.disabled = true;

    //updating the UI elements with latest data
    document.getElementById('dashboard').rows[0].cells[1].innerHTML = totalDuration;
    document.getElementById('dashboard').rows[1].cells[1].innerHTML = currentProdCount;        
    document.getElementById('dashboard').rows[2].cells[1].innerHTML = expectedCount;
    document.getElementById('dashboard').rows[3].cells[1].innerHTML = currentVelocity;

}


// Resetting all data 
function reset() {
    startTime = 0;
    currentProdCount = 0;
    activeDuration = 0;
    targetVelocity = 0;
    TrackerStatus = "pause";

    //updating the UI elements
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    refreshBtn.disabled = false;

    document.getElementById('dashboard').rows[0].cells[1].innerHTML = "00:00";
    document.getElementById('dashboard').rows[1].cells[1].innerHTML = 0;
    document.getElementById('dashboard').rows[2].cells[1].innerHTML = 0;
    document.getElementById('dashboard').rows[3].cells[1].innerHTML = 0.00;
    document.getElementById('dashboard').rows[4].cells[1].innerHTML = targetVelocity;

    //resetting the locally stored data
    chrome.storage.local.set({
        'prod': currentProdCount,
        'startTimeStampCount': startTime,
        'activeSessionDuration': activeDuration,
        'targetVel': targetVelocity,
        'status': TrackerStatus
    });

    //reloading the tab to save the changes
    chrome.tabs.reload();
}


//setting the target velocity
function setVelocity() {

    //getting the values from the target velocity input box
    targetVelocity = document.getElementById('setTargetVel').value;
    document.getElementById('setTargetVel').value = '';
    document.getElementById('dashboard').rows[4].cells[1].innerHTML = targetVelocity;

    //locally updating the values
    chrome.storage.local.set({
        'targetVel': targetVelocity
    });
}

//FIN :)