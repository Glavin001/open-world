///////////////////////////////////////////////////////////////////////
//  QImage
///////////////////////////////////////////////////////////////////////
/**
 * QImage constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.QImage = function(config) {
    // defaults
    if(config.width === undefined) {
        config.width = config.image.width;
    }
    if(config.height === undefined) {
        config.height = config.image.height;
    }
    if(config.srcx === undefined) {
        config.srcx = 0;
    }
    if(config.srcy === undefined) {
        config.srcy = 0;
    }
    if(config.srcwidth === undefined) {
        config.srcwidth = config.image.width;
    }
    if(config.srcheight === undefined) {
        config.srcheight = config.image.height;
    }
    config.drawFunc = function() {
        var canvas = this.getCanvas();
        var context = this.getContext();
        context.beginPath();
        context.rect(0, 0, this.width, this.height);
        context.closePath();
        this.fillStroke();
        context.drawImage(this.image, this.srcx, this.srcy, this.srcwidth, this.srcheight, 0, 0, this.width, this.height);
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * QImage methods
 */
Kinetic.QImage.prototype = {
    /**
     * set image
     * @param {ImageObject} image
     */
    setImage: function(image) {
        this.image = image;
    },
    /**
     * get image
     */
    getImage: function(image) {
        return this.image;
    },
    /**
     * set width
     * @param {Number} width
     */
    setWidth: function(width) {
        this.width = width;
    },
    /**
     * get width
     */
    getWidth: function() {
        return this.width;
    },
    /**
     * set height
     * @param {Number} height
     */
    setHeight: function(height) {
        this.height = height;
    },
    /**
     * get height
     */
    getHeight: function() {
        return this.height;
    },
    /**
     * set width and height
     * @param {Number} width
     * @param {Number} height
     */
    setSize: function(width, height) {
        this.width = width;
        this.height = height;
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.QImage, Kinetic.Shape);
