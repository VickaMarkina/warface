player = document.querySelector("#player");

lifes = 3;
point = 0;

let points = document.querySelector("#points");
points.innerHTML= `POINTS: ${point}`;

document.addEventListener('keydown', function(event) {
  switch(event.key){
    case 'ArrowUp':
      player.style.top = player.offsetTop - 60 + 'px';
      break;
    case 'ArrowDown': 
      player.style.top = player.offsetTop + 60 + 'px';
      break;
    case ' ':
      createBull();
      break;
  }  
});

windowOuterWidth();

function windowOuterWidth() {
  const windowOuterWidth = window.outerWidth
  if(windowOuterWidth <= 780){
    let menu = document.querySelector(".menu");
    let lifes = document.querySelector(".lifes");

    lifes.remove();
    menu.remove();
    player.remove();
    points.remove();

    let alertM = document.createElement("div");
    alertM.className = "alert";
    document.body.appendChild(alertM);

    alertM.innerHTML = "минимальная ширина экрана 780px";

  }
}

function createBull() {
  let bullet = document.createElement("div");
  bullet.className = "bullet";

  if(player.classList.contains("skin_2")){
    bullet.style.top = player.offsetTop + 90 + 'px';
   } else {
     bullet.style.top = player.offsetTop + 118 + 'px';
   }

  document.body.appendChild(bullet);

  bulletMove(bullet)
};

function start() {
  createEnemy();
  let start = document.querySelector(".menu")
  start.remove();

  
  setInterval(function() {
    randomCreateEnemy(2000, 8000)
    
  }, 9000)
  if(!player.classList.contains("skin_1") && !player.classList.contains("skin_2")){
    player.classList.add("skin_1")
  };

};

function chooseSkinOne() {
  player.classList.remove("skin_2");
  player.classList.add("skin_1");
}

function chooseSkinTwo() {
  player.classList.remove("skin_1");
  player.classList.add("skin_2");

}

function bulletMove(bullet) {
  let timerId = setInterval(function() {
    bullet.style.left = bullet.offsetLeft + 500 + 'px';

    isShot(bullet, timerId);
    if(bullet.offsetLeft > document.body.clientWidth){
      bullet.remove();
      clearInterval(timerId);
    }
  }, 10)
};

// function isShot(bullet, timer) {
//   let topB = bullet.offsetTop;
//   let leftB = bullet.offsetLeft;

//   let enemy = document.querySelector(".enemy");
//   if(enemy != null) {
//       let topE = enemy.offsetTop;
//       let bottomE = enemy.offsetTop + enemy.offsetHeight;
//       let leftE = enemy.offsetLeft;
      
//       if(topB >= topE && topB <= bottomE && leftB >= leftE) {
//         enemy.className = 'boom';
//         enemy.style.top = topE + 'px';
//         enemy.style.left = leftE + 'px';
//         point = point + 5;
//         points.innerHTML= `POINTS: ${point}`

  
//         clearInterval(enemy.dataset.timer);
//         setTimeout(function() {
//           enemy.remove();
//           createEnemy();
//           bullet.remove();
//           clearInterval(timer);
//         }, 500)
//       }
//   };
// };

function isShot(bullet, timer) {
  let topB = bullet.offsetTop;
  let leftB = bullet.offsetLeft;

  let enemies = document.querySelectorAll(".enemy")

  for (let i = 0; i < enemies.length; i++){
    let enemy = enemies[i];

    let topE = enemy.offsetTop;
      let bottomE = enemy.offsetTop + enemy.offsetHeight;
      let leftE = enemy.offsetLeft;
      
      if(topB >= topE && topB <= bottomE && leftB >= leftE) {
        enemy.className = 'boom';
        enemy.style.top = topE + 'px';
        enemy.style.left = leftE + 'px';
        point = point + 5;
        points.innerHTML= `POINTS: ${point}`

  
        clearInterval(enemy.dataset.timer);
        setTimeout(function() {
          enemy.remove();
          createEnemy();
          bullet.remove();
          clearInterval(timer);
        }, 50)
      }
  }
};

function isDie() {
  let enemy = document.querySelector(".enemy");

  if(enemy.offsetTop > player.offsetTop  &&
     enemy.offsetTop < player.offsetTop + player.offsetHeight &&
     enemy.offsetLeft <= player.offsetLeft + player.offsetWidth - 40) {
      enemy.className = 'boom';
      enemy.style.top = player.offsetTop + 'px'
      enemy.style.left = (player.offsetLeft + 100) + 'px'

      clearInterval(enemy.dataset.timer);
      setTimeout(function() {
        enemy.remove();
        createEnemy();
      }, 1000)

       die();
     }
};

function createEnemy() {
  let enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.style.top = random(50, document.body.offsetHeight - 135) + 'px';
  document.body.appendChild(enemy);
  let rand = 800 + Math.random() * (3000 + 1 - 800);
  let randomE =  Math.floor(rand); 

  let timerId = setInterval(function() {

    enemy.style.left = (enemy.offsetLeft - randomE) + "px";   
    if(enemy.offsetLeft + enemy.offsetWidth < 0) {
      enemy.remove();
      clearInterval(timerId);
      createEnemy();

      die();
    } 

    isDie();
  }, 10);
  enemy.dataset.timer = timerId;
  
};

function randomCreateEnemy(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  let timeRandom =  Math.floor(rand); 

  setTimeout(function() {
    createEnemy();
  }, timeRandom)
};

function die() {
  lifes--;
  if(lifes != 0) {
    let lifesBlock = document.querySelector("#lifes");
    let life = lifesBlock.querySelector("span");
    life.remove();
  } else {
    endGame();
  }
};

function endGame() {
  document.body.innerHTML = "";
  alert("Game over");
  location.reload();
};

function random(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand); 
};