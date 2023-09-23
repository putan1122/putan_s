# User Guide for Homework 2 - Group 16 ZTF

Teammates: Zijian Zhang, Pu Tan, Yigao Fang

The following is the guide of how to run our Insta557 website:

## Set Up Instruction

1. Download the whole package to your local machine.

2. Navigate to the directory of project-group-16-ztf/insta557/

3. Run

```sh
$ npm install
```
to install necessary packages.

4. Run

```sh
$ npm install axios
$ npm install -g json-server
$ npm install -g jest
```
to install other packages for backend mocking and testing.

5. Run

```sh
$ npm start
```

6. Open a new tab in terminal, and navigate to the directory of project-group-16-ztf/insta557/json_server, and run

```sh
$ json-server db.json --port 8000
```

## Website Exploration Instruction (Very Important)

### Testing

To get the coverage rate of our UI testing, it's needed to run
```sh
$ jest --coverage
```
Otherwise the testing will not work (including npm test).
We have tested from different machines, and we can achieve a coverage rate of 75% for all files in the folder of insta557/src/components, which contains all javascript files.

### Frontend Implementation and Backend Mocking

1. Feature - User registration

- Navigate to http://localhost:3000/
- Click on the "Sign Up" button.
- Type in all of the information for the new user.
- Click on "Register!" button. (The new user will be created and posted to the insta557/json_server/db.json)
- The website will navigate to the main page of the website. The newly created user will be the logged in user.

2. Feature - Login/Auth

- Navigate to http://localhost:3000/
- Type in the username and password. Note that the usernames are case sensitive. (We highly recommend you to use "Kiki" as the username with password "123", since the two template posts in the existing mocked backend are for the user "Kiki".)
- Click on the "Log In" button.
- The website will navigate to the main page of the website. The user with the username just typed in will be the logged in user.

3. Feature - User profile page

- First make sure that there is a user logged in.
- Click on the upper right corner's "Panda head" logo.
- The website will navigate to the user profile page of the current logged in user.

4. Feature - Create post / Photo / Video upload

- First make sure that there is a user logged in.
- Click on the "Post or Upload" button.
- Type in the subject, description, the image URL. Here are some sample URL from the internet:
```sh
Jackie Chan:    https://i.ibb.co/wJPfKyM/KF.jpg
Cat:            https://i.ibb.co/2yv0GKP/cat.jpg
Raccoon:        https://i.ibb.co/RDx4cjs/xiaohuanxiong.jpg
```
(The new post will be created and posted to the insta557/json_server/db.json)
- The website will navigate to the main page of the website, and the new post will be shown on the main page.

5. Feature - Follow/unfollow users.

- First make sure that there is a user logged in.
- Click on the upper right corner's "Panda head" logo.
- Click on the "Follower Suggestions" on the left navigation list.
- A list of users will show up on the left navigation list.
- Click on some of the users shown on the list, the username and id will show up on the right.
- Click on the follow/ unfollow button will allow the logged in user to follow/ unfollow the current user shown.

6. Feature - Activity feed 

- (Continue from the last feature)
- The activity feed of following and unfollowing events will be shown in the "Activity Feed" section of the page.
- (For the activity feed of the post information) Click on the upper left corner's "Panda" logo to navigate back to the main page, and all of the posts posted by the current user will show up there.
