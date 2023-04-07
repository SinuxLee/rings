const { ccclass, property } = cc._decorator

@ccclass
export default class MiniGameBase {
  public appData: MiniGameData = null

  /**
     * 临时登陆凭证
     */
  protected static userCode = null

  systemInfo = null

  protected bannerAd = null
  protected videoAd = null
  protected insertAd = null

  protected appBoxAd = null

  protected readyShare = false
  protected shareOutTime = -1

  protected needShowBanner: boolean = false

  protected static videoCallback = null

  /**
     * 初始化App数据
     * {appId,appsid,appKey,appSecret,bannerId,videoId,insertId}
     * @param object
     */
  initAppData (object) {
    this.appData = object
    this.systemInfo = this.getSystemInfo()

    this.initAd()
  }

  protected initAd () {
    this.createVideoAd()
  }

  /**
     * 获取系统信息
     */
  getSystemInfo (): any {
    console.log('获取系统信息')
    return { platfrom: 'broswer' }
  }

  /**
     * 设置右上角转发按钮
     */
  showShareMenu () {
    console.log('设置右上角转发按钮')
  }

  /**
     * 设置右上角转发按钮
     */
  setOnShareAppMessage () {
    console.log('设置右上角转发按钮')
  }

  /**
     * 主动分享接口
     */
  shareApp (callback?: Function, shareTitle?: string, shareImageUrl?: string, query?: string) {
    console.log('主动分享接口')
    callback && callback(true)
  }

  /**
     * 显示提示框
     */
  showToast (title: string, successIcon: boolean) {
    console.log('显示提示框')
  }

  /**
     * 检测版本更新
     */
  chekcUpdateVersion () {
    console.log('检测版本更新')
  }

  /**
     * 小程序跳转接口
     */
  launchMiniProgram (miniProgramAppId: string, callback) {
    console.log('小程序跳转接口')
    callback && callback(true)
  }

  /**
     * 登陆接口
     */
  login (callBack): any {
    console.log('登陆接口')
  }

  /**
     * 获取用户信息
     * @param callback
     */
  getSetting (callback) {
    console.log('获取用户信息')
  }

  /**
     * 创建获取信息按钮
     * @param callback
     */
  protected createUserInfoButton (callback) {
    console.log('创建获取信息按钮')
  }

  /**
     * 上传玩家数据
     */
  setUserCloudStorage (key: string, value: string) {
    console.log('上传玩家数据')
  }

  /**
     * 向开放域发送数据
     */
  postMessage2OpenData (message: string) {
    console.log('向开放域发送数据')
  }

  /**
     * 获取OpenId
     */
  getOpenId (callback) {
    console.log('获取OpenId')
    return null
  }

  /**
     * 创建Banner广告
     */
  createBanner () {
    console.log('创建Banner广告')
  }

  /**
     * 展示Banner
     */
  showBanner () {
    console.log('测试展示Banner模式')
  }

  /**
     * 隐藏Banner
     */
  hideBanner () {
    console.log('隐藏Banner')
  }

  /**
     * 创建视频广告
     */
  createVideoAd () {
    console.log('创建视频广告')
  }

  /**
     * 展示视频广告
     */
  showVideoAd (callback) {
    console.log('展示视频广告')
  }

  /**
     * 创建插屏广告
     */
  createInsertAd () {
    console.log('创建插屏广告')
  }

  /**
     * 展示插屏广告
     */
  showInsertAd () {
    console.log('展示插屏广告')
    this.showBanner()
  }

  /**
     * 震动
     */
  doVibrate (short: boolean) {
    console.log('震动')
  }

  /**
     * 录屏功能
     */
  getGameRecorderManager (): any {
    console.log('录屏功能')
    return null
  }

  /**
     * 创建更多游戏按钮
     */
  getMoreGamesButton (width: number, parentNode: cc.Node): any {
    console.log('创建更多游戏按钮')
    return null
  }

  /**
     * 获取小程序菜单栏屏幕位置
     */
  getMenuButtonWorldPos (): any {
    console.log('获取小程序菜单栏屏幕位置')
    return null
  }

  /**
     * 退出游戏
     */
  exitGame () {
    console.log('退出游戏')
  }

  /**
     * 重启游戏
     */
  restartGame () {
    console.log('重启游戏')
  }

  /**
     * 分享录屏
     */
  shareVideo (videoPath) {
    console.log('分享录屏')
  }

  /**
     * 游戏切入前台
     */
  onShow () {
    console.log('游戏切入前台')
    return null
  }

  /**
     * 游戏切入后台
     */
  onHide () {
    console.log('游戏切入后台')
  }

  /**
     * 发起Https请求
     */
  request (object) {
    console.log('发起Https请求')
  }

  /**
     * 下载文件
     */
  downloadFile (object) {
    console.log('下载文件')
  }

  /**
     * 上传文件
     */
  uploadFile (object) {
    console.log('上传文件')
  }

  /**
     * 开始监听加速度数据
     */
  startAccelerometer (callback) {
    console.log('开始监听加速度数据')
    cc.systemEvent.setAccelerometerEnabled(true)
    cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, (event) => {
      callback && callback({ x: event.acc.x * 10, y: event.acc.y * 10, z: event.acc.z * 10 })
    }, this)
  }

  /**
     * 结束监听加速度数据
     */
  stopAccelerometer () {
    console.log('结束监听加速度数据')
    cc.systemEvent.setAccelerometerEnabled(false)
  }

  /**
     * 创建游戏盒子
     * 仅QQ支持
     */
  createAppBox () {
    console.log('创建QQ游戏盒子')
  }

  /**
     * 展示游戏盒子
     * 仅QQ支持
     */
  showAppBox (callback) {
    console.log('展示QQ游戏盒子')
  }

  /**
     * 展示游戏盒子
     * 仅支持头条
     */
  showMoreGamesModal () {
    console.log('展示TT游戏盒子')
  }
}

export class MiniGameData {
  channel: string = ''
  yzkid: string = ''
  appname: string = ''
  appid: string = ''
  appkey: string = ''
  appsecret: string = ''
  appsid: string = ''
  bannerid: string = ''
  videoid: string = ''
  insertid: string = ''

  sharetitle: string = ''
  shareimageurl: string = ''

  video: boolean = true
}
