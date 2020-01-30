// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'server-uko3f'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await db.collection('OpenIt_Record').aggregate().lookup({
    from: 'OpenIt_Result',
    localField: 'resultId',
    foreignField: '_id',
    as: 'result',
  }).end()

  const list = res.list
  var sumPayment = 0.0
  var sumBonus = 0.0
  for (i = 0; i < list.length; i++) {
    const record = list[i]
    sumPayment += record.money + record.gratuity
    const result = record.result
    if (result.length > 0) {
      sumBonus += result[0].bonus
    }
  }

  return {
    sumPayment: sumPayment,
    sumBonus: sumBonus
  }
}