var socketOpen = false
//var socketMsgQueue = "{\"M\":\"login\",\"ID\":\"19158\",\"K\":\"f09213980f\"}"
const msg = "{\"M\":\"login\",\"ID\":\"22157\",\"K\":\"32d2389b55\"}\n"
const msg_gate="{\"M\":\"say\",\"ID\":\"D29045\",\"C\":\"A\",\"SIGN\":\"\"}\n"
const msg_gate2="{\"M\":\"say\",\"ID\":\"D29045\",\"C\":\"C\",\"SIGN\":\"\"}\n"

var username='no_login'
var flag_login = false; // 贝壳物联账号登录标志

wx.cloud.init({
    env: 'hsw-9g8fn4d0c96aaf9a', //云开发环境id
    traceUser: true,
  })

Page({
    data: {
        "bnrUrl": [{
        "url": "../pic/adver_1.png"
        },{
        "url": "../pic/adver_2.png"
        },{
        "url": "../pic/adver_3.png"
        }
        ]
    },

    onLoad: function () {
        username='no_login'
        this.setData({
            userInfo:'',
            parking_time:0,
            parking_money:0
        })
        wx.setStorageSync('user', null)
        wx.setStorageSync('username1', username)
        wx.setStorageSync('socketOpen1', false)
        wx.setStorageSync('socketOpenTrue1', false)
        wx.setStorageSync('gate_flag', false)
        //  wx.setStorageSync('admin', false)
        //                                        授权后用户信息赋值
        let user=wx.getStorageSync('user')
        this.setData({
            userInfo:user
        })
        //创建 WebSocket 连接
        wx.connectSocket({
            //socket合法域名
            url: 'wss://www.bigiot.net:8484',
            //HTTP Header , header 中不能设置 Referer
            header: {
                'content-type': 'application/json'
            },
            //请求方式
            method: "GET",
            //成功之后回调
            success: function (res) {
                console.log(res)
            },
            //失败回调
            fail: function (err) {
                console.log("connectSocket fail:")
                wx.setStorageSync('socketOpenTrue1', false)
            },
            //结束回调
            complete: function (err) {
                console.log("connectSocket complete:")
                wx.setStorageSync('socketOpenTrue1', false)
            }
        })
        //监听打开事件。
        wx.onSocketOpen(function (res) {
            console.log('WebSocket连接已打开！')
            //修改socketOpen标记
            socketOpen = true
        })
        //监听WebSocket错误
        wx.onSocketError(function (res) {
            console.log('WebSocket连接打开失败！')
        })
        //接收消息事件。
        wx.onSocketMessage(function (res) {
            if(JSON.parse(res.data).M=='update'){
                console.log('收到服务器内容：' + res.data)
                wx.setStorageSync('chewei_one', JSON.parse(res.data).V[25584])
                wx.setStorageSync('chewei_two', JSON.parse(res.data).V[25585])
                wx.setStorageSync('chewei_three', JSON.parse(res.data).V[25586])
                wx.setStorageSync('chewei_four', JSON.parse(res.data).V[25587])
                if( JSON.parse(res.data).V[25587]=='0'&&  wx.getStorageSync('gate_flag')==false){
                    wx.sendSocketMessage({
                        data: msg_gate2,
                        //成功之后回调
                        success: function (res) {
                            console.log(res)
                        },
                        //失败回调
                        fail: function (err) {
                            console.log("sendSocketMessage fail:")
                        },
                        //结束回调
                        complete: function (err) {
                            console.log("sendSocketMessage complete:")
                        }
                    })
                }
                wx.setStorageSync('socketOpenTrue1', true)
            } else if (JSON.parse(res.data).M=='ping') {
                wx.sendSocketMessage({
                    data: 'ping',
                });
            } else {
                console.log('收到服务器内容：' + res.data)
            }
        })
        //监听WebSocket关闭。
        wx.onSocketClose(function (res) {
        wx.setStorageSync('socketOpenTrue1', false)
            console.log('WebSocket 已关闭！')
        })
    },

    onShow() {
        this.setData({
            userInfo: wx.getStorageSync('user'),
        })
        username = wx.getStorageSync('username1')
        wx.cloud.database().collection('now_data').where({
            user_name:username
        }).get({
            success: function(res) {
                if(res.data.length>0){
                    that.setData({
                        parking_time:(((new Date().getTime())-res.data[0].start_time)/60000).toFixed(2),
                        parking_money:(((new Date().getTime())-res.data[0].start_time)/600000).toFixed(2)
                    })
                } else {
                    that.setData({
                        parking_time:0,
                        parking_money:0
                    })
                }
            }
        })
    },

    /************************************************************用户   登录  退出  部分 */
    login(){
        var that =this;
        wx.getUserProfile({
            desc: '必须授权才能使用',
            success:res=>{

            },
            fall:res=>{
                console.log('失败',res)
                wx.setStorageSync('username1',no_login)
            }
        })

    },

    nologin(){
        var that = this;
        wx.showModal({
            title: "退登", // 提示的标题
            content: "确认退出登录？", // 提示的内容
            showCancel: true, // 是否显示取消按钮，默认true
            cancelText: "取消", // 取消按钮的文字，最多4个字符
            cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
            confirmText: "确认", // 确认按钮的文字，最多4个字符
            confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
            success: function (res) {
                if (res.confirm) {
                    username='no_login'
                    that.setData({
                        userInfo:''
                    })
                    wx.setStorageSync('user', null)
                    wx.setStorageSync('username1', username)
                    wx.setStorageSync('socketOpenTrue1', false)
                    //  wx.setStorageSync('admin', false)
                    wx.showToast({
                        title: "退登成功", // 提示的内容
                        icon: 'none', // 图标，默认success
                        image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                        duration: 3000, // 提示的延迟时间，默认1500
                        mask: false, // 是否显示透明蒙层，防止触摸穿透     
                    })     
                }
            }
        })
    },

    //************************************************************************** 状态更新*/
    parking_status(){
        var that=this;
        console.log(username);
        wx.cloud.database().collection('now_data').where({
        user_name:username
        }).get({
            success: function(res) {
                if(res.data.length>0){
                    that.setData({
                        parking_time:(((new Date().getTime())-res.data[0].start_time)/60000).toFixed(0),
                        parking_money:(((new Date().getTime())-res.data[0].start_time)/600000).toFixed(2)
                    })
                } else {
                    that.setData({
                        parking_time:0,
                        parking_money:0
                    })
                }
                wx.showToast({
                    title: "更新成功", // 提示的内容
                    icon: 'none', // 图标，默认success
                    image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                    duration: 3000, // 提示的延迟时间，默认1500
                    mask: false, // 是否显示透明蒙层，防止触摸穿透     
                })
            }
        })
    },

    go: function() {
        //**********************************************************************贝壳物联账号登录 */
        if (socketOpen  && flag_login == false) {
            //发送消息
            wx.sendSocketMessage({
                data: msg,
                //成功之后回调
                success: function (res) {
                    console.log(res)
                    console.log('中间件账号登录成功！')
                },
                //失败回调
                fail: function (err) {
                    console.log("sendSocketMessage fail:")
                },
                //结束回调
                complete: function (err) {
                    console.log("sendSocketMessage complete:")
                }
            })
        } else if (!socketOpen) {
            wx.showToast({
                title: "中间件账号登录失败", // 提示的内容
                icon: 'none', // 图标，默认success
                image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                duration: 3000, // 提示的延迟时间，默认1500
                mask: false, // 是否显示透明蒙层，防止触摸穿透     
            })
            //socketMsgQueue.push(msg)
        } else {

        }
        wx.navigateTo({
            url:'/pages/login/login'
        })
    }
})