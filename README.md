Event Attendance Tracker
-

For Champlain College Resident Assistants

This is a tool to assist with the tracking of attendance for events/programs put on by Resident Assistants at Champlain College.
It provides the ability to input event information and track student attendance for any one program.
This attendance can then be utilized to send emails to all attendees (for resident program evaluations) and the activities office (with the data on the event and who attended).

[Deployed Site](https://temportalflux.github.io/EventAttendanceTracker/)

https://temportalflux.github.io/EventAttendanceTracker/?EVENT_NAME="Brick Painting"&EVENT_TYPE="Community Development"&RA=["Dustin Yost"]&LOCATION="Whiting Hall"&ATTENDANCE_EMAIL={"recipient": {"user": "dustin.yost", "host": "@mymail.champlain.edu"}}

Pre-fill Options:
- STATE: string (one of "EVENT_INFO", "ATTENDANCE", or "CONFIRMATION")
- EVENT_NAME: string
- EVENT_TYPE: string
- RA: list of string
- LOCATION: string
- ATTENDANCE_EMAIL: object
```
{
	"recipient": {
		"user": string,
		"host": string (either "@mymail.champlain.edu" or "@champlain.edu"),
	},
	"subject": string,
	"body": string,
}
```
- DATE: valid date string
- TIME_START: valid time string
- TIME_END: valid time string
- ATTENDEE_NAME: string
- ATTENDEE_ID: 7 digit number
- ATTENDEE_EMAIL_ADDRESS: object
```
{
	"user": string,
	"host": "@mymail.champlain.edu",
}
```
- ATTENDEE_EMAIL: object
```
{
	"subject": string,
	"body": string,
}
```
