//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    // 用户数据
    userInfo: {},
    hasUserInfo: false,
    addShow: false,
    // 添加的todo
    addText: '',
    // 默认的状态，也就是选择的栏
    status: '1',
    focus: false,
    // 总表
    lists: [],
    // 现在显示的表
    curLists: [],
    multiIndex: [0,0, 0, 0, 0, 0],
    multiArray: [],
    year: "",
    month: "",
    day: "",
    startHour: "",
    endHour: "",
    orderData: "选择预约时间",
    editIndex: 0,
    delBtnWidth: 120, // 删除按钮宽度单位（rpx）
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  surplusMonth: function (year) {
    var date = new Date();
    var year2 = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var monthDatas = [];
    if (year == year2) {
      var surplusMonth = 12 - month;
      monthDatas.push(month + "月")
      for (var i = month; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    } else {
      for (var i = 0; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    }

    return monthDatas;
  },
  surplusDay: function (year, month, day) {
    var days = 31;
    var dayDatas = [];
    var date = new Date();
    var year2 = date.getFullYear()
    var month2 = date.getMonth() + 1

    switch (parseInt(month)) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        days = 31;

        break;
      //对于2月份需要判断是否为闰年
      case 2:
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
          days = 29;

          break;
        } else {
          days = 28;

          break;
        }

      case 4:
      case 6:
      case 9:
      case 11:
        days = 30;

        break;

    }
    if (year == year2 && month == month2) {
      dayDatas.push(day + "日")
      for (var i = day; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    } else {
      console.log(month + "月" + days + "天")
      for (var i = 0; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    }
    return dayDatas;
  },
  surplusHour: function (year, month, day, hour) {
    var date = new Date();
    var year2 = date.getFullYear()
    var month2 = date.getMonth() + 1
    var day2 = date.getDate();
    var hourEnd = [4, 8, 12, 16, 20, 24];
    var hours = [['00时', '04时', '08时', '12时', '16时', '20时'], ['04时', '08时', '12时', '16时', '20时', '24时']];

    if (year == year2 && month == month2 && day == day2) {
      var hour2 = hour
      var j = 0;
      for (var i = 0; i < hourEnd.length; i++) {
        console.log("离24点还" + (hourEnd[i] - hour))
        if ((hourEnd[i] - hour) > 0) {
          console.log("i" + i)
          j = i;
          break;
        }
      }
      var surplusHours = [[], []];
      for (var i = j; i < hours[0].length; i++) {
        console.log(hours[0][i])
        surplusHours[0].push(hours[0][i]);
      }
      for (var i = j; i < hours[1].length; i++) {
        console.log(hours[1][i])
        surplusHours[1].push(hours[1][i]);
      }

      hours = surplusHours;
    }
    return hours;
  },

  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
   * 改变todo的状态
   */
  changeTodo: function (e) {
    var _this = this
    var item = e.currentTarget.dataset.item
    var temp = _this.data.lists
    temp.forEach(el => {
      if (el.id === item) {
        if (el.status === '0') {
          el.status = '1'
          _this.showCur(temp)
          wx.setStorage({
            key:"lists",
            data: temp
          })
          wx.showToast({
            title: '已完成任务',
            icon: 'success',
            duration: 1000
        });
        } else {
          // 交互提示框
          wx.showModal({
            title: '',
            content: '该任务已完成，确定重新开始任务？',
            confirmText: "确定",
            cancelText: "不了",
            success: function (res) {
                if (res.confirm) {
                  el.status = '0'
                  _this.showCur(temp)
                  wx.setStorage({
                    key:"lists",
                    data: temp
                  })
                }else{
                  return console.log('不操作')
                }
            }
          })
        }
      }
    })
    console.log(item)
  },
  /**
   * 点击添加todo按钮
   * ok
   */
  addTodoShow: function () {
    this.setData({
      // 弹出添加框
      addShow: true,
      // 输入框聚焦
      focus: true
    })
  },
  /**
   * 将显示的输入框隐藏
   */
  addTodoHide: function () {
    this.setData({
      addShow: false,
      focus: false,
      addText: '',
      year: "1999",
      month: "",
      day: "",
      startHour: "",
      endHour: ""
    })
  },
  // 设置输入框的输入
  setInput: function (e) {
    this.setData({
      addText: e.detail.value
    })
    console.log(e.detail.value);
  },
  /**
   * 添加一个todo
   */
  addTodo: function () {
    // 如果输入没有内容
    if (!this.data.addText.trim()) {
      // 输出提示信息，有success，laoading和none
      wx.showToast({
        title: '请输入内容!',
        icon: 'none',
        duration: 1000
      });
      return
    }
    // 所有的todo
    var temp = this.data.lists
    // 添加一个新的设title为输入，且state为0
    var addT = {
      id: new Date().getTime(),
      title: this.data.addText,
      status: '0'
    }
    temp.push(addT)
    // 将所有的todo传入
    this.showCur(temp)
    //隐藏我的todo框
    this.addTodoHide()
    wx.setStorage({
      key:"lists",
      data: temp
    })
    wx.showToast({
      title: '添加成功!',
      icon: 'success',
      duration: 1000
    });
  },
  // 显示现在选择的这个栏
  // 参数data: 得到的是当前的所有todo
  showCur: function (data) {
    // 也就是我当前选择的是all栏，显示所有的数据
    if (this.data.status === '1') {
      this.setData({
        lists: data,
        curLists: data
      })
    } else {
      this.setData({
        lists: data,
        // 筛选在data里面符合的数据
        /**
         * 当status为2
         * this.data.status-2=0,也就是现在还没有做的这些todo
         * 
         * 当status为3
         * this.data.status-2=1,也就是已经完成了的todo
         */
        curLists: data.filter(item => +item.status === (this.data.status - 2))
      })
    }
  },
  /**
   * 点击all，或者点击todo，或者点击finish
   */
  showStatus: function (e) {
    // 获取自定义属性data-status
    var st = e.currentTarget.dataset.status
    // 如果现在显示栏的status就是点击的status，则返回
    if (this.data.status === st) return
    // 如果st为all
    if (st === '1') {
      this.setData({
        status: st,
        curLists: this.data.lists
      })
      return
    }
    // 如果不是all
    this.setData({
      status: st,
      curLists: this.data.lists.filter(item => +item.status === (st - 2))
    })
  },
  /**
   * 开始触摸
   */
  touchS: function (e) {
     console.log('开始：' )
    // 是否只有一个触摸点
    if(e.touches.length === 1){
      this.setData({
        // 触摸起始的X坐标
        startX: e.touches[0].clientX
      })
    }
  },
  touchM: function (e) {
     console.log('移动：' )
    var _this = this
    if(e.touches.length === 1){
     // 触摸点的X坐标
      var moveX = e.touches[0].clientX
      // 计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = _this.data.startX - moveX
     // delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = _this.data.delBtnWidth
      var txtStyle = ''
      if (disX == 0 || disX < 0){ // 如果移动距离小于等于0，文本层位置不变
        txtStyle = 'left:0'
      } else if (disX > 0 ){ // 移动距离大于0，文本层left值等于手指移动距离
        txtStyle = 'left:-' + disX + 'rpx'
        if(disX >= delBtnWidth){
          // 控制手指移动距离最大值为删除按钮的宽度
          txtStyle = 'left:-' + delBtnWidth + 'rpx'
        }
      }
      // 获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = _this.data.curLists
      // 将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle
      // 更新列表的状态
      this.setData({
        curLists: list
      });
    }
  },
  touchE: function (e) {
     console.log('停止：' )
    var _this = this
    if(e.changedTouches.length === 1){
      // 手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX
      // 触摸开始与结束，手指移动的距离
      var disX = _this.data.startX - endX
      var delBtnWidth = _this.data.delBtnWidth
      // 如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth/2 ? 'left:-' + delBtnWidth + 'rpx' : 'left:0'
      // 获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index
      var list = _this.data.curLists
      list[index].txtStyle = txtStyle
      // 更新列表的状态
      _this.setData({
        curLists: list
      });
    }
  },
  delTodo: function (e) {
    var _this = this
    var item = e.currentTarget.dataset.item
    var temp = _this.data.lists
    temp.forEach( (el, index) => {
      if (el.id === item) {
        temp[index].txtStyle = 'left:0'
        wx.showModal({
          title: '',
          content: '您确定要删除吗？',
          confirmText: "确定",
          cancelText: "考虑一下",
          success: function (res) {
            if (res.confirm) {
                temp.splice(index, 1)
                _this.showCur(temp)
                wx.setStorage({
                  key:"lists",
                  data: temp
                })
            } else {
                _this.showCur(temp)
                return console.log('不操作')
              }
          }
        })
      }
    })
    
  },
  /**
   * 页面一进入时
   */
  onLoad: function () {
    var _this = this
    // 获取现在的时间
    var date = new Date();
    var year = date.getFullYear()
    // 因为是从0开始的
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()


    var surplusMonth = this.surplusMonth(year);
    console.log(surplusMonth)
    var surplusDay = this.surplusDay(year, month, day);
    console.log(surplusDay)
    var surplusHour = this.surplusHour(year, month, day, hour)
    console.log(surplusHour)

    this.setData({
      multiArray: [[year + '年', (year + 1) + '年', (year + 2) + '年'],
        surplusMonth,
        surplusDay,
      surplusHour[0],
      ['~'],
      surplusHour[1]
      ],
      year: year,
      month: month,
      day: day,
      startHour: surplusHour[0][0],
      endHour: surplusHour[1][0],
    })
    // 获取缓存，包括所有的todo
    wx.getStorage({
      key: 'lists',
      success: function(res) {
        console.log(res.data)
        _this.setData({
          lists: res.data,
          curLists: res.data
        })
      } 
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  bindMultiPickerColumnChange: function (e) {
    var date = new Date();
    var year1 = date.getFullYear()
    var month1 = date.getMonth() + 1
    var day1 = date.getDate()
    var hour1 = date.getHours()
    console.log("当前年份" + this.data.month + '修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      year: this.data.year,
      month: this.data.month,
      day: this.data.day,
      startHour: this.data.startHour,
      endHour: this.data.startHour,
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        var yearStr = data.multiArray[e.detail.column][e.detail.value];
        var year = yearStr.substring(0, yearStr.length - 1)
        data.year = parseInt(year);
        var surplusMonth = this.surplusMonth(year);
        data.multiArray[1] = surplusMonth;

        if (data.year == year1) {
          data.month = month1;
        } else {
          data.month = 1;
        }
        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }

        var surplusDay = this.surplusDay(data.year, data.month, data.day);

        data.multiArray[2] = surplusDay;
        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)
        }

        console.log(surplusHour)

        data.multiArray[3] = surplusHour[0];
        data.multiArray[5] = surplusHour[1];


        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[5] = 0;
        break;
      case 1:
        console.log('选择月份' + data.multiArray[e.detail.column][e.detail.value]);

        var monthStr = data.multiArray[e.detail.column][e.detail.value];
        var month = monthStr.substring(0, monthStr.length - 1);

        data.month = month;
        data.day = 1;

        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }

        var surplusDay = this.surplusDay(data.year, data.month, data.day);

        data.multiArray[2] = surplusDay;

        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)
        }


        data.multiArray[3] = surplusHour[0];
        data.multiArray[5] = surplusHour[1];


        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[5] = 0;
        break;
      case 2:
        console.log('选择日' + data.multiArray[e.detail.column][e.detail.value]);
        var dayStr = data.multiArray[e.detail.column][e.detail.value];
        var day = dayStr.substring(0, dayStr.length - 1);
        data.day = day;

        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)
        }


        data.multiArray[3] = surplusHour[0];
        data.multiArray[5] = surplusHour[1];



        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];

        data.multiIndex[3] = 0;
        data.multiIndex[5] = 0;
        break;
      case 3:
        console.log('起始时间' + data.multiArray[e.detail.column][e.detail.value]);

        var hourStr = data.multiArray[e.detail.column][e.detail.value];
        var hour = hourStr.substring(0, hourStr.length - 1);
        data.startHour = hour;
        console.log('起始时间' + hour);
        var endhours2 = [];
        if (data.year == year1 && data.month == month1 && data.day == day1) {
          var surplusHour = this.surplusHour(data.year, data.month, data.day, hour);
          endhours2 = surplusHour[1]
        } else {
          var end = ['04时', '08时', '12时', '16时', '20时', '24时'];
          for (var i = e.detail.value; i < end.length; i++) {
            endhours2.push(end[i]);
          }
        }


        data.multiArray[5] = endhours2;
        data.multiIndex[5] = 0;

        break;
      case 5:
        var hourStr = data.multiArray[e.detail.column][e.detail.value];
        var hour = hourStr.substring(0, hourStr.length - 1);
        data.endHour = hour;
        console.log('结束时间' + data.multiArray[e.detail.column][e.detail.value]);
        break;
    }
    this.setData(data)

  },
  bindMultiPickerChange: function (e) {

    var dateStr =
      this.data.multiArray[0][this.data.multiIndex[0]] +
      this.data.multiArray[1][this.data.multiIndex[1]] +
      this.data.multiArray[2][this.data.multiIndex[2]] +
      this.data.multiArray[3][this.data.multiIndex[3]] +
      this.data.multiArray[4][this.data.multiIndex[4]] +
      this.data.multiArray[5][this.data.multiIndex[5]];
    console.log('picker发送选择改变，携带值为', dateStr)
    this.setData({
      orderData: dateStr
    })
  },
  // 获取用户信息
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
