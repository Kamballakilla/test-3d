precision mediump float;

varying float vRandom;


void main() {

    gl_FragColor = vec4(0.8, vRandom/20.0 , 1.0, 1.0);
}