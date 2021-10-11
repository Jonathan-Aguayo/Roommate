# 🚀 Welcome to your new awesome project!

This project has been created using **webpack-cli**, you can now run

```
npm run build
```

or

```
yarn build
```

to bundle your application

# Project Homescreen
![image of homescreen](static/readmepics/homescreen.PNG)

# Adding event to calendar
1. Click the circled button on the bottom right of the calendar to open the add task menu
![add task menu](static/readmepics/addtask1.PNG)
2. Select start date, end date, name of event, and who it is assigned to (optional) 
![add task menu](static/readmepics/addtask2.PNG)
![add task menu](static/readmepics/addtask3.PNG)
3. Refresh the page and event will appear on household calendar. Everyone in the household can see the event
![add task menu](static/readmepics/addtask4.PNG)


# Account page view for household owner
### Only the owner will have this view. The owner options are in the topmost section
![household owner view](static/readmepics/houseowneraccountview.PNG)
## Assigning chores
### The goal is to fairly rotate chores between everyone in the household
1. Open the assign chores menu by clicking Assign Chores button 
![assign chores menu](static/readmepics/assignchores1.PNG)
    * Users can click on the chores that they want to be assigned and the groups that will be included in the assigning process.
    * If start week and end week are the same, the chores will only be assigned for one week. 

2. Confirmation dialog
![confirmation dialog](static/readmepics/assignchores2.PNG)
3. Chores now appear in the shared google calendar
![calendar view of chores](static/readmepics/assignchores3.PNG)
![chore rotation example 1](static/readmepics/assignchores4.PNG)
![chore rotation example 2](static/readmepics/assignchores5.PNG)




# Account page view for members of household
![group member account view](static/readmepics/groupmemberaccountview.PNG)


# Inviting people to your household
1. Click on invite housemate button which will reauthenticate user and redirect to invite page. Reauthentication is used to refresh the access token needed to change the calendar access control and allow invited party to make changes.
![invite housemate page](static/readmepics/invitehousemate1.PNG)

2. Completed form input

![complete input](static/readmepics/invitehousemate2.PNG)

3. Success alert
![invite success alert](static/readmepics/invitehousemate3.PNG)

4. Google will send party an automated message saying that a new google calendar has been shared with them.
![automated google message](static/readmepics/invitehousemate4.PNG)

5. Email sent by room8tes email messenger

![automated room8tes email](static/readmepics/invitehousemate5.PNG)

6. Invited party clicks the join link and enters the household ID mentioned in the email to join the household.
![invite housemate page](static/readmepics/invitehousemate6.PNG)

