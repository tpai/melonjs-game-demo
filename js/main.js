var jsApp =
{
	// 初始化
	onload: function()
	{
		if (!me.video.init('jsapp', 640, 480))
		{
			alert("您的瀏覽器還不支援HTML5啊？該換了啦～");
			return;
		}
        // 初始化音效
		me.audio.init("mp3,ogg");
        
		// 讀取資源
		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(g_ressources);
        
		// 切換為 Loading State
		me.state.change(me.state.LOADING);
	},
	
	// 當所有資源讀取完畢
	loaded: function ()
	{
        // 綁定 Menu State 於 TitleScreen Object
		me.state.set(me.state.MENU, new jsApp.TitleScreen());
		// 綁定 Play State 於 PlayScreen Object
		me.state.set(me.state.PLAY, new jsApp.PlayScreen());

		// 加入玩家實體
		me.entityPool.add("player", this.PlayerEntity);
		me.entityPool.add("enemy", this.EnemyEntity);
		me.entityPool.add("coin", this.CoinEntity);
		// 綁定按鍵事件
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP, "up");
		me.input.bindKey(me.input.KEY.DOWN, "down");
		me.input.bindKey(me.input.KEY.ENTER, "enter");
		me.input.bindKey(me.input.KEY.X, "jump", true);

		// 切換為 Menu State
		me.state.change(me.state.MENU);
	},

	// 及時處理
	onUpdateFrame: function()
	{
		// 影格更新
		me.timer.update();
		// 更新材質
		me.game.update();
		// 繪製出剩下的遊戲物件
		me.game.draw();
	},
	// 遊戲重置
	reset: function()
	{
		// 重置所有物件
		me.game.reset();
	},
	// 改變關卡
	changelevel: function()
	{
		// 重置所有物件
		me.game.reset();
	}
};
window.onReady(function() 
{
	jsApp.onload();
});