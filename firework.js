
  const Y_AXIS = 1;
  const X_AXIS = 2;
  let canvas;
  let fireworks = [];
  let star = [];

class FireWork {
    // 初期設定
    constructor(x, y, vx, vy, gv, sound) {

        // フレームカウンター
        this.frame = 0;
        this.type = 0;
        this.next = 0;
        this.sound = sound;

        this.playSound(sound);

        // 花火の色
        this.r = random(155) + 80;
        this.g = random(155) + 80;
        this.b = random(155) + 80;   
        this.a = 255;

        // 初期位置
        this.x = x;
        this.y = y;

        // 玉の大きさ
        this.w = random(10, 5);

        // 打ち上がる高さ
        this.maxHeight = random(height / 6, height / 2);
        this.fireHeight = height - this.maxHeight;

        // 重力
        this.vx = vx;
        this.vy = vy;
        this.gv = gv;

        this.afterImages = [];          // 残像表示用配列
        this.explosions = [];           // 爆発用配列
        this.exDelay = random(10, 12);  // 消えてから爆発までの遅延時間
        this.large = random(5, 15);     // 爆発の大きさ
        this.ball = random(20, 100);    // 爆発の玉の数
        this.exend = random(20, 40);    // 爆発から消えるまでの長さ
        this.exStop = 0.96;             // 爆発のブレーキ
    }

    get getFrame() {
        return this.frame;
    }

    get getType() {
        return this.type;
    }

    // 処理コントロール
    fire() {
        // 0:打ち上げ（初期） 1:爆発
        switch (this.type) {
            case 0:
                this.rising();
                break;
            case 1:
                this.explosion();
                break;
        }
    }

    playSound(sound){
        if(sound==0){
            var audio = new Audio();
            audio.src = "sound/fireworkSound.mp3";
            // when the sound has been loaded, execute your code
            audio.oncanplaythrough = (event) => {
                var playedPromise = audio.play();
                if (playedPromise) {
                    playedPromise.catch((e) => {
                        console.log(e)
                        if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') { 
                            console.log(e.name);
                        }
                    }).then(() => {
                        console.log("playing sound !!!");
                    });
                }
            }
        }
    }

    // 打ち上げアニメーション
    rising() {
        //this.playSound();
        // 頂点まで達したら消す
        if (this.y * 0.8 < this.maxHeight) {
            this.a = this.a - 6;
        }

        // 指定の高さまで上昇する
        this.x += this.vx;
        this.y -= this.vy * ((this.fireHeight - (height - this.y)) / this.fireHeight);

        // 残像を表示
        this.afterImages.push(new Afterimage(this.r, this.g, this.b, this.x, this.y, this.w, this.a));
        for (let ai of this.afterImages) {
            if (ai.getAlpha <= 0) {
                this.afterImages = this.afterImages.filter((n) => n !== ai);
                continue;
            }
            ai.rsImage();
        }

        // 打ち上げ表示
        this.update(this.x, this.y, this.w);

        // 全ての表示が消えたら処理の種類を変更する
        if (0 == this.afterImages.length) {
            if (0 === this.next) {
                // 消えてから爆発まで遅延させる
                this.next = this.frame + Math.round(this.exDelay);
            } else if (this.next === this.frame) {
                // 花火の大きさ
                for (let i = 0; i < this.ball; i++) {
                    // 爆発の角度
                    let r = random(0, 360);
                    // 花火の内側を作る（バラバラ）
                    let s = random(0.1, 0.9);
                    let vx = Math.cos((r * Math.PI) / 180) * s * this.large;
                    let vy = Math.sin((r * Math.PI) / 180) * s * this.large;
                    this.explosions.push(new FireWork(this.x, this.y, vx, vy, this.exStop, 1));
            
                    // 花火の輪郭を作る（丸くなるようにする）
                    let cr = random(0, 360);
                    let cs = random(0.9, 1);
                    let cvx = Math.cos((cr * Math.PI) / 180) * cs * this.large;
                    let cvy = Math.sin((cr * Math.PI) / 180) * cs * this.large;
                    this.explosions.push(new FireWork(this.x, this.y, cvx, cvy, this.exStop, 1));
                }
                this.a = 255;
                this.type = 1;
            }
        }
    }

    // 爆発アニメーション
    explosion() {
        for (let ex of this.explosions) {
            ex.frame++;
            // 爆発し終わった花火を配列から除去する
            if (2 === ex.getType) {
                this.explosions = this.explosions.filter((n) => n !== ex);
                continue;
            }

            // 残像を描画
            if (0 === Math.round(random(0, 32))) {
                ex.afterImages.push(new Afterimage(this.r, this.g, this.b, ex.x, ex.y, ex.w, ex.a));
            }

            for (let ai of ex.afterImages) {
                if (ai.getAlpha < 0) {
                    ex.afterImages = ex.afterImages.filter((n) => n !== ai);
                    continue;
                }
                ai.exImage();
            }

            // 爆発を描画
            this.update(ex.x, ex.y, ex.w, ex.a);
            ex.x += ex.vx;
            ex.y += ex.vy;
            ex.vx = ex.vx * ex.gv;
            ex.vy = ex.vy * ex.gv;
            ex.vy = ex.vy + ex.gv / 100;
            if (this.exend < ex.frame) {
                ex.w -= 0.1;
                ex.a = ex.a - 4;
                if (ex.a < 0 && 0 === ex.afterImages.length) {
                    ex.type = 2;
                }
            }
        }
    }

    // 花火を表示する
    update(x, y, w, a) {
        this.frame++;
        if (0 < this.a) {
            let c = color(this.r, this.g, this.b);
            c.setAlpha(a);
            fill(c);
            ellipse(x, y, w, w);
        }
    }
}

var count = 0;
var flg = false;
(function($){
    $(document).ready(function(){
      var slides = $(".slideshow > li");
      
      function toggle_slide(){
        count = (count + 1) % 5;
        slides.removeClass("current").eq(count).addClass("current");
        flg = false;
      }
      setInterval(toggle_slide, 5000);
    });  
})(jQuery);