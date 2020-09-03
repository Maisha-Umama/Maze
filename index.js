const { Engine,Render,Runner,World,Bodies } = Matter;
   
const cells = 3;
const width = 600;
const height = 600;
const unitLength= width /cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    //tells matter js where we want to show our drawing inside the dom.
    element: document.body,
    engine: engine,
    //width and height of the canvas element.
    options: {
        wireframes: true, 
        width,
        height 
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//walls
const walls = [
    Bodies.rectangle(width/2, 0, width, 40, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 40, {isStatic: true}),
    Bodies.rectangle(0, height/2, 40, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 40, height , {isStatic: true}) 
];
World.add(world, walls);
 
//maze generation

const shuffle = (arr) =>{
  let counter = arr.length;

  while (counter>0){
      const index = Math.floor(Math.random()* counter);

      counter --;

      const temp = arr[counter];
      arr[counter] = arr[index];
      arr[index] =temp;
  }

  return arr;
};

const grid =Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false));
   
const verticals=Array(cells)
    .fill(null)
    .map(() => Array(cells-1).fill(false)); 

const horizontals = Array(cells-1)
    .fill(null)
    .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);    

const stepThroughCell = (row, column) => {
 //if i have visited the cell at [row,column], then return
 if(grid[row][column]){
     return;
 }

 //mark this cell as being visited
 grid[row][column] = true;

 //assemble randomy-ordered list of neighbors
 const neighbors = shuffle([
  [row-1,column, 'up'],
  [row,column+1, 'right'],
  [row+1,column,'down'],
  [row,column-1,'left']

 ]);
 //for each neighbor  ...
 for (let neighbor of neighbors){
     const [nextRow,nextcolumn,direction] = neighbor;

 //see if that neighbor is out of bounds
 if(nextRow < 0 || nextRow >=cells || nextcolumn< 0 || nextcolumn >= cells ){
     continue;
 }
 
 //if we have visited that neighbor, continue to next neighbor
 if(grid[nextRow][nextcolumn]){
     continue;
 }

  //remove a wall from either horizentals and verticals 
   if(direction === 'left'){
       verticals[row][column-1]= true;
   }else if(direction === 'right'){
       verticals[row][column] = true;
   }else if (direction === 'up'){
       horizontals[row-1][column]= true;
   }else if (direction === 'down'){
       horizontals[row][column] = true;
   }
  stepThroughCell(nextRow, nextcolumn);
 }

  };

  stepThroughCell(startRow, startColumn);

  horizontals.forEach((row,rowIndex)=> {
      row.forEach ((open,columnIndex) => {
          if(open){
              return;
          }

          const wall =Bodies.rectangle(
              columnIndex * unitLength + unitLength / 2,
              rowIndex  * unitLength + unitLength,
            unitLength,
            10,{
                isStatic:true
            }
          );
          World.add(world, wall);
      });
  });

  verticals.forEach((row,rowIndex)=>{
      row.forEach((open,columnIndex)=>{
        if(open){
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength /2 ,
            10,
            unitLength,
            {
                isStatic:true
            }
        );
        World.add (world,wall);
      });
  });