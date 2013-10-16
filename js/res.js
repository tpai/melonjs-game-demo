// 資源對應表
var g_ressources = [  
	// 景色圖塊組
	{name: "area01_level_tiles", type:"image", src: "data/img/map/area01_level_tiles.png"},
	// 碰撞圖塊組
	{name: "metatiles32x32", type:"image", src: "data/img/map/metatiles32x32.png"},
	// 背景圖
	{name: "area01_bkg0", type:"image",	src: "data/img/area01_bkg0.png"},
	{name: "area01_bkg1", type:"image",	src: "data/img/area01_bkg1.png"},
	// Tiled所製作出的地圖
	{name: "level01", type: "tmx", src: "data/map/level01.tmx"},

	// 玩家動態圖
	{name: "gripe_run_right", type:"image", src: "data/img/sprite/gripe_run_right.png"},
	// 敵人動態圖
	{name: "wheelie_right", type:"image", src: "data/img/sprite/wheelie_right.png"},
	// 金幣動態圖
	{name: "spinning_coin_gold", type:"image", src: "data/img/sprite/spinning_coin_gold.png"},
    
    // 分數板字型
	{name: "32x32_font", type:"image", src: "data/img/font/32x32_font.png"},
    
    // 背景音樂
	{name: "dst-inertexponent", type: "audio", src: "data/bgm/", channel : 1},
	// 遊戲音效
	{name: "cling", type: "audio", src: "data/sfx/", channel : 2}, // 吃金幣
	{name: "stomp", type: "audio", src: "data/sfx/", channel : 1}, // 踩踏
	{name: "jump",  type: "audio", src: "data/sfx/", channel : 1}, // 跳躍
    
    // 前導圖
	{name: "title_screen", type:"image", src: "data/img/gui/title_screen.png"}
];