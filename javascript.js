//Variables

var startButton=document.getElementsByClassName("startbutton")[0];
var quitButton=document.getElementsByClassName("quitbutton")[0];
var iniSquare1=document.getElementById("sq44");
var iniSquare2=document.getElementById("sq45");
var buttontop=document.getElementsByClassName("buttontop")[0];
var buttonbottom=document.getElementsByClassName("buttonbottom")[0];
var buttonright=document.getElementsByClassName("buttonright")[0];
var buttonleft=document.getElementsByClassName("buttonleft")[0];
var serpent=[];
var square=document.getElementsByClassName("square");
var mov='a';
var previous_mov='';
var foodPoint=[{x:0,y:0}];
var points=document.getElementById("points");
var totalPoints=1;
var idleTime=0;
var idleInterval;
var cont;
var limitCont=10000; //10k intentos intentado encontrar hueco libre para el punto rojo -> You win!



//Programa
startButton.addEventListener("click",startGame);
quitButton.addEventListener("click",quit);
alert("Welcome to the Snake Game! Use the arrow keys to move the snake, you can go through the walls and change the direction but not the orientation. Eat as many apples as you can and enjoy!");


//Declaraciones

function initializeGame(){
	serpent=[{x:4,y:5},{x:4,y:4}];
	iniSquare1.style.background="black";
	iniSquare2.style.background="black";
	return false;
}

function positionToSquare(x,y){ //con las coordenadas x,y del objeto, devuelve la clase correspondiente
	return document.getElementById("sq"+x+y);
}

function changeColorToBlack(x,y){  // cambia el color del cuadrado a negro (serpiente)
	positionToSquare(x,y).style.background="black";
	positionToSquare(x,y).style.borderRadius="0px";
}

function changeColorToRed(x,y){ // cambia el color del cuadrado a rojo (comida) y lo hace círculo
	positionToSquare(x,y).style.background="red";
	positionToSquare(x,y).style.borderRadius="20px";
}

function changeColorToWhite(x,y){ // cambia el color del cuadrado a blanco cuando se mueve
	positionToSquare(x,y).style.background="white";
	positionToSquare(x,y).style.borderRadius="0px";
}

function changeColorToGreen(x,y){ // cambia el color del cuadrado a blanco cuando se mueve
	positionToSquare(x,y).style.background="green";
	positionToSquare(x,y).style.borderRadius="0px";
}


function representSerpent()  // representa cada objeto posición, la serpiente completa
{
	var index=0;

	for (var i=0;i<square.length;i++){ //Todo blanco
		square[i].style.background="white";
		square[i].style.borderRadius="0px";
	}

	changeColorToRed(foodPoint[0].x,foodPoint[0].y); //Punto

	if (serpent.length>0){  //Serpiente
		serpent.forEach(function(index){
			changeColorToBlack(index.x,index.y);
		})

		changeColorToGreen(serpent[0].x,serpent[0].y)
	}
}

function checkArray(newx,newy){  //comprueba que el cuadrado está libre
	for (var i=0;i<serpent.length;i++){
		if (serpent[i].x===newx && serpent[i].y===newy){
			return false;
		}
	}
	return true;
}

function addPoints(){
	totalPoints=totalPoints+3;
	points.innerHTML=totalPoints;
}

function randomPoint(){  // calcula un punto random (comida) que no sea ocupado por la serpiente
	var xred= Math.floor(Math.random() *10);  //random entre 0 y 9
	var yred=Math.floor(Math.random() *10);
	cont=0; //por si acaso se tira en bucle infinito
	while(!checkArray(xred,yred) && cont<limitCont){
		xred= Math.floor(Math.random() *10);
		yred=Math.floor(Math.random() *10);
		cont++;
	}

	if(cont<limitCont){
		changeColorToRed(xred,yred); //lo dibuja
		foodPoint[0].x=xred;
		foodPoint[0].y=yred;
	}
}

function eat(){ //devuelve true si coincide cabeza de serpiente con comida
	if (serpent[0].x===foodPoint[0].x && serpent[0].y===foodPoint[0].y){
		//changeColorToBlack(foodPoint[0].x,foodPoint[0].y);
		addPoints();
		return true;
	}
	else{
		return false;
	}
}

