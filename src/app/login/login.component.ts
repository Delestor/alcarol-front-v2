import { Component } from '@angular/core';
import { users } from '../users';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConditionalExpr } from '@angular/compiler';



@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;

  users = users;
  checkoutForm;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.canvas = document.querySelector('canvas');
    this.gl = this.canvas.getContext('webgl');

    if (!this.gl) {
      alert('WebGL not supported!');
    }

    const vertexData = [
      //X, Y, Z
      0, 1, 0, //Vertex 1 position
      1, -1, 0,   //Vertex 2 position
      -1, -1, 0,  //Vertex 3 position
    ];

    var colorData = [
      //R, G, B
      1, 0, 0,    //Vertex 1 color
      0, 1, 0,    //Vertex 2 color
      0, 0, 1,    //Vertex 3 color
    ];

    //init position Buffer
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexData), this.gl.STATIC_DRAW);

    //init color Buffer
    var colorBuffer = this.gl.createBuffer();
    function setColorData(colorData, gl) {
      colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
    }

    setColorData(colorData, this.gl);

    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

void main() {
    vColor = color;
    gl_Position = vec4(position, 1);
}
`);
    this.gl.compileShader(vertexShader);

    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main(){
    gl_FragColor = vec4(vColor, 1);
}
`);
    this.gl.compileShader(fragmentShader);

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    //Attributes:

    const positionLocation = this.gl.getAttribLocation(program, `position`);
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);

    const colorLocation = this.gl.getAttribLocation(program, `color`);

    function changeColorTo(colorArray, gl) {

      setColorData(colorArray, gl);

      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

      gl.useProgram(program);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    changeColorTo(colorData, this.gl);

    window.addEventListener("keypress", keyPressEvent);

    function keyPressEvent(event) {
      colorData =
        [Math.random(), Math.random(), Math.random(),
        Math.random(), Math.random(), Math.random(),
        Math.random(), Math.random(), Math.random(),];
      console.log('apretado!');
      var canvas = document.querySelector('canvas');
      var gl = canvas.getContext('webgl');
      changeColorTo(colorData, gl);
    }

    function generateRandomColorArray(): any {
      return [Math.random(), Math.random(), Math.random()];
    }

  }

  constructor(private formBuilder: FormBuilder,
    private router: Router) {
    this.checkoutForm = this.formBuilder.group({
      username: '',
      password: ''
    });
    console.log('inside submit');
  }

  onSubmit(user) {
    let validUser = false;
    users.forEach(element => {
      if (element.username == user.username
        && element.password == user.password) {
        alert('log in');
        validUser = true;
      }
    });

    if (!validUser) {
      alert('invalid username/password');
    } else {
      this.router.navigate(['main']);
    }
  }
}
