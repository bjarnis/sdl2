class Config {
    static GAME_WIDTH = 1024;
    static GAME_HEIGHT = 768;
    static MARGIN = 20;
    static BOX = {x: Config.MARGIN, y: Config.MARGIN, w: Config.GAME_WIDTH-Config.MARGIN*2, h: Config.GAME_HEIGHT-Config.MARGIN*2};
    static GAME_BALLS_COUNT = 10000;
}

class Vec2{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    move(direction, amount){
        this.x += direction.x * amount;
        this.y += direction.y * amount;
    }

    length(){
        return this.x === 0 && this.y === 0 ? 0 : Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalized(vector2){
        const dirX = vector2.x - this.x;
        const dirY = vector2.y - this.y;

        const len = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));
        return new Vec2(dirX / len, dirY / len);
    }

    static Random(){
        return new Vec2(Vec2.Rnd(0,Config.GAME_WIDTH), Vec2.Rnd(0, Config.GAME_HEIGHT));
    }

    static Rnd(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

class Obj{
    constructor(startPos, speed, width, color, target, test){
        this.pos = startPos;
        this.speed = speed;
        this.width = width;
        this.color = color;
        this.move_to(target);
        this.test = test;
    }
    move(delta_time){
        if (this.pos.x >= (Config.BOX.w+Config.BOX.x)){
            this.pos.x = (Config.BOX.w+Config.BOX.x);
            this.dir.x *= -1;
        }
        else if (this.pos.x <= Config.BOX.x){
            this.pos.x = Config.BOX.x;
            this.dir.x *= -1;
        }

        if (this.pos.y >= (Config.BOX.h+Config.BOX.y)){
            this.pos.y = (Config.BOX.h+Config.BOX.y);
            this.dir.y *= -1;
        }
        else if (this.pos.y <= Config.BOX.y){
            this.pos.y = Config.BOX.y;
            this.dir.y *= -1;
        }
        this.pos.move(this.dir, this.speed * delta_time);
    }
    draw(context){
        context.strokeStyle = this.color;
        //context.fillRect(this.pos.x, this.pos.y, this.width, this.width);
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.width/2, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        
        context.fillStyle = this.color;
        context.fill();
    }
    move_to(target){
        this.dir = this.pos.normalized(target);
    }
}

class Game{
    constructor(canvas, context){
        this.cnt = 0;
        this.canvas = canvas;
        this.ctx = context;
        this.game_is_running = false;
        this.fps = 0;
        this.fps_samples_size = 60;
        this.fps_samples = [];
        this.fps_samples_idx = 0;
        this.delta_time = 0;
        this.last_time = performance.now();
        this.bx=0;
        this.by=0;
        this.balls = [];
        this.rect = canvas.getBoundingClientRect();
            //new Obj(new Vec2(1,1), 100, 4, 'rgb(255 255 255)', new Vec2(GAME_WIDTH/2, GAME_HEIGHT), 100),
            //new Obj(new Vec2(1,1), 125, 4, 'rgb(255 255 255)', new Vec2(GAME_WIDTH/4, GAME_HEIGHT), 150),
            //new Obj(new Vec2(1,1), 150, 4, 'rgb(255 255 255)', new Vec2(GAME_WIDTH, GAME_HEIGHT/2), 200)];
        for(let i=0; i<Config.GAME_BALLS_COUNT; i++)
            this.balls.push(new Obj(new Vec2(Config.GAME_WIDTH/2, Config.GAME_HEIGHT/2), Vec2.Rnd(100,300), 4, 'rgb(255 255 255)', Vec2.Random(), 100));
    }

    rect(){
        return this.rect();
    }

    start(){
        this.game_is_running = true;
        requestAnimationFrame(()=>this.game_loop());
        this.mouse_click = this.mouse_click.bind(this);
        this.canvas.addEventListener('mousedown', this.mouse_click);
    }

    mouse_click(event){
        console.log(event.layerX, ', ', event.layerY);
        console.log(this);
        this.balls.forEach(ball => {
            ball.move_to(new Vec2(event.offsetX, event.offsetY));
        });
    }

    process_input(){

    }
    update(){
        this.balls.forEach(ball => ball.move(this.delta_time) );
        //this.bx += 40 * this.delta_time;
        //this.by += 40 * this.delta_time;
    }
    render(){
        this.ctx.fillStyle = 'rgb(18 18 18)';
        this.ctx.fillRect(0,0, Config.GAME_WIDTH, Config.GAME_HEIGHT);
        this.balls.forEach(ball => ball.draw(this.ctx) );
        
        this.ctx.fillStyle = 'rgb(255 0 0)';
        //this.ctx.fillRect(this.bx, this.by, 4, 4);
        this.ctx.font = "14px serif";
        this.ctx.fillText("FPS "+ Math.round(this.fps), 10, 14);
        this.ctx.fillText("balls "+ this.balls.length, 10, 28);
        
    }

    game_loop(){
        const nowTime = performance.now();
        this.delta_time = (nowTime - this.last_time)/1000.0;
        this.last_time = nowTime;
        
        this.fps_samples[this.fps_samples_idx] = 1 / this.delta_time;
        this.fps = 0;
        for(let i=0; i<this.fps_samples.length; i++)
            this.fps += this.fps_samples[i];
        this.fps = Math.round(this.fps / this.fps_samples_size);
        this.fps_samples_idx++;
        if (this.fps_samples_idx > this.fps_samples_size)
        this.fps_samples_idx = 0;

        this.process_input();
        this.update();
        this.render();
        var s = requestAnimationFrame(()=>this.game_loop());
        this.cnt++;

        this.balls.forEach(ball => {
            if (ball.test < this.cnt){
                //ball.move_to(new Vec2(0, GAME_HEIGHT/2));
                ball.test += ball.test;
            }
        });
    }
}

export {Game, Config};