function move(){

	iddleTime=0;

	if (event.keyCode===39){
		mov='r';
	}
	else if (event.keyCode===37){
		mov='l';
	}
	else if (event.keyCode===38){
		mov='t';
	}
	else if (event.keyCode===40){
		mov='b';
	}

	moveSerpent();
}

function movebuttonleft(){
	mov='l';
	moveSerpent();
}

function movebuttonright(){
	mov='r';
	moveSerpent();
}

function movebuttontop(){
	mov='t';
	moveSerpent();
}

function movebuttonbottom(){
	mov='b';
	moveSerpent();
}

function moveRight(){
	if(mov==='r'){
		return true;
	}
	else{
		return false;
	}
}

function moveLeft(){
	if(mov==='l'){
		return true;
	}
	else{
		return false;
	}
}

function moveTop(){
	if(mov==='t'){
		return true;
	}
	else{
		return false;
	}	
}

function moveBottom(){
	if(mov==='b'){
		return true;
	}
	else{
		return false;
	}	
}

function addTail(){ //añade cola a la serpiente
	
	var length=serpent.length;
	var newx=serpent[length-1].x;
	var newy=serpent[length-1].y;

	serpent.push({x:newx,y:newy}); //añadir nuevo elemento
}

function moveSerpent(){

	var length;
	var i=0;
	var oldx;
	var oldy;
	//En función de cada movimiento hay que cambiar la cabeza de la serpiente siendo el primer elemento o el último
	//Right: cabeza [0] si viene de mov de arriba/abajo y de la derecha; ; cabeza[length-1] cambia si viene de la izq.
	//Left: cabeza[0] si viene de mov de arriba/abajo y de la izq; cabeza[length-1] cambia si viene de la derecha.
	//Top: cabeza[0] si viene de izq/derecha y de ir para arriba; cabeza[len-1] cambia si viene de ir hacia abajo.
	//Bottom: cabeza[0] si viene de izq/derecha y de ir hacia abajo; cabeza[len-1] cambia si viene de ir hacia arriba.

	//En los casos que haya que cambiar la cabeza, hay que cambiar también el orden del resto de los obj
	// siendo por ej [1] el [len-2], el [2] el [len-3]

	length=serpent.length;

	if (moveRight()){
		if (previous_mov==="l"){ //no cambia el sentido
			//serpent.reverse();
			for (i=length-1;i>0;i--){
				serpent[i].x=serpent[i-1].x;
				serpent[i].y=serpent[i-1].y;
			}
			serpent[0].y--;
			if (serpent[0].y<0){
				serpent[0].y=9;
			}
			previous_mov='l';
		}
		else{

			//oldx=serpent[length-1].x;
			//oldy=serpent[length-1].y;

			for (i=length-1;i>0;i--){
				serpent[i].x=serpent[i-1].x;
				serpent[i].y=serpent[i-1].y;
			}

			serpent[0].y++;
			if (serpent[0].y>9){
				serpent[0].y=0;
			}

			previous_mov='r';
		}
	}
		
	else if (moveLeft()){
		if (previous_mov==="r"){
			//serpent.reverse();
			for (i=length-1;i>0;i--){
				serpent[i].x=serpent[i-1].x;
				serpent[i].y=serpent[i-1].y;
			}
			serpent[0].y++;
			if (serpent[0].y>9){
				serpent[0].y=0;
			}

			previous_mov='r';

		}
		else{

			//oldx=serpent[length-1].x;
			//oldy=serpent[length-1].y;

			for (i=length-1;i>0;i--){
				serpent[i].x=serpent[i-1].x;
				serpent[i].y=serpent[i-1].y;
			}
			serpent[0].y--;
			if (serpent[0].y<0){
				serpent[0].y=9;
			}

			previous_mov='l';
		}
		
	}
	else if (moveTop()){
		if (previous_mov==="b"){
			//serpent.reverse();
			for (i=length-1;i>0;i--){
			serpent[i].x=serpent[i-1].x;
			serpent[i].y=serpent[i-1].y;
			}
			serpent[0].x++;
			if (serpent[0].x>9){
				serpent[0].x=0;
			}

			previous_mov='b';
		}
		else{

			//oldx=serpent[length-1].x;
			//oldy=serpent[length-1].y;

			for (i=length-1;i>0;i--){
				serpent[i].x=serpent[i-1].x;
				serpent[i].y=serpent[i-1].y;
			}
			serpent[0].x--;
			if (serpent[0].x<0){
				serpent[0].x=9;
			}

			previous_mov='t';
		}
	}
		
	else if (moveBottom()){
		if (previous_mov==="t"){
			//serpent.reverse();
			for (i=length-1;i>0;i--){
				serpent[i].x=serpent[i-1].x;
				serpent[i].y=serpent[i-1].y;
			}
			serpent[0].x--;
			if (serpent[0].x<0){
				serpent[0].x=9;
			}

			previous_mov='t';
		}
			else{

			//oldx=serpent[length-1].x;
			//oldy=serpent[length-1].y;

			for (i=length-1;i>0;i--){
				serpent[i].x=serpent[i-1].x;
				serpent[i].y=serpent[i-1].y;
			}
			serpent[0].x++;
			if (serpent[0].x>9){
				serpent[0].x=0;
			}

			previous_mov='b';
		}
	}

	
		//changeColorToWhite(oldx,oldy);
	if(!checkIfyouLost() && !checkIfyouWin()){
		if(eat()){
			addTail();
			randomPoint();
		}

		representSerpent();
	}

}

