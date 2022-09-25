export const numpy = {
   array(shape: {x:number, y: number}, fill: number) {
    return Array.from({length: shape.x}, (_) => Array.from({length: shape.y}, (_) => fill) );
   },
}