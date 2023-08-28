### Functionality To Be Added
- Website to statically display all the built-in commands for easy reference, maybe also the current location of the chair.
- Connection to an LCD screen to display certain text, including battery percentage, command feedback, etc.
- OpenAI voice recognition system to parse user voice, plus interpret any commands
	- STOP must stop the  chair in place immediately
	- Move backwards should check the ultrasonic sensor for collisions
	- The chair must always operate within 25-75% of full capacity (25% SLOW, 50% MEDIUM, 75% FAST) when operated using voice, and once there is any joystick command, must give back control to the joystick system.
### In-built Commands (Hey wheelchair, ...)
- Move <forward, backward>: Move at MEDIUM speed in specified direction
- Turn <left, right>: Turn the wheelchair 90 degrees in said direction
- STOP: ends all wheelchair movement execution
- Save Command: Notes what the joystick is on, and keys it to a 2 word command provided by the user
- Slow down: Shift from FAST mode to MEDIUM, or from MEDIUM to SLOW, or SLOW to STOP.
- Speed up: Shift from MEDIUM to FAST, or from SLOW to MEDIUM, or STOP to SLOW.
### Tasks to be completed
- Build out the web interface to list the voice commands, and the system to access it via wifi - Using REACT, create an interface that can be used to see all the commands that were loaded on the wheelchair at launch, and maybe another that can show all the new commands that the user added, then  maybe the chair location
- Implement a Virtual Joystick system to control the wheelchair given a certain command
- Implement a simple voice recording and recognition system that can listen to the user every (10?) few seconds and report what has been said to the other processes
- Implement a simple feedback system using the wheelchair's LCD display that shows the battery percentage and indicates whether the chair is executing any commands or not
- Actual uploading and live testing of the systems on the actual chair, with feedback to every coder. (2 person job)
### Completed Tasks
- Wheelchair component modelling and profiling
- OpenAI account registration and voice recognition testing with Whisper
- Technical document drafting
- Github repo setup
