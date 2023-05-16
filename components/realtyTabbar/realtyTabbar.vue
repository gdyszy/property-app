<template>
    <view>
        <view class="navigationBar">
            <view class="eachTabbarItem" v-for="item in tabbarList" :key="item.index" @click="switchPage(item)">
                <image class="tabbarIcon" :src="currentIndex == item.index ? item.selectIconPath : item.iconPath"></image>
                <text :class="{'tabbarText':true,'active':currentIndex == item.index}">{{item.tabname}}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        currentIndex:{
            type:Number,
            default:0
        }
    },
    data(){
        return {
            tabbarList:[
                {
                    index:0,
                    tabname:'首页',
                    url:'/pages/index/index',
                    iconPath:'/static/images/index/btn_09_nor.png',
                    selectIconPath:'/static/images/index/btn_09_sel.png'
                },
                {
                    index:1,
                    tabname:'小区新闻',
                    url:'/pages/index/indexPage/notice/notice?title=小区新闻',
                    iconPath:'/static/images/index/mes.png',
                    selectIconPath:'/static/images/index/mes-active.png'
                },
                {
                    index:2,
                    tabname:'小区活动',
                    url:'/pages/index/indexPage/activities/activities',
                    iconPath:'/static/images/index/mes.png',
                    selectIconPath:'/static/images/index/mes-active.png'
                },
                // {
                //     index:3,
                //     tabname:'客服',
                //     url:'/pages/index/user-list/user-list',
                //     iconPath:'/static/images/index/mes.png',
                //     selectIconPath:'/static/images/index/mes-active.png'
                // },
                {
                    index:3,
                    tabname:'个人中心',
                    url:'/pages/index/my/index',
                    iconPath:'/static/images/index/btn_11_nor.png',
                    selectIconPath:'/static/images/index/btn_11_sel.png'
                }
            ]
        }
    },
    methods:{
		gologin() {
			uni.showModal({
                title: '提示信息',
                content: '请先登录',
                confirmText: '去登录',
                cancelText: '取消',
                confirmColor: '#16bcc7',
                cancelColor: "#262626",
                success(res) {
                    if (res.confirm) {
                        uni.navigateTo({
                            url: '/pages/index/login/index'
                        })
                    }
                }
            })
		},
        switchPage(item){
            if(this.currentIndex == item.index) return;
			
			uni.redirectTo({
				url:item.url
			})
        }
    }
}
</script>


<style lang="scss" scoped>
.navigationBar{
    width: 100%;
    height: calc(env(safe-area-inset-bottom) + 100rpx);
    background-color: #fff;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .eachTabbarItem{
        width: 120rpx;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .tabbarIcon{
            width: 60rpx;
            height: 60rpx;
        }
        .tabbarText{
            font-size: 25rpx;
            color: rgb(166,166,166);
        }
        .tabbarText.active{
            color: #38bbc5;
        }
    }
}

</style>