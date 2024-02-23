const defaultAvatarUrl = ''
var user = {}
Page({
    data: {
        avatarUrl: defaultAvatarUrl,
    },

    onChooseAvatar(e) {
        const { avatarUrl } = e.detail 
        this.setData({
            avatarUrl,
        })
        user.avatarUrl = avatarUrl;
    },

    onload() {
    },

    onShow() {
        user = {}
    },

    username:function(e) {
        user.username= e.detail.value
    },
    goback_1:function() {
        var that = this
        if (user.avatarUrl != null && user.username != null &&  user.username.trim() != '') {
            wx.setStorageSync('user', user)
            wx.setStorageSync('username1',user.username)
            wx.setStorageSync('avatarUrl1',user.avatarUrl)
            that.setData({
                userInfo:user
            })
            wx.switchTab({
                url:'/pages/index/index'
            })
        } else {
            wx.showToast({
                title: "请完善信息", // 提示的内容
                icon: 'none', // 图标，默认success
                image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                duration: 3000, // 提示的延迟时间，默认1500
                mask: false, // 是否显示透明蒙层，防止触摸穿透     
            })
        }
    },

    goback_2:function() {
        wx.switchTab({
            url:'/pages/index/index' // 要跳转到的页面路径
        })
    }
})