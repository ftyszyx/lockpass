var robot = require("./index");

//test mouse
// robot.dragMouse(200, 100);
// robot.moveMouse(337, 645);
// robot.mouseClick("left", true);
// console.log(robot.getMousePos());

//test keyboard
robot.typeString("Hello World");
robot.keyTap("enter");
