Open-World
===========
### *[OW](https://github.com/Glavin001/open-world), powered by the [IB Engine](https://github.com/Glavin001/icebear): A painfully better gaming experience*

![Halifax Sideview](https://f.cloud.github.com/assets/1885333/348208/267f485c-9f32-11e2-9931-1fdff5f4e3b6.png?raw=true "Halifax sideview")

The original idea behind "[Open-GTA](https://github.com/tim-speed/openmap-gta)", by [Tim Speed](https://github.com/tim-speed/), was that open data would be used to create a map for an old-style, 2D, GTA clone. 
I felt that 3D is much cooler and also I wanted to focus more on the environment/scenery and the interactiveness with the player, than the feel of GTA. 
I forked the original project in hopes to solidate my goal: to create an open-ended "game" where players could do whatever they wanted in a world that resembled their own.

Test out our current build at http://society.cs.smu.ca:8081/game.html
Please [create an Issue](https://github.com/Glavin001/open-world/issues/new) if the server is down and you would like to see a demo.

## How to Contribute
See [issue #24](https://github.com/Glavin001/open-world/issues/24). 
We would love more developers contributing to this ambitious project.

## Installation
Run the following Terminal commands.
### 1a) SSH
```bash
git clone git@github.com:Glavin001/open-world.git && cd open-world && npm install
```
#### Troubleshooting
If you receive the following error:
```bash
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```
Then use method `1b`, `HTTP`, instead.
To solve the SSH `permission denied` issue you need to setup a [SSH Key for your Github account](https://help.github.com/articles/generating-ssh-keys)
### 1b) HTTP
```bash
git clone https://github.com/Glavin001/open-world.git && cd open-world && npm install
```
### 2) Build Leaflet from source
Change directory into our Leaflet source location:
Then
```bash
cd client/OpenWorld/lib/Leaflet/
```
As per [Leaflet's documentation](http://leafletjs.com/download.html):
```bash
npm install -g jake
npm install
```
Then finally:
```bash
jake
```
And to test that it was successful:
```bash
ls dist
```
You should see:
```bash
images  leaflet.css  leaflet.ie.css  leaflet.js  leaflet-src.js
```
Now go back out to the root directory of this repository:
```bash
cd ../../../../
```

## Run
To start the server app execute the following from the root directory of the repository (default port 8081):
```bash
node server/server.js
```
In your browser go to [http://localhost:8081/game.html](http://localhost:8081/game.html).
### Custom Port Number
To start the server app with a custom port number, such as `3000`, execute the following:
```bash
node server/server.js -p 3000
```
In your browser go to [http://localhost:3000/game.html/](http://localhost:3000/game.html).

## Screenshots
These are old screenshots of walking around Halifax. The current build is much more sophisticated and will become even more appealing in the near future.
![Halifax Sideview](https://f.cloud.github.com/assets/1885333/269440/fcbefd0c-8f94-11e2-9d12-c59248675752.png?raw=true "Halifax sideview")
![Halifax Sideview](https://f.cloud.github.com/assets/1885333/269441/fcc9fdd8-8f94-11e2-8f4b-090b3f7e5284.png?raw=true "Halifax sideview")
![Halifax Sideview](https://f.cloud.github.com/assets/1885333/269442/fccbc848-8f94-11e2-95c0-7b8b64c92480.png?raw=true "Halifax sideview")
A little bit newer:
![Halifax Sideview](https://f.cloud.github.com/assets/1885333/348208/267f485c-9f32-11e2-9931-1fdff5f4e3b6.png?raw=true "Halifax sideview")

## Past
Originally thought to be an old styled GTA game. now with 3D graphics using open map data and much more in the future updates to come!
The original project can be found here: https://github.com/tim-speed/openmap-gta

## Present
WebGL demo: http://society.cs.smu.ca:8081/game.html
- Retrieving OpenStreetMaps data; and
- Display in 3D on a canvas with Three.js

### Installation
- Install Node.js
- npm install socket.io
- The 3D GL version is the file ```game.html``` in the client directory.

## Future
- Physics
- Vehicles
- Players

These are a few screenshots of similar projects, from a 3D display standpoint, **Open-World** will allow players to walk around and interact with the world that is rendered around them.
![OSM-3D](http://wiki.openstreetmap.org/w/images/3/39/VintlItalienI.png?raw=true "OSM-3D")
![Glosm](http://wiki.openstreetmap.org/w/images/3/37/Glosm1.png?raw=true "Glosm")
![OSM2World](http://wiki.openstreetmap.org/w/images/f/f2/OSM2World_0.2.0_-_Passau_from_Inn_POV.png?raw=true "OSM2World")
![XHouseT for X-Plane](http://wiki.openstreetmap.org/w/images/a/a1/XHouseT_xht1_04.jpg?raw=true "XHouseT for X-Plane")
![osm2xp for X-Plane](http://wiki.openstreetmap.org/w/images/b/ba/Osm2xp.jpg?raw=true "osm2xp for X-Plane")

Learn more about these projects here: http://wiki.openstreetmap.org/wiki/3D_Development

ViziCities is another project to take a look at: http://vizicities.com/
