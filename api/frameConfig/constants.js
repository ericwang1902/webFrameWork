module.exports = {
    role: {
        admin: 'ADMIN',//管理员的角色
        agent: 'AGENT'//区域代理
    },
    ficstatus: [
        { shop: '无', cust: '已下单' },
        { shop: '未取件', cust: '已接单' },
        { shop: '已取件', cust: '配送中' },
        { shop: '已送达', cust: '已送达' },
        { shop: "已结算", cust: "已送达" }
    ]
}