jsApp.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		// 讀取關卡
		me.levelDirector.loadLevel("level01");
		
        // 設定分數板大小位置
		me.game.addHUD(0, 430, 640, 60);
 		// 新增分數板物件
		me.game.HUD.addItem("score", new jsApp.ScoreObject(620, 10));
        
        // 播放背景音樂
		me.audio.playTrack("dst-inertexponent");
	},

	onDestroyEvent: function() {
        // 移除分數板
		me.game.disableHUD();
        
        // 停止背景音樂
		me.audio.stopTrack();
	}
});

jsApp.PlayerEntity = me.ObjectEntity.extend({
	init: function(x, y, settings) {
		// 呼叫建構子
		this.parent(x, y, settings);
		// 速度設定(水平及垂直)
		this.setVelocity(3, 15);

		// 調整碰撞區塊大小
		this.updateColRect(8, 48, -1, 0);
		// 此時的玩家視角以人物的位置為水平&垂直基準移動
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},
	update: function() {
		// 左右行走
		if (me.input.isKeyPressed('left'))
		{
			// 將玩家動態圖翻面(因為原本向右)
			this.flipX(true);
			// 更新速率
			this.vel.x -= this.accel.x * me.timer.tick;
		}
		else if (me.input.isKeyPressed('right'))
		{
			this.flipX(false);
			this.vel.x += this.accel.x * me.timer.tick;
		}
		else
		{
			this.vel.x = 0;
		}
		
		// 跳躍
		if (me.input.isKeyPressed('jump'))
		{ 
			if (!this.jumping && !this.falling)			{
				// 將現在速度設定為最大的速度 重力會去處理其他的部分
				this.vel.y = -this.maxVel.y * me.timer.tick;
				// 設為正在跳躍中
				this.jumping = true;
                // 播放跳躍音效
                me.audio.play("jump");
			}
		}
		
		// 更新移動位置
		this.updateMovement();

		// 如果發生碰撞
		var res = me.game.collide(this);
		if (res) {

			// 撞到敵人
			if (res.obj.type == me.game.ENEMY_OBJECT) {
				// 從頭上踩
				if ((res.y > 0) && ! this.jumping) {
					// 非掉落狀態
					this.falling = false;
					// 給予向上速度以彈起
					this.vel.y = -this.maxVel.y * me.timer.tick;
					// 為跳躍狀態
					this.jumping = true;
                    // 播放踩踏音效
                    me.audio.play("stomp");
				}
				// 反之則是被攻擊
				else {
					// 則讓主角呈閃爍狀
					this.renderable.flicker(45);
				}
			}
		}


		// 如果有需要則更新
		if (this.vel.x!=0 || this.vel.y!=0) {
			this.parent();
			return true;
		}

		// 如果不需要則通知引擎不要做任何更新(如. 位置, 動畫)
		return false;
	}
});

jsApp.EnemyEntity = me.ObjectEntity.extend({
	init: function(x, y, settings) {
		// 定義來源設定值
		// settings.image = "wheelie_right";
		// settings.spritewidth = 64;
		// 呼叫父建構子
		this.parent(x, y, settings);

		// 定義來回的起始與結束位置
		this.startX = x;
		this.endX = x + settings.width - settings.spritewidth;
		// 從右邊開始往左走
		this.pos.x = x + settings.width - settings.spritewidth;
		this.walkLeft = true;

		// 速度設定(水平及垂直)
		this.setVelocity(2, 3);
		// 定義為敵人物件
		this.type = me.game.ENEMY_OBJECT;
	},
	// 當碰撞到其他物件(通常是玩家)
	onCollision: function(res, obj) {
		// 當被來自上方的掉落物體踩到時
		if (this.alive && (res.y > 0) && obj.falling) {
			// 移除實體並且呈無法碰撞狀態
			this.collidable = false;
			me.game.remove(this)
            // 加分
            me.game.HUD.updateItemValue("score", 30);
		}
	},
	// 移動事件處理
	update: function() {
		// 如果不在畫面中則不做任何主李
		if (!this.inViewport)
			return false;

		// 如果存活著
		if (this.alive) {
			// 走到左邊底
			if (this.walkLeft && this.pos.x <= this.startX) {
				this.walkLeft = false;
			}
			// 走到右邊底
			else if (!this.walkLeft && this.pos.x >= this.endX) {
				this.walkLeft = true;
			}
			// 根據現在往左或右走來翻圖片
			this.flipX(this.walkLeft);
			this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
		}
		else {
			this.vel.x = 0;
		}
		// 確認動作更新
		this.updateMovement();

		// 如果速度不為零(則仍然存活)
		if (this.vel.x!=0 || this.vel.y!=0) {
			// 更新物件動畫
			this.parent();
			return true;
		}
		return false;
	}
});

jsApp.CoinEntity = me.CollectableEntity.extend({
	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},
 	onCollision: function() {
        // 播放吃金幣音效
		me.audio.play("cling");
        // 加分
		me.game.HUD.updateItemValue("score", 100);
		// 移除實體
		this.collidable = false;
		me.game.remove(this);
	}
});

jsApp.ScoreObject = me.HUD_Item.extend({
	init: function(x, y) {
		// 呼叫父建構子
		this.parent(x, y);
		// 導入字形
		this.font = new me.BitmapFont("32x32_font", 32);
		this.font.set("right");
	},
	// 繪出分數
	draw: function(context, x, y) {
		this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
	}
});

jsApp.TitleScreen = me.ScreenObject.extend({
	init: function() {
		this.parent(true);
	},
 
	onResetEvent: function() {
		if (this.title == null) {
            // 讀取前導圖
			this.title = me.loader.getImage("title_screen");
            // 字型設為自訂字型
			this.font = new me.BitmapFont("32x32_font", 32);
			this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            // 文字內容
            this.scroller = "MELONJS TUTORIAL GAME DEMO";
		}
 
 		// 以跑馬燈方式呈現
        this.scrollerpos = 640;
		this.scrollertween = new me.Tween(this).to({
			scrollerpos: -2000
		}, 10000).onComplete(this.scrollover.bind(this)).start();
 
		// 綁定enter鍵
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
	},

	// 跑馬燈跑至盡頭
	scrollover: function() {
		// 重置
		this.scrollerpos = 640;
		this.scrollertween.to({
			scrollerpos: -2000
		}, 10000).onComplete(this.scrollover.bind(this)).start();
	},
 
	update: function() {
		// 按下enter表示遊戲開始
		if (me.input.isKeyPressed('enter')) {
			// 遊戲開始音效
			me.audio.play("cling");
			// 場景切換
			me.state.change(me.state.PLAY);
		}
		return true;
	},
 
    // 繪製
	draw: function(context) {
        // 標題圖
		context.drawImage(this.title, 0, 0);
        // 提示文字
 		this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
        // 跑馬燈
		this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
	},
    
    //移除所有事件
	onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);
		this.scrollertween.stop();
	}
 
});