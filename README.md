# Final Project
Real-time chat application built with *Django, Django Rest Framework, Django Channels, Bootstrap, React* and some additional libraries (e.g auto slug field for django models, Django CORS headers, React Router DOM for React URL routing, React-Bootstrap)

# Distinctiveness and Complexity
This project is **complex** and **distinct** *from others*, why?
- It utilizes *DRF* to manipualte serialized data on the backend
- It utilizes *Django Channels library*, allowing this app use the **WebSocket** protocol, so users can recieve and send messages in real time
- App is *fully* mobile responsive
- *React* makes this app completely dynamic, **no reloads**
- It uses *DRF* built-in *Token Authentication*, so every time someone does something on the frontend, token is being passed from user's local storage to the backend to identify the user

To sum up, it is *distinct* from other projects because it uses new technologies, is not based on previous projects and built on different architecture(a separate React app for the frontend) with some asynchronous code in Django part of the project and *complex* because of the relations between the frontend and the backend, dynamic React components (e.g validation errors on Login and Sign Up forms, live search, etc). More of that will be explained in the Structure Chapter

> The main idea of this project was to create a website where users can create and join chat rooms with persistent data, where messages are updated dynamically

For the database it uses **SQLite**, but that can be changed to something like *PostgreSQL* with additional *Docker* container. The Channel Layers feature of Django Channels here uses *In Memory layer*, that can be changed for something like Redis, but that requires installing additional library. There is also *Django CORS headers* library used for exchanging data between the frontend and the backend, because they are located on different hosts.

# Structure
## Root
- **docker-compose.yml** file for building the app
- **djangochat** folder is the Django part of the project
- **frontend** folder is the React part of the project

## djangochat
Right here we have our backend structure. **Dockerfile** is the instructions to run this app backend container. The inner ***djangochat*** folder is the everything we get when we're making the Django project, i won't document every part of it, though few things need to be mentioned.
- **settings.py** have all the settings to make this project working, installed apps, settings for Django CORS Headers and Django Channels. I also changed timezone for my convenience.
- **asgi.py** has the settings and routing to set up the WebSocket

### chatapi
- admin.py, apps.py, tests.py(although i haven't wrote any tests): all the things you get when you create a Django app, configured to make it work.
- **consumers.py:** WebSocket logic. Users connect to the socket when they enter a chat room, then load all of it's contents. When the message is being sent by the user, it is created in the database, then all of the connected users recieve it. For convenience, I imported DRF serializers to manipulate JSONified data
- **middleware.py:** contains middleware i found online. It is used to ensure WebSocket is connected with DRF bulit-in Token authentication. Wraps up the app in *asgi.py* 
- **models.py:** models for Room and Message objects. When User object is created, it automatically gets a token associated with it. When User creates a Room model, User automatically is being added to the current users field
- **routing.py:** urlpattern for the websocket
- **serializers.py:** DRF serializers for views.py and consumers.py. Useful for validation and for sending and recieving data in JSON format 
- **urls.py:** URL routing for views
- **views.py:** CRUD for *Room* model, User Registration and CustomAuthToken is used for obtaining a Token used to log user in on the frontend

## frontend
>React app built with the create-react-app
**Dockerfile** to build React node container
Most of it's structure are automatically created, so I will only document files that was created or modified by me.

### **public**
- **favicon.ico:** I changed this one for the one i found on the internet
- **index.html:** Added bootstrap classes to the body

### **src**

#### *components* 
this is the files for this app's React Components
- **App.js:** Contains routing for the app, renders components associated with its routes
- **CreateRoom.js:** Form to create a room. If room is created, redirects user to it, if not - shows alert
- **Home.js:** Home page of the app. If *My Rooms* button is active, user gets rooms where he is a member. Active *All Rooms* button returns all of the rooms. Type something in search bar if you want to search for a specific room by it's name, the results will be rendered dynamically without reloading. Rooms have a *Join* button if current user is not a member of it and *Enter* if he is
- **Layout.js** is self explanatory. Has the navbar and the footer, app components are rendered inbetween them
- **LoginForm.js:** Log In form. Fires alerts if validation was failed, otherwise saves token, username and id in local storage and then redirects user to the homepage
- **SignUpForm.js:** Almost the same as the login form, used for registration. After successful account creation, logs user in and redirects him to the homepage
- **PrivateRoute.js** Component to redirect user to login page if he is not authenticated
- **Room.js:** Chat Room. User can leave room if he is a member and delete it if he's a host. All Messages are rendered inside of a scrollable card, which autoscrolls to bottom on first render. Here users connect to the backend websocket to recieve and send messages.

#### **utils**
- **getCookie.js** is a function from official Django documentation to get Django CSRF token.

#### **index.css** have some custom styling

# Installation
1. Go to root folder of project
2. Run "docker-compose-up -d" in the terminal
3. When build is completed run "docker-compose exec web python manage.py migrate" to apply migrations(or go inside of the web container and run migrate command there)
4. Go to localhost:3000 to use the app