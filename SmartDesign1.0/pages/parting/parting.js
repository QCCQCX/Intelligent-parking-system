var msg_gate="{\"M\":\"say\",\"ID\":\"D29045\",\"C\":\"A\",\"SIGN\":\"\"}\n"
var msg_gate1="{\"M\":\"say\",\"ID\":\"D29045\",\"C\":\"B\",\"SIGN\":\"\"}\n"
var msg_gate2="{\"M\":\"say\",\"ID\":\"D29045\",\"C\":\"C\",\"SIGN\":\"\"}\n"
var socketOpenTrue=false
const app = getApp()

var money=0
var start_time=0
var username='no_login'
Page({
    onLoad(option){
        var that =this
        try{
            username =wx.getStorageSync('username1')
            socketOpenTrue =wx.getStorageSync('socketOpenTrue1')
        }
        catch(e){
            console.log('parting页面取缓存数据失败')
        }
        wx.cloud.database().collection('now_data').where({
        })
        .get({
            success: function(res) {
                // res.data 是包含以上定义的两条记录的数组
                that.setData({
                    car_number:res.data.length
                })
            }
        }) 
    },

    //************************************************************************  进入车场********** */
    gate_button:function(){
        var that=this
        try{
            username =wx.getStorageSync('username1')
            socketOpenTrue =wx.getStorageSync('socketOpenTrue1')
        }
        catch(e){
            console.log('parting页面取缓存数据失败')
        }
        // if(username=='no_login'){
        //     wx.showToast({
        //         title: "请先登录", // 提示的内容
        //         icon: 'none', // 图标，默认success
        //         image: "", // 自定义图标的本地路径，image 的优先级高于 icon
        //         duration: 3000, // 提示的延迟时间，默认1500
        //         mask: false, // 是否显示透明蒙层，防止触摸穿透     
        //     })
        // } else {
            wx.cloud.database().collection('now_data').where({
            })
            .get({
                success: function(res) {
                    // res.data 是包含以上定义的两条记录的数组
                    that.setData({
                        car_number:res.data.length
                    })        
                    if(res.data.length>=3){
                        wx.showToast({                                 //      加一个提示框   车位已满
                            title: "车位已满", // 提示的内容
                            icon: 'none', // 图标，默认success
                            image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                            duration: 3000, // 提示的延迟时间，默认1500
                            mask: false, // 是否显示透明蒙层，防止触摸穿透     
                        })               
                    } else {
                        if (socketOpenTrue) {
                            wx.cloud.database().collection('now_data').where({
                                user_name:username
                            }).get({
                                success: function(res) {
                                    if(res.data.length>0){
                                        wx.showToast({
                                            title: "请勿重复进入", // 提示的内容
                                            icon: 'none', // 图标，默认success
                                            image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                                            duration: 3000, // 提示的延迟时间，默认1500
                                            mask: false, // 是否显示透明蒙层，防止触摸穿透     
                                        })
                                    } else {
                                        if(wx.getStorageSync('chewei_four') == 1) {
                                            wx.showToast({
                                                title: "前方有驶出车辆 请稍后尝试", // 提示的内容
                                                icon: 'none', // 图标，默认success
                                                image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                                                duration: 3000, // 提示的延迟时间，默认1500
                                                mask: false, // 是否显示透明蒙层，防止触摸穿透     
                                            })
                                        } else {
                                            wx.showModal({
                                                title: "入场确认", // 提示的标题
                                                content: "确认进入车场？", // 提示的内容
                                                showCancel: true, // 是否显示取消按钮，默认true
                                                cancelText: "取消", // 取消按钮的文字，最多4个字符
                                                cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
                                                confirmText: "确认", // 确认按钮的文字，最多4个字符
                                                confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
                                                success: function (res) {
                                                    if (res.confirm) {
                                                        wx.cloud.database().collection('now_data').add({
                                                                // data 字段表示需新增的 JSON 数据
                                                                data: { 
                                                                    user_name: username,
                                                                    start_time:new Date().getTime(),
                                                                }
                                                        })
                                                        .then(res => {
                                                            //成功的处理
                                                            console.log(res)
                                                        }).catch(err => {
                                                            //失败的处理
                                                        })
                                                        wx.showToast({
                                                            title: "欢迎进入", // 提示的内容
                                                            icon: 'none', // 图标，默认success
                                                            image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                                                            duration: 3000, // 提示的延迟时间，默认1500
                                                            mask: false, // 是否显示透明蒙层，防止触摸穿透     
                                                        })
                                                        //发送消息
                                                        wx.sendSocketMessage({
                                                            data: msg_gate,
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
                                                    } else if (res.cancel) {
                                                        console.log('用户取消进入')
                                                    }
                                                },
                                            }) 
                                        }     
                                    }
                                }
                            })
                        } else {
                            wx.showToast({
                                title: "连接失败", // 提示的内容
                                icon: 'none', // 图标，默认success
                                image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                                duration: 3000, // 提示的延迟时间，默认1500
                                mask: false, // 是否显示透明蒙层，防止触摸穿透      
                            })
                        }
                    }
                }
            })
        // }
    },

    //************************************************************更新实时数据   按键 */
    updata_button:function(){
        var that=this
        try{
            username =wx.getStorageSync('username1')
            socketOpenTrue =wx.getStorageSync('socketOpenTrue1')
        }
        catch(e){
            console.log('parting页面取缓存数据失败')
        }
        // if(username=='no_login'){
        //     wx.showToast({
        //         title: "请先登录", // 提示的内容
        //         icon: 'none', // 图标，默认success
        //         image: "", // 自定义图标的本地路径，image 的优先级高于 icon
        //         duration: 3000, // 提示的延迟时间，默认1500
        //         mask: false, // 是否显示透明蒙层，防止触摸穿透     
        //     })
        // } else {
            wx.cloud.database().collection('now_data').where({
            })
            .get({
                success: function(res) {
                    // res.data 是包含以上定义的两条记录的数组
                    that.setData({
                        car_number:res.data.length
                    }) 
                    wx.showToast({
                        title: "更新成功", // 提示的内容
                        icon: 'none', // 图标，默认success
                        image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                        duration: 3000, // 提示的延迟时间，默认1500
                        mask: false, // 是否显示透明蒙层，防止触摸穿透     
                    })       
                }
            })
        // }
    },

    leave_button:function() {
        var that=this
        wx.cloud.database().collection('now_data').where({
        })
        .get({
            success: function(res) {
                // res.data 是包含以上定义的两条记录的数组
                that.setData({
                    car_number:res.data.length
                })        
                wx.cloud.database().collection('now_data').where({
                    user_name:username
                }).get({
                    success: function(res) {
                        if(res.data.length<1){
                            wx.showToast({
                                title: "还没有进入车场", // 提示的内容
                                icon: 'none', // 图标，默认success
                                image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                                duration: 3000, // 提示的延迟时间，默认1500
                                mask: false, // 是否显示透明蒙层，防止触摸穿透     
                            })            
                        } else {
                            if (socketOpenTrue) {
                                var chewei_4=wx.getStorageSync('chewei_four')
                                if(chewei_4=='0'){
                                    wx.showToast({                                             //请先驶入缴费车位
                                        title: "请先驶入缴费车位", // 提示的内容
                                        icon: 'none', // 图标，默认success
                                        image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                                        duration: 3000, // 提示的延迟时间，默认1500
                                        mask: false, // 是否显示透明蒙层，防止触摸穿透     
                                    })                                 
                                } else {
                                    wx.setStorageSync('gate_flag',true)
                                    money=((new Date().getTime())-res.data[0].start_time)/600000
                                    start_time=res.data[0].start_time
                                    wx.sendSocketMessage({
                                        data: msg_gate1,                                //关闭缴费大门
                                        //成功之后回调
                                        success: function (res) {
                                            //*********************************************************************  结算费用   */
                                            wx.showModal({
                                                title: "微信支付", // 提示的标题
                                                content: '¥ '+money.toFixed(2), // 提示的内容
                                                showCancel: true, // 是否显示取消按钮，默认true
                                                cancelText: "取消支付", // 取消按钮的文字，最多4个字符
                                                cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
                                                confirmText: "确认支付", // 确认按钮的文字，最多4个字符
                                                confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
                                                success: function (res) {
                                                    if (res.confirm) { 
                                                        //*******************************************************存入历史记录 */   
                                                        wx.cloud.database().collection('history_data').add({
                                                            // data 字段表示需新增的 JSON 数据
                                                            data: { 
                                                                user_name: username,
                                                                start_time:start_time,
                                                                end_time:new Date().getTime(),
                                                                amount_money:money
                                                            }
                                                        })
                                                        .then(res => {
                                                            //成功的处理
                                                            console.log(res)
                                                        }).catch(err => {
                                                            //失败的处理
                                                        })
                                                        money=0
                                                        start_time=0
                                                        //*********************************************允许离开 */
                                                        wx.showToast({
                                                            title: "支付成功", // 提示的内容
                                                            icon: 'none', // 图标，默认success
                                                            image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                                                            duration: 3000, // 提示的延迟时间，默认1500
                                                            mask: false, // 是否显示透明蒙层，防止触摸穿透     
                                                        })
                                                        wx.setStorageSync('gate_flag', false)
                                                        wx.cloud.database().collection('now_data').where({
                                                            user_name:username
                                                        }).remove({
                                                            success: function(res) {
                                                                //发送leave开门消息
                                                                wx.sendSocketMessage({
                                                                    data: msg_gate,
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
                                                        })
                                                    } else if (res.cancel) {
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
                                                        console.log('用户取消支付了')
                                                    }
                                                },
                                            })
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
                            } else {
                                wx.showToast({
                                    title: "连接失败", // 提示的内容
                                    icon: 'none', // 图标，默认success
                                    image: "", // 自定义图标的本地路径，image 的优先级高于 icon
                                    duration: 3000, // 提示的延迟时间，默认1500
                                    mask: false, // 是否显示透明蒙层，防止触摸穿透     
                                })   
                            }
                        }  
                    }
                })
            }
        })
    }
})