// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'server-uko3f'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const id = event.id
  var success = true
  var result = ''
  try {
    const todo = db.collection('OpenIt_Record').doc(id)
    const res = await todo.get()
    const money = res.data.money
    const gratuity = res.date.gratuity
    result = calculateResult(money, gratuity)
    await todo.update({
      data: {
        // paid: true,
        result: result
      }
    })
  } catch(e) {
    success = false
  }

  return {
    success: success,
    result: result
  }
}

function calculateResult(money, gratuity) {
  var times = 1
  if (gratuity == 5 && (money + gratuity) >= 10) {
    times += 2
  } else if (gratuity == 5) {
    times += 1
  } else if (money + gratuity >= 8) {
    times += 1
  }
  const res = await db.collection('OpenIt_Result').orderBy('bonus', 'asc').get()
  const count = res.data.length
  var max = 0
  while(times > 0) {
    times -= 1
    var i = Math.random() * count
    if (i > max) {
      max = i
    }
    console.log(max)
  }
  return res.data[max]._id
}