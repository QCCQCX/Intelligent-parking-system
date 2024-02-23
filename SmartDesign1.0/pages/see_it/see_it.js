Page({
    onLoad(){
        var that=this;
        setInterval(function () {
            that.setData({
                chewei__1:wx.getStorageSync('chewei_one'),
                chewei__2:wx.getStorageSync('chewei_two'),
                chewei__3:wx.getStorageSync('chewei_three')
            })
        }, 500)
    }
})