//Create variables here
var dog,sadDog,happyDog,database,foodS,foodStock;
var fedTime,lastFed;
var foodObj;
var feed,addfood,gamestate,readState,currenttime;
var bedroom,dead,dogvaccine,livingroom,lazy,running,runleft,washroom,vaccination,garden,injection;
function preload()
{
  //load images here
  happyDog=loadImage("Happy.png");
  sadDog=loadImage("Dog.png");
  bedroom=loadImage("bedroom.png")
  dead=loadImage("deadDog.png")
  dogvaccine=loadImage("dogVaccination.png")
  livingroom=loadImage("Living Room.png")
  lazy=loadImage("Lazy.png")
  running=loadImage("running.png")
  runleft=loadImage("runningLeft.png")
  washroom=loadImage("Wash Room.png")
  vaccination=loadImage("Vaccination.jpg")
  garden=loadImage("Garden.png")
  injection=loadImage("Injection.png")
}

function setup() {
 database=firebase.database();
  createCanvas(1000, 400);
  dog=createSprite(800,200,150,150)
  dog.scale=0.3;
  dog.addAnimation("img1",sadDog)
  dog.addAnimation("img",happyDog)
  
  foodStock=database.ref('Food')
  foodStock.on("value",readStock)
  foodObj=new food();

  addfood=createButton("add food")
  addfood.position(800,95)
  addfood.mousePressed(addFood)
  
  feed=createButton("feed the dog")
  feed.position(700,95);
  feed.mousePressed(feedDog)
readState=database.ref('gameState')
 readState.on("value",function(data){
gamestate=data.val();
 })
}


function draw() {  
  background(46, 139, 87);
  textSize(15)
  fill("red")
    foodObj.display();
    
   fedTime=database.ref('feedTime')
   fedTime.on("value",function(data){
  lastFed=data.val();
   });
    if(lastFed>12){

text("last feed:"+lastFed%12+" pm",350,30 )

    }else if(lastFed==0){

text("last feed: 12AM",350,30)


    }else {

text("last feed: "+ lastFed+" AM",350,30)

       
    }
    if(gamestate!="hungry"){

      feed.hide()
      addfood.hide()
dog.visible=false;
    }else{
feed.show();
addfood.show();
dog.changeAnimation("img1",sadDog);
dog.visible=true;
    }
currenttime=hour();
if(currenttime==(lastFed+1)){

  update("playing")
  foodObj.garden();
}else if(currenttime==(lastFed+2)){

  update("sleeping")
  foodObj.bedroom();
}else if(currenttime>(lastFed+2)&&currenttime<(lastFed+4)){
  update("washroom")
  foodObj.washroom();

}else{

  update("hungry")
  foodObj.display();
}

    
  drawSprites();
  //add styles here
 
}

function readStock(data){

foodS=data.val();
foodObj.updateFoodStock(foodS);

}
function feedDog(){
  dog.changeAnimation("img",happyDog)
foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref("/").update({
  Food:foodObj.getFoodStock(),
  feedTime:hour()
})
}
/*function writeStock(x){
if(x<=0){
x=0


}else{

x=x-1;

}
database.ref('/').update({

food:x

});

}*/
function addFood(){
foodS++;

database.ref("/").update({
Food:foodS


})
}
function update(state){

database.ref('/').update({

  gameState:state
});


}
