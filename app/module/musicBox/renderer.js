const {ipcRenderer, remote} = require('electron')
const $ = require('../IPC_CONSTANTS')

const {
  Menu,
  MenuItem
} = remote;

const separator = {
  type: 'separator'
}

var listMenuList = [{
  label: '播放'
}, {
  label: '添加到歌单',
  submenu: []
}, separator, {
  label: '分享...'
}, {
  label: '复制链接'
}, {
  label: '下载'
}, separator, {
  label: '从列表中删除'
}]

var menu = Menu.buildFromTemplate(listMenuList)

var musicBox = new Vue({
  el: '#box',
  data: {
    currentSong: {
      id: 's-100'
    },
    isShowInfo: true,
    songList: [{
      name: '吉原ラメント'
    }, {
      name: "Ineter.Ming"
    }, {
      name: '突然的自我'
    }, {
      name: 'Sunrise'
    }, {
      id: 's-100',
      name: '我可能听了假的云音乐'
    }, {
      name: 'メトロノーム'
    }, {
      name: 'Hello XG'
    }, {
      name: 'Strikingly'
    }, {
      name: 'Alibaba'
    }, {
      name: 'Tencent'
    }, {
      name: 'NetEase'
    }]
  },
  methods: {
    showMainCtrl: function () {
      this.isShowInfo = false
    },
    hideMainCtrl: function () {
      this.isShowInfo = true
    },
    openMainWindow: function () {
      ipcRenderer.send($.CLOSE_MUSIC_BOX)
    },
    toggleList: function () {
      this.isShowList = !this.isShowList
      ipcRenderer.send($.TOGGLE_BOX_LIST)
    },
    toggleLyric: function () {
      ipcRenderer.send($.TOGGLE_LYRIC)
    },
    openSongContextMenu: function (e) {
      e.preventDefault()
      menu.popup(remote.getCurrentWindow())
    }
  }
})
