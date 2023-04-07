const MTA_CONFIG = {
  app_id: '',
  event_id: '',
  api_base: 'https://pingtas.qq.com/pingd',
  prefix: '_mta_',
  version: '1.3.5',
  stat_share_app: !1,
  stat_pull_down_fresh: !1,
  stat_reach_bottom: !1
}

function getNetworkType (a) {
  wx.getNetworkType({
    success: function (b) {
      a(b.networkType)
    }
  })
}

function getSystemInfo () {
  const a = wx.getSystemInfoSync()
  return {
    adt: encodeURIComponent(a.model),
    scl: a.pixelRatio,
    scr: a.windowWidth + 'x' + a.windowHeight,
    lg: a.language,
    fl: a.version,
    jv: encodeURIComponent(a.system),
    tz: encodeURIComponent(a.platform)
  }
}

function getUID () {
  try {
    return wx.getStorageSync(MTA_CONFIG.prefix + 'auid')
  } catch (a) { }
}

function setUID () {
  try {
    const a = getRandom()
    wx.setStorageSync(MTA_CONFIG.prefix + 'auid', a)
    return a
  } catch (b) { }
}

function getSID () {
  try {
    return wx.getStorageSync(MTA_CONFIG.prefix + 'ssid')
  } catch (a) { }
}

function setSID () {
  try {
    const a = 's' + getRandom()
    wx.setStorageSync(MTA_CONFIG.prefix + 'ssid', a)
    return a
  } catch (b) { }
}

function getRandom (a) {
  for (var b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], c = 10; c > 1; c--) {
    var d = Math.floor(10 * Math.random())
    const e = b[d]
    b[d] = b[c - 1]
    b[c - 1] = e
  }
  for (c = d = 0; c < 5; c++) d = 10 * d + b[c]
  return (a || '') + (d + '' + +new Date())
}

function getPagePath () {
  try {
    const
      b = '/'
    return b
  } catch (c) {
    console.log('get current page path error:' + c)
  }
}

function getMainInfo () {
  const a = {
    dm: 'wechat.apps.xx',
    url: getPagePath(),
    pvi: '',
    si: '',
    ty: 0
  }
  a.pvi = (function () {
    let b = getUID()
    b || (b = setUID(), a.ty = 1)
    return b
  }())
  a.si = (function () {
    let a = getSID()
    a || (a = setSID())
    return a
  }())
  return a
}

function getBasicInfo () {
  const a = getSystemInfo()
  getNetworkType(function (a) {
    try {
      wx.setStorageSync(MTA_CONFIG.prefix + 'ntdata', a)
    } catch (c) { }
  })
  a.ct = wx.getStorageSync(MTA_CONFIG.prefix + 'ntdata') || '4g'
  return a
}

function getExtentInfo () {
  let a = MTA.Data.userInfo
  const b = []
  let c
  for (c in a) a.hasOwnProperty(c) && b.push(c + '=' + a[c])
  a = b.join(';')
  return {
    r2: MTA_CONFIG.app_id,
    r4: 'wx',
    ext: 'v=' + MTA_CONFIG.version + (a !== null && a !== '' ? ';ui=' + encodeURIComponent(a) : '')
  }
}
var MTA = {
  App: {
    init: function (a) {
      'appID' in a && (MTA_CONFIG.app_id = a.appID)
      'eventID' in a && (MTA_CONFIG.event_id = a.eventID)
      'statShareApp' in a && (MTA_CONFIG.stat_share_app = a.statShareApp)
      'statPullDownFresh' in a && (MTA_CONFIG.stat_pull_down_fresh = a.statPullDownFresh)
      'statReachBottom' in a && (MTA_CONFIG.stat_reach_bottom = a.statReachBottom)
      setSID()
      'lauchOpts' in a && (MTA.Data.lanchInfo = a.lauchOpts, MTA.Data.lanchInfo.landing = 1)
    }
  },
  Page: {
    init: function () {
      const a = { onShow: true, __route__: 'pages/index/index' }
      a.onShow &&
          !(function () {
            const b = a.onShow
            a.onShow = function () {
              MTA.Page.stat()
              b.call(this, arguments)
            }
          }())
      MTA.Page.stat()
      MTA_CONFIG.stat_pull_down_fresh && a.onPullDownRefresh && !(function () {
        const b = a.onPullDownRefresh
        a.onPullDownRefresh = function () {
          MTA.Event.stat(MTA_CONFIG.prefix + 'pulldownfresh', {
            url: a.__route__
          })
          b.call(this, arguments)
        }
      }())
      MTA_CONFIG.stat_reach_bottom && a.onReachBottom && !(function () {
        const b = a.onReachBottom
        a.onReachBottom = function () {
          MTA.Event.stat(MTA_CONFIG.prefix + 'reachbottom', {
            url: a.__route__
          })
          b.call(this, arguments)
        }
      }())
      MTA_CONFIG.stat_share_app && a.onShareAppMessage && !(function () {
        const b = a.onShareAppMessage
        a.onShareAppMessage = function () {
          MTA.Event.stat(MTA_CONFIG.prefix + 'shareapp', {
            url: a.__route__
          })
          return b.call(this, arguments)
        }
      }())
    },
    stat: function () {
      if (MTA_CONFIG.app_id != '') {
        const a = []
        let b = getExtentInfo()
        const c = [getMainInfo(), b, getBasicInfo()]
        MTA.Data.lanchInfo && (c.push({
          ht: MTA.Data.lanchInfo.scene,
          rdm: '/',
          rurl: MTA.Data.lanchInfo.path
        }), MTA.Data.lanchInfo.query && MTA.Data.lanchInfo.query._mta_ref_id && c.push({
          rarg: MTA.Data.lanchInfo.query._mta_ref_id
        }),
        MTA.Data.lanchInfo.landing == 1 && (b.ext += ';lp=1', MTA.Data.lanchInfo.landing = 0))
        c.push({
          rand: +new Date()
        })
        b = 0
        for (let d = c.length; b < d; b++) { for (const e in c[b]) c[b].hasOwnProperty(e) && a.push(e + '=' + (typeof c[b][e] === 'undefined' ? '' : c[b][e])) }
        wx.request({
          url: MTA_CONFIG.api_base + '?' + a.join('&').toLowerCase()
        })
      }
    }
  },
  Event: {
    stat: function (a, b) {
      if (MTA_CONFIG.event_id != '') {
        const c = []
        let d = getMainInfo()
        let e = getExtentInfo()
        d.dm = 'wxapps.click'
        d.url = a
        e.r2 = MTA_CONFIG.event_id
        let f = typeof b === 'undefined' ? {} : b
        const k = []
        let g
        for (g in f) {
          f.hasOwnProperty(g) &&
            k.push(encodeURIComponent(g) + '=' + encodeURIComponent(f[g]))
        }
        f = k.join(';')
        e.r5 = f
        f = 0
        d = [d, e, getBasicInfo(), {
          rand: +new Date()
        }]
        for (e = d.length; f < e; f++) { for (const h in d[f]) d[f].hasOwnProperty(h) && c.push(h + '=' + (typeof d[f][h] === 'undefined' ? '' : d[f][h])) }
        wx.request({
          url: MTA_CONFIG.api_base + '?' + c.join('&').toLowerCase()
        })
      }
    }
  },
  Data: {
    userInfo: null,
    lanchInfo: null
  }
}
module.exports = MTA
