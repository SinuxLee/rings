const { ccclass, property } = cc._decorator

@ccclass
export default class ImageToBase64 extends cc.Component {
  static pngToBase64 (sprite: cc.SpriteFrame) {
    cc.log(sprite)
    const texture: cc.Texture2D = sprite.getTexture()

    cc.log(texture)

    const htmlImage: HTMLImageElement = texture.getHtmlElementObj()

    cc.log(htmlImage)

    const canvas = document.createElement('canvas')
    canvas.width = htmlImage.width
    canvas.height = htmlImage.height
    const temp = canvas.getContext('2d')
    temp.drawImage(htmlImage, 0, 0, htmlImage.width, htmlImage.height)
    const data = canvas.toDataURL()
    return data
  }
}
