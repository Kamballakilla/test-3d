uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uHeight;


attribute vec3 position;
attribute float aRandom;

varying float vRandom;


void main() 
{
   






    
    vec4 modelPosition = modelMatrix * vec4(position,1);

    modelPosition.y += aRandom * uHeight;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vRandom = aRandom;


}