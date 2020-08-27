const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    //tells matter js where we want to show our drawing inside the dom.
    element: document.body,
    engine: engine,
    //width and height of the canvas element.
    options: {
        width: 800, //width and height of the canvas element.
        height: 600
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);
                             // x,  y  , height and width of the shape
const shape = Bodies.rectangle(200, 200, 50, 50, {
   // true means that we dont want move our shape at any circumstances
    isStatic: true
});
//just making a shape doesn't make it show on the screen.
//to show as many shape as we want, we have to add them in the world object.
World.add(world, shape);