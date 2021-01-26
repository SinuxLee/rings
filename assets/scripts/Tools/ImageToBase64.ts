const {ccclass, property} = cc._decorator;

@ccclass
export default class ImageToBase64 extends cc.Component {

    static pngToBase64(sprite:cc.SpriteFrame){
        cc.log(sprite);
        let texture :cc.Texture2D = sprite.getTexture();

        cc.log(texture);

        let htmlImage:HTMLImageElement = texture.getHtmlElementObj();

        cc.log(htmlImage);

        let canvas = document.createElement("canvas");
        canvas.width = htmlImage.width;
        canvas.height = htmlImage.height;
        let temp = canvas.getContext('2d');
        temp.drawImage(htmlImage,0,0,htmlImage.width,htmlImage.height);
        let data =canvas.toDataURL();
        return data;
    }

}
