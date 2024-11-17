# robot-q29-steer

Physically steers a Logitech G29 Steering wheel after subscribing to live robot odometry.

## Prerequisites
1. Node
2. NPM
3. [ROS Bridge Server](https://wiki.ros.org/rosbridge_suite/Tutorials/RunningRosbridge)
4. Logitech G29 Steering Wheel

## Setup and run
0. Install prerequisites
1. Clone the repo
    ```bash
    git clone git@github.com:codegallivant/robot-g29-steer.git
    cd robot-g29-steer
    ```
2. Install packages
   ```bash
    npm install logitech-g29
    npm install websocket
    ```
3. Run your odometry publisher.
4. Run the ROS bridge  
  ```bash
  # if on ROS 1
  roslaunch rosbridge_server rosbridge_websocket.launch
  ```
  ```bash
  # if on ROS 2
  ros2 launch rosbridge_server rosbridge_websocket_launch.xml
  ```
5. Connect the logitech 29 Steering Wheel via USB
6. Run
  ```bash
  node index.js
  ```
