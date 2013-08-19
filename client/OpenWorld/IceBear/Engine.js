/**********************************
*The brain behind the whole engine*
*TODO: Everything******************
**********************************/

var IB = IB || {};

IB.engine = IB.engine || Object.create(IB.object);

//////////////////////////////////////////////////

IB.engine.subEngines = [];

IB.engine.gameNoticeList = [];

IB.engine.customStartupFunctions0 = [];

IB.engine.customStartupFunctions1 = [];

IB.engine.customStartupFunctions2 = [];

IB.engine.customStartupFunctions3 = [];

IB.engine.renderer = {};

IB.engine.WIDTH = window.innerWidth;

IB.engine.HEIGHT = window.innerHeight;

IB.engine.FOV = null;

IB.engine.NEAR = null;

IB.engine.FAR = null;

IB.engine.stopGame = null;

IB.engine.mode = null;

IB.logo = {};

/////////////////////////////////////

IB.logo.stopLogoFader = function () {
	$("#EngineLogo").remove();
    clearInterval(IB.logo.logoFader);
    delete IB.logo;

    OW.initGame();
};

IB.engine.initEngine = function () {
    IB.logo = IB.logo || {};
    IB.logo.time = 0;
    IB.logo.logoFader = setInterval(function () {
        var opacity = 1.5 * IB.logo.time - (0.5 * IB.logo.time * IB.logo.time);
        if (opacity > 1) {
            opacity = 1;
        }
        document.getElementById("EngineLogo").style.opacity = opacity;
        IB.logo.time += 0.01;
        if (IB.logo.time > 3) {
            IB.logo.stopLogoFader();
        }
    }, 10);
};

IB.engine.initGame = function () {
    var i;

    this.world.createScene();
    for (i = 0; i < this.customStartupFunctions0.length; i++) {
        this.customStartupFunctions0[i].apply(this);
    }
    this.world.loadMap(this, function () {this.continueInitGame();});
};

IB.engine.continueInitGame = function () {
    var i;

    for (i = 0; i < this.customStartupFunctions1.length; i++) {
        this.customStartupFunctions1[i].apply(this);
    }
    for (i = 0; i < this.gameNoticeList.length; i++) {
        this.gameNoticeList[i].preGameStart();
    }
    for (i = 0; i < this.customStartupFunctions2.length; i++) {
        this.customStartupFunctions2[i].apply(this);
    }
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    document.body.appendChild(this.renderer.domElement);
    for (i = 0; i < this.customStartupFunctions3.length; i++) {
        this.customStartupFunctions3[i].apply(this);
    }
    for (i = 0; i < this.gameNoticeList; i++) {
        this.gameNoticeList[i].gameStart();
    }

    this.tickLoop();
};

IB.engine.tickLoop = function () {
    requestAnimFrame(this.tickLoop);
    this.renderer.render(this.world.scene, this.player.pc.camera);
};

IB.engine.requestPerspectiveCamera = function () {
    camera = new THREE.PerspectiveCamera(this.FOV, this.WIDTH / this.HEIGHT, this.NEAR, this.FAR);
    this.world.sceneAdd(camera);
    return camera;
};