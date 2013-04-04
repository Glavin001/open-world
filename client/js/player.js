/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

(function(player, undefined) {
// Private variables
  player.keysDown = [];
  var rotation = 0.1;
  var s = 1;

  var W = 87, S = 83, D = 68, A = 65, UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39;

  $(document).keydown(function(event) {
    console.log("Keydown:" + event.keyCode);
    player.keysDown.push(event.keyCode);
  });

  $(document).keyup(function(event) {
    console.log("Keyup:" + event.keyCode);
    var index;
    do
    {
      index = player.keysDown.indexOf(event.keyCode)
      player.keysDown.splice(index, 1);
    } while (index !== -1);
  });

  player.updatePos = function() {
    //console.log("Updating position");
    if (player.keysDown.indexOf(W) !== -1)
      camera.position.z -= s;
    if (player.keysDown.indexOf(S) !== -1)
      camera.position.z += s;
    if (player.keysDown.indexOf(D) !== -1)
      camera.position.x += s;
    if (player.keysDown.indexOf(A) !== -1)
      camera.position.x -= s;
    if (player.keysDown.indexOf(UP) !== -1)
      camera.rotation.x += rotation;
    if (player.keysDown.indexOf(DOWN) !== -1)
      camera.rotation.x -= rotation;
    if (player.keysDown.indexOf(LEFT) !== -1)
      camera.rotation.y += rotation;
    if (player.keysDown.indexOf(RIGHT) !== -1)
      camera.rotation.y -= rotation;

    window.flashlight.target.position.set(camera.position.x - 100, 0, camera.position.z - 100);
    window.flashlight.position = {x: camera.position.x + 100, y: 500, z: camera.position.z + 100};
    /*
     var cx = (10) / 2,
     cy = (10) / 2,
     dx = 10,
     dy = 10,
     dmax = Math.max(dx, dy);
     window.flashlight.lookAt(new THREE.Vector3(cx, cy, 0));
     window.flashlight.target.position.set(cx, cy, 0);
     */
    setTimeout(player.updatePos, 2);
  };
  /*
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
   // camera.position.y += s;
   / if (camera.position.y > 960)
   // camera.position.y = 960;
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
   
   // var prevPos = camera.position;
   // rotation += 0.05;
   // camera.position.x = 0;
   // camera.position.y = Math.sin(rotation) * 1;
   // camera.position.z = Math.cos(rotation) * 1;
   // camera.lookAt( prevPos ); // the origin
   
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
   */

})(window.player = window.player || {});  