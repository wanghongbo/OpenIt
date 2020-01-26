// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'server-uko3f'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var pwd = event.pwd
  // -1： 无权限 0：普通用户 1：管理员
  var access = -1
  try {
    const res = await db.collection("OpenIt_Access").doc("34ac655c-d41a-485a-b3c8-1063ab613751").get()
    if (res.data.managerPwd == pwd) {
      access = 1
    } else if (res.data.userPwd == pwd) {
      access = 0
    } else {
      access = -1
    }
  } catch(e) {
    //
  }

  return {
    access: access
  }
}