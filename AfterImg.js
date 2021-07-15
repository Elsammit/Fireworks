// 残像処理用クラス
class Afterimage {
    constructor(r, g, b, x, y, w, a) {
        this.frame = 0;
        this.r = r;
        this.g = g;
        this.b = b;
        this.x = x;
        this.y = y;
        this.w = w;
        this.a = a;
        this.vx = random(-0.24, 0.24);
        this.vy = random(0.5, 1.65);
        this.vw = random(1.05, 1.2);
    }

    get getAlpha() {
        return this.a;
    }

    // 打ち上げ用
    rsImage() {
        if (0 < this.a) {
            this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
            this.r += 4;
            this.g += 4;
            this.b += 4;
            this.x = this.x + this.vx;
            this.y = this.y + this.vy;
            if (0 < this.w) {
                this.w = this.w - this.vw;
            }
            this.a = this.a - 4;
        }
    }

    // 爆発用
    exImage() {
        if (0 < this.a) {
            this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
            this.r += 2.5;
            this.g += 2.5;
            this.b += 2.5;
            this.x = this.x + this.vx;
            this.y = this.y + this.vy;
            if (0 < this.w) {
                this.w = this.w - this.vw;
            }
            this.a = this.a - 1.5;
        }
    }

    update(r, g, b, x, y, w, a) {
        this.frame++;
        let c = color(r, g, b);
        c.setAlpha(a);
        fill(c);
        ellipse(x, y, w, w);
    }
}