function checkIfyouLost(){
	for(var i=1;i<serpent.length;i++){
		if(serpent[0].x===serpent[i].x && serpent[0].y===serpent[i].y){
			//alert("You lost :(");
			clearInterval(idleInterval);
			sadFace();
			window.removeEventListener("keydown",move);
			return true;
		}
	}
	return false;
}

function checkIfyouWin(){
	if(cont>=limitCont){
		iddleTime=-2;
		clearInterval(idleInterval);
		window.removeEventListener("keydown",move);
		happyFace();
		return true
	}
	else{
		return false
	}
}

function sadFace(){
	removeAll();
	changeColorToBlack(2,2);
	changeColorToBlack(2,3);
	changeColorToBlack(2,6);
	changeColorToBlack(2,7);

	changeColorToBlack(7,1);
	changeColorToBlack(6,2);
	changeColorToBlack(5,3);
	changeColorToBlack(5,4);
	changeColorToBlack(5,5);
	changeColorToBlack(5,6);
	changeColorToBlack(6,7);
	changeColorToBlack(7,8);
}

function happyFace(){

	removeAll();
	changeColorToBlack(2,2);
	changeColorToBlack(2,3);
	changeColorToBlack(2,6);
	changeColorToBlack(2,7);

	changeColorToBlack(5,1);
	changeColorToBlack(6,2);
	changeColorToBlack(7,3);
	changeColorToBlack(7,4);
	changeColorToBlack(7,5);
	changeColorToBlack(7,6);
	changeColorToBlack(6,7);
	changeColorToBlack(5,8);
}



//Fases
/*
1.- Se pulsa Start y comienza
2.- Se inicializa la serpiente con 2 cuadros en negro --> Botón // startgame
3.- Se inicializa el punto rojo de la comida --> randomPoint (serpent)
4.- mover serpiente
5.- Espera a que el usuario diga la direccion y comprobar a cada paso que no se come a sí misma y que no hay bolita
6.- si no cambia la direccion seguir moviendo en la misma direccion



*/

function startGame(){
	//alert("Good Luck!");
	removeAll();
	totalPoints=1;
	points.innerHTML=0;
	initializeGame();
	randomPoint();
	window.addEventListener("keydown",move);
	buttonleft.addEventListener("click",movebuttonleft);
	buttonright.addEventListener("click",movebuttonright);
	buttontop.addEventListener("click",movebuttontop);
	buttonbottom.addEventListener("click",movebuttonbottom);
	idleInterval = setInterval(interval, 500); // intervalo de 600ms si hay inactividad
}

function removeAll(){
	var i=0;
	for (var i=0;i<square.length;i++){
		square[i].style.background="white";
		square[i].style.borderRadius="0px";
	}
	serpent=[];
}

function quit(){
	removeAll();
	clearInterval(idleInterval);
	//alert("See you soon!");
	totalPoints=1;
	points.innerHTML=0;
}


function interval(){
    idleTime++;
    if (idleTime > 0)
    {
       moveSerpent();
    }
    else if(iddleTime===-2){
    	happyFace();
    }
    else
    {
    	sadFace();
    }
 }