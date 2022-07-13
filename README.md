# files-production-tracker
A simple Chrome Extension Tracker to keep count of number of files processed.

## Available Hotkeys
These hotkeys can be used to increment or decrement the count everytime files are processed. 

* Grave (`) -> Increment 1
* PageDown -> Increment 1
* Ctrl+Enter -> Increment 1
* PageUp -> Decrement 1


## How to Install
1. Select **Extension** from settings in your chromium based browser.

![35a67a39f63ed40f735ca3dc0c05cb27.png](:/ccbaf12a7f6f4e4bafed4244117c4104)

2. Turn on **Developer Mode** in the Extension page.

![d02f5565e7cf29f36b4cc980a7b2e58b.png](:/7a54be364d4a4bc2b1dd755477704b8a)

3. Click on **Load Unpacked** on top right corner and select the **Velocity Tracker** folder

![a9acd021f936b7daff250fdbdf329ac4.png](:/9f26f645f42745fe8f8f033f7e932f73)

## How it works
* **Start Tracking** -> Will start the tracker in the extension 
* **Reset All** -> Will reset all recorded counts
* **Refresh** -> Will reset the current session
* **Duration** -> Shows the time duration the tracker has been live
* **Current Count** -> Shows the count of number of files processed
* **Expected Count** -> Shows the count of Expected number of files to be processed based on Target set
* **Current Velocity** -> Shows the Velocity (count/duration) of files being processed
* **Target Velocity** -> Shows the Expected Velocity to be maintained to meat the Target set

