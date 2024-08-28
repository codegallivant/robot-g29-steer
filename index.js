const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9090');
var g = require('logitech-g29');

g.connect(function(err) {
    g.forceFriction(0);
    console.log("Connected");
});

ws.on('uncaughtException', function (err) {
    console.log(err);
}); 

function calculateYaw(pose) {
    return Math.atan2(2.0*(pose.orientation.w*pose.orientation.z+pose.orientation.x*pose.orientation.y), 1.0 - 2.0*(pose.orientation.y**2 + pose.orientation.z**2))
}

function calculateAngleBetweenPoses(pose1, pose2) {
    const yaw1 = calculateYaw(pose1);
    const yaw2 = calculateYaw(pose2);
    let angleDiff = yaw2-yaw1;
    angleDiff = (angleDiff + Math.PI) % (2*Math.PI) - Math.PI;
    return angleDiff;
}

function calculateForceConstant(angleDiff, k) {
    return (angleDiff / (2*k))+(1/2)
}


// g.on('wheel-turn', function (value) {
//     logitech_control.wheel_value = value;
// });

ws.on('open', function open() {
    const subscribeMsg = {
        op: 'subscribe',
        topic: 'odom',
        type: 'nav_msgs/Odometry'
    };
    ws.send(JSON.stringify(subscribeMsg));
});

var previousPose;
var currentPose = null;
var tempCurrentPose;
var angleDiff;
var i = 0;
ws.on('message', function incoming(data) {
    console.log("Incoming message");
    const msg = JSON.parse(data);
    // console.log(msg);

    if ( msg.topic === 'odom') {
        
        // var orientation = msg.msg.pose.pose.orientation;
        // console.log("Odom orientation: ");
        if(i%1 == 0) {
            if (currentPose != null) {
                previousPose = currentPose;
                tempCurrentPose = msg.msg.pose.pose;
                angleDiff = calculateAngleBetweenPoses(tempCurrentPose, previousPose);
                console.log("Angle difference (radians): "+ angleDiff);
                if(Math.abs(angleDiff)>0.3) {
                    currentPose = msg.msg.pose.pose;
                    forceConstant = calculateForceConstant(angleDiff, Math.PI/100);
                    console.log("Force constant: "+forceConstant);
                    g.forceConstant(forceConstant);
                }

            } else {
                currentPose = msg.msg.pose.pose;
            }
        }
        i += 1
    }
});