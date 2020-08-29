var SoundOn = false;    //打ち上げ音声切り替え.

function windowResized() {
    resizeCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
    this.preStar();
}

function setup() {
    // キャンバスの設定
    canvas = createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
    canvas.position(0, 0);
    canvas.style("z-index", "-1");
    colorMode(RGB);
    frameRate(60);
    this.preStar();
}

function draw() {
    // 背景色を設定
    setGradient(0, 0, width, height, color(0, 0, 0), color(24, 32, 72), Y_AXIS);
    noStroke();

    // 星を描く
    this.drawStar();

    if(SoundOn == true){
        // 花火を打ち上げる間隔を調整
        if (0 === frameCount % 250) {
            // 打ち上がるスピード
            let speed = random(10, 10);
            fireworks.push(new FireWork(random(width), height, 0, speed, 0.30, 0));
        }
    }else{
        if (0 === frameCount % 100) {
            // 打ち上がるスピード
            let speed = random(10, 10);
            fireworks.push(new FireWork(random(width), height, 0, speed, 0.30, -1));
        }
    }



    for (let fw of fireworks) {
        // 打ち切った花火を処理対象から外す（配列から削除する）
        if (2 === fw.getType || 50000 < fw.getFrame) {
            fireworks = fireworks.filter((n) => n !== fw);
            continue;
        }
        fw.fire();  // 打ち上げアニメーションを呼び出す
    }
}

// 背景の夜空 グラデーションを描画
function setGradient(x, y, w, h, c1, c2, axis) {
    noFill();

    if (axis === Y_AXIS) {
        // Top to bottom gradient
        for (let i = y; i <= y + h; i++) {
            let inter = map(i, y, y + h, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            line(x, i, x + w, i);
        }
    } else if (axis === X_AXIS) {
        // Left to right gradient
        for (let i = x; i <= x + w; i++) {
            let inter = map(i, x, x + w, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            line(i, y, i, y + h);
        }
    }
}

  // 星を作成
function preStar() {
    star = [];
    for (let i = 0; i < 100; i++) {
        star.push([random(width), random(height / 2), random(1, 4)]);
    }
}

// 星を描画
function drawStar() {
    // 星を描く
    for (let s of star) {
        let c = color(random(150, 255), random(150, 255), 255);
        c.setAlpha(random(150, 200));
        fill(c);
        ellipse(s[0], s[1], s[2], s[2]);
    }
}