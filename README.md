<h1> 智慧家园业主版 </h1>

# 产品简介


多小区物业管理系统APP能够覆盖小区业主日常生活遇到的多个场景，如：物业费缴费、停车费缴纳、家庭成员管理、故障报修及进度查询、小区通知公告、二手商品交易。帮小区业主轻松解决日常问题。一个APP在手，生活无“忧”。
目前APP已实现功能有：
1. 登录及注册：登录类型选择
2. 首页：首页、通知公告、生活缴费、家庭成员、故障报修；签到活动；投票管理；门禁人脸
3. 市场：旧货出售、求购需求；
4. 小区活动;
5. 我的：我的、个人资料信息、物业信息、我的交易、我的报修单、消息、住户绑定、意见反馈、我的意见、物业客服、技术支持、版本号、登出。
6. 物业管理：报修管理、投诉管理、值班管理、消息管理

缴费便捷：通过多小区物业管理系统APP即可便捷缴交物业费、停车费等费用。

报修便捷：通过多小区物业管理系统APP即可便捷进行物业报修，进度查询等。

功能截图

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_28229a51e024854202f4d20e7b314f7e_r.jpg)

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_89af47ad4891cf036972a51dc6343fc3_r.jpg)

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_8aea90a345cdc046ab4f0179682dd320_r.jpg)

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_5876456eb69a7f230ee2946564539e16_r.jpg)

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_a978e3e157da213b173e0b9b9552b50c_r.jpg)


![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_0105a861241d01a7b8832629146636a9_r.jpg)


信息便捷：小区费用公开、小区文化、社区新闻等等信息尽在“掌”握。让您随时能够了解到小区的情况。

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_48d84a9e559c2d4aa0f5120fde9b57a8_r.jpg)

交易便捷：在APP上即可轻松、便捷进行商品交易，能够使闲置物品变现，更好地满足生活需要，充分利用资源，节约资源，减少垃圾和污染物的排放，保护环境，促进社会经济的可持续发展。

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_5d3bdc854098abbcec368ecf7824fc62_r.jpg)

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_4b70b31c9a192cb9024b3138599d6de6_r.jpg)

查询便捷：商品交易情况、报修情况、物业情况等一目了然。

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_fa96a4e4343239461dd62d4bdfa568e6_r.jpg)

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_157f1ced096d9f63a8afdfea3bf67770_r.jpg)

# 产品优势

产品前端采用uni-App开发，实现App（iOS，Android）、微信小程序、H5 多平台部署运营。


# 产品功能
管理后台：
1. 统计分析
2. 新闻管理
3. 新闻分类管理
4. 版本管理
5. 轮播图
6. 小区管理
7. 房产信息管理
8. 业主信息管理
9. 停车位管理
10. 服务管理
11. 收费管理：物业费管理-缴费收据 打印(新增)
12. 值班管理
13. 权限管理
14. 系统配置
15. 签到管理
16. 投票管理
17. 访客登记
18. 新增 财务报表：收费明细表、缴费清单、欠费明细表


# 产品演示

管理后台 [http://wy.yszyun.com](http://wy.yszyun.com)

账号：admin5
密码：123456

前端
H5版本  [https://wy.yszyun.com/h5/#/](https://wy.yszyun.com/h5/#/)

H5 版本二维码

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_2af2ac380ce7c2aa2368714572a3157b_r.png)


小程序版本

![](https://wiki.yszyun.com/uploads/yszyun-property-app/images/m_8cdb04aee9242d5368c8e57ad29889e6_r.jpg)

# 目录结构
```
├── common                  公共样式
├── components              组件资源
├── pages                   前端页面
├── App.vue                 全局生命周期和全局样式配置
├── manifest.json           应用配置
├── main.js                 vue初始化入口，接口配置地址
├── pages.json              配置页面路由
└── README.md               说明文档 
```

# 安装步骤
* 复制源码到新建的项目
* 创建或选择云服务空间,进入manifest.json可视化重新获取appid
* 使用HBuilderx运行到手机或微信开发者工具

以上方法都是基于[HBuilderX工具开发](https://uniapp.dcloud.io/quickstart?id=_1-%e9%80%9a%e8%bf%87-hbuilderx-%e5%8f%af%e8%a7%86%e5%8c%96%e7%95%8c%e9%9d%a2)的方法

# 修改文章id
* 用户协议、 需要修改id ， 在 pages/login/index 页面 大概20行， pages/addBer/addBer 页面 大概69行 ，pages/my/boundUSER 页面 大概114行
* 找到 'onDetails(5'， 将5 修改为后台录入用户协议文章对应的id ,'onDetails(6' 将6 修改为后台录入隐私保护文章对应的id

扫码添加技术微信支持，备注说明对应的插件名称

![](https://wiki.yszyun.com/uploads/moa-admin/images/m_a3639d790e5a0b1f9d1a1dd5e695894c_r.png)


前端免费开源，后端付费，详情咨询电话： 400-008-1668
邮箱：marketing@yszyun.com