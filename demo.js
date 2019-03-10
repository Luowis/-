var ground;
// 超越出现位置坐标
var coordinate = [{x: 130, y:173}, {x: 320, y:171}, {x: 515, y:175}, {x: 105, y: 265}, {x: 320, y: 256}, {x: 522, y: 256}, {x: 96, y: 350}, {x: 320, y: 355}, {x: 540, y: 358}];//洞口坐标
// 超越出现定时器
var gametimer;
var mask = [];
var mouse = new Array(9);
// 最大超越数
var maxCount = 2;
// 分数  点中一个加10
var score = 0;
// 生命 自由下落一个减一
var life = 10;
window.onload = function(){
    ground = document.getElementsByClassName('ground')[0];
    ground.onmousedown = function(){
        ground.style.cursor = 'url("./images/hand2.png"), auto'
    };
    ground.onmouseup = function(){
        ground.style.cursor = 'url("./images/hand.png"), auto'
    };
    init();
}

function init(){
    // 创建超越出现位置
    createMask();
    // 每隔一段时间出现一个超越
    gameTimer = setInterval(function(){
        // 创建每一个超越
        // createMouse();
        controlMouse();
        // 每次生成后判断是否结束
        if(life <= 0){
            clearInterval(gameTimer);
            alert('游戏结束：得分：' + score);
        }
        document.getElementsByClassName('scoreCon')[0].innerHTML = score;
        document.getElementsByClassName('life')[0].innerHTML = life;
        // 最大数++
        maxCount = score / 100 + 1;
    },50);
}

function createMask(){
    // 根据坐标生成洞穴位置
    for(var i = 0; i < coordinate.length;i ++){
        // 创建div  将来插入超越
        var temp = document.createElement('div');
        temp.classList.add('mask');
        // 确定每一个超越巢穴位置
        temp.style.left = coordinate[i].x + 'px';
        temp.style.top = coordinate[i].y + 'px';
        
        // 创建草坪遮盖
        var img = document.createElement('div');
        img.classList.add('mask');
        // 设置遮罩层背景  每一个洞穴背景不一样
        img.style.background = 'url("./images/mask'+i+'.png")';
        // 控制层级  草坪在超越身上
        img.style.zIndex = 100;
        img.style.zIndex = i * 2 +1;

        // 将元素放置在数组中
        mask[i] = temp;
        temp.appendChild(img);
        // 将创建div插入父级
        ground.appendChild(temp);
        // 记录点击的位置
        temp.index = i;
        // 点击每一个消失
        
        temp.onclick = function(){
     
        var i = this.index;
        disappear(i,true);
          
        }
  
    }
}

// 创建超越



function createMouse(i){
    // 随机的背景图片
    var mouseNum = Math.floor(Math.random() * 8);
    mouse[i] = mouseNum;

    var tempMouse = document.createElement('div');
    tempMouse.classList.add('mouse');
    // 设置超越出现的背景图片
    tempMouse.style.background = 'url("./images/mouse'+mouseNum+'.png")';
    tempMouse.classList.add('mouse' + mouseNum);

    // console.log(tempMouse.style.background)
    // 每一个超越需要出现在指定的位置  在对应洞穴上出现一个超越
    // 用两个数组对应  一个存放着洞穴  一个存放超越
    mouse[i] = tempMouse;
    tempMouse.style.zIndex = i * 2 ;
    tempMouse.style.animation = "moveTop 0.5s linear";

    mask[i].appendChild(tempMouse);
    var timer = setTimeout(function(){
        disappear(i,false);
    },2000);
    tempMouse.timer = timer;
}


// 控制出现超越的条件
function controlMouse(){
    // 随机出现位置  并且同时出现的超越个数不大于最大个数  同一个位置不能出现两个
    var num = Math.floor(Math.random()*9);
    // console.log(num)
    if(mouse.filter(function (item){
        return item;
        // 限制出现的最大数和出现的位置
    }).length < maxCount && mouse[num] == null){
    createMouse(num);

   }

}

// 消失函数
function disappear(i,isHit){
    if(mouse[i]){
        // 无论是否被抓均缩回洞里  通过改变top值
        mouse[i].style.top = '70px';
        // 被抓 改变样式 添加爱心 改变背景图片
        if(isHit){
            // 抓中分数加十
            
            score += 10;
            // 创建包含懵爱心的元素
            var bomp = document.createElement('img');
            bomp.classList.add('mouse');
            bomp.style.top = '-40px';
            // 添加gif动图为背景显示
            bomp.src = "./images/bomb.gif";
            // 替换掉当前超越的图片
            // mouse[i].style.backgorund = 'url("./images/hit'+mouse[i].num +'")';
            // 插入到当前点击的位置
            mouse[i].appendChild(bomp);
            // 清除自身的下落
            clearTimeout(mouse[i].timer);
        }else{
            // 没有被抓  自己缩回生命减一
            life -= 1;
        }
        setTimeout(function(){
            if(mouse[i]){
                mask[i].removeChild(mouse[i]);
            }
            mouse[i] = null;
        },500);
    }
}