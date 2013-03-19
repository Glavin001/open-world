/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var rotation = 0.01;
var s = 1;
$(document).keydown(function(event) {
  if (event.which == 87) {
    // W
    //console.log("W");
    camera.position.z -= s;
  }
  else if (event.which == 83) {
    // S
    //console.log("S");                               
    camera.position.z += s;
  }
  else if (event.which == 68) {
    // D
    //console.log("D");
    camera.position.x += s;
  }
  else if (event.which == 65) {
    // A
    //console.log("A");                               
    camera.position.x -= s;
  }
  else if (event.which == 38) {
    // Up
    //console.log("Up");
    /*  camera.position.y += s;
     if (camera.position.y > 960)
     camera.position.y = 960;
     */
    camera.rotation.x += rotation;
  }
  else if (event.which == 40) {
    // Down
    //console.log("Down");                               
    //camera.position.y -= s;
    camera.rotation.x -= rotation;

  }
  else if (event.which == 37) {
    // Left
    //console.log("Left");
    camera.rotation.y += rotation;
    /*
     var prevPos = camera.position;
     rotation += 0.05;
     camera.position.x = 0;
     camera.position.y = Math.sin(rotation) * 1;
     camera.position.z = Math.cos(rotation) * 1;
     camera.lookAt( prevPos ); // the origin
     */
  }
  else if (event.which == 39) {
    // Right
    //console.log("Right");
    camera.rotation.y -= rotation;
    //rotation += 0.05;
    //pos.x += Math.sin(rotation) * 1 - 1;
    //pos.z += Math.cos(rotation) * 1 - 1;
    // camera.lookAt( { x: camera.position.x + 0, y: camera.position.y - 10 , z:camera.position.z } ); // the origin
  }
  else if (event.which == 88)
  { // X
    // Look straight ahead
    camera.lookAt({x: camera.position.x + 0, y: camera.position.y - 10, z: camera.position.z});
  }

  else if (event.which == 90)
  { // Z
    // Look down
    camera.lookAt({x: camera.position.x + 10, y: camera.position.y - 0, z: camera.position.z});
  }

  console.log(event.which);
  console.log(camera.position);
  //alert('Handler for .keydown() called.');
});
                        