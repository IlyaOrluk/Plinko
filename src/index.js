import {
  Engine,
  World,
  Bodies,
  Render,
  Mouse,
  MouseConstraint,
  Events,
} from "matter-js";

document.body.style.margin = 0;
document.body.style.padding = 0;

// create an engine
let engine = Engine.create(),
  world = engine.world,
  // create a renderer
  render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 650,
      background: "#000",
      hasBounds: false,
      // showAngleIndicator: true,
      // showBroadphase: true,
      // showAxes: true,
      // showCollisions: true,
      // showConvexHulls: true,
      // showVelocity: true,
      wireframes: false, // <-- important
    },
  });

world.gravity.y = 1;

const walls = [
  Bodies.rectangle(400, 650, 800, 30, { isStatic: true }),
  Bodies.rectangle(800, 333, 30, 670, { isStatic: true }),
  Bodies.rectangle(0, 333, 30, 670, { isStatic: true }),
];
World.add(world, walls);
let triangles = [];
for (let i = 1; i < 5; i++) {
  triangles = [
    ...triangles,
    Bodies.polygon(26, 114 * i, 3, 22, { isStatic: true, angle: 133 }),
  ];
}
for (let i = 1; i < 6; i++) {
  triangles = [
    ...triangles,
    Bodies.polygon(774, 110 * i - 50, 3, 22, { isStatic: true }),
  ];
}
World.add(world, triangles);
const holes = () => {
  let arr = [];
  for (let i = 0; i < 8; i++) {
    arr = [
      ...arr,
      Bodies.rectangle(100 * i + (i === 0 && 100), 610, 20, 50, {
        isStatic: true,
      }),
    ];
  }
  return arr;
};
World.add(world, holes());

const circles = () => {
  let arr = [];
  const even = (num) => {
    return num % 2 === 0;
  };
  for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 10; j++) {
      arr = [
        ...arr,
        Bodies.circle(76 * j + (even(i) ? 38 : 0), 59 * i, 11, {
          isStatic: true,
        }),
      ];
    }
  }
  return arr;
};
// Composite.remove(world, ball)

World.add(world, circles());

let seconds = 2;
Events.on(render, "afterRender", function (e) {
  const ballOptions = {
    frictionAir: 0.0009,
    restitution: 1,
    render: {
      fillStyle: `rgb(${(Math.random() * 255) | 0},${
        (Math.random() * 255) | 0
      },${(Math.random() * 255) | 0})`,
    },
  };
  if (Math.round(e.timestamp / 1000) >= seconds) {
    seconds += 1;
    World.add(
      world,
      Bodies.circle((Math.random() * 790) | 0, 0, 12, ballOptions)
    );
  }
  // console.log(e)
});
Events.on(engine, "collisionStart", function (event) {
  event.pairs[0].bodyA.render.fillStyle = event.pairs[0].bodyB.render.fillStyle;
});

// add mouse control
let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });
World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
