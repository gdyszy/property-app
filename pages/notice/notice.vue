<template>
  <view>
    <SwiperTabHead :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap" />
    <view class="uni-tab-bar">
      <view class="swiper-box">
        
        <view class="list">
          <template v-if="list.length > 0">
            <ListItem :list="list" @noticeDetail="noticeDetail" :statu="statu" />
            <uni-load-more :status="status" :content-text="contentText" />
          </template>
          <template v-else>
            <view class="nothingImg">
              <image src="/static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%"></image>
            </view>
            <view class="nothing">没有数据</view>
          </template>
        </view>
      </view>
    </view>
	 </view>
</template>

<script>
import SwiperTabHead from '@/components/common/swiper_tab_head_tow.vue';
import ListItem from '@/components/index/list_item.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
  components: {
    SwiperTabHead,
    ListItem,
    uniLoadMore  },
  data() {
    return {
      title:'',
      statu: 1,
      swiperheight: 500,
      tabBars: [],
      tabIndex: 0,
      classId: 0,
      list: [],
      page: 1,
      scrollTop: 0,
      status: 'more',
      contentText: {
        contentdown: '上拉加载更多',
        contentrefresh: '',
        contentnomore: '没有更多',
      },
      stopRequsetData:false
    };
  },
  onLoad(option) {
    this.title = option.title;
    uni.setNavigationBarTitle({
				title:option.title
			})
    if(this.list.length > 0){
      this.status = 'more'
    }
    uni.getSystemInfo({
      success: (res) => {
        let height = res.windowHeight - uni.upx2px(100);
        this.swiperheight = height;
      },
    });
    this.getTabBars();
  },
  onReachBottom(){
    this.getList(this.classId)
  },
  methods: {
    // tabbar点击事件
    tabtap(index, id) {
      if(index == this.tabIndex) return
      this.tabIndex = index;
      this.classId = id;
      this.tabChange();
    },
    // 左右滑动事件
    tabChange() {      
      this.page = 1
      this.list = []
      this.stopRequsetData = false
      this.getList(this.classId)
      
    },
    //点击进入详细
    noticeDetail(id) {
      uni.navigateTo({
        url: `../noticeDetail/noticeDetail?id=${id}&title=${this.title}`
      });
    },
    //获取分类
    getTabBars() {
      this.request({
        url: '/v1/notices_classify',
        method: 'GET',
      }).then((res) => {
		this.tabBars=res.data;
        this.classId = this.tabBars[this.tabIndex].id;
        for (let t of this.tabBars) {
          t['ed'] = true;
        }
		console.log("this.tabBars:"+JSON.stringify(this.tabBars))
        this.getList(this.classId);
      });
    },
    //获取列表
    getList(id) {
      if(this.stopRequsetData) return
      this.request({
        url: '/v1/notices',
        method: 'GET',
        data: {
          'filter[classify_id]': id,
          page: this.page,
          limit: 10,
        },
      }).then((res) => {
        if (id == this.tabBars[this.tabIndex].id) {
          this.tabBars[this.tabIndex].ed = true;
        }
        let data = res.data.data;
		this.list=data;
        if(res.data.data.length == 0){
            this.status = 'noMore'
            this.stopRequsetData = true
        }else{
            this.status = 'more'
            this.stopRequsetData = false
            this.page++
        }

      });
    }
  },
};
</script>

<style lang="scss" scoped>
	.uni-tab-bar {
	/* 	display: flex;
		flex: 1; */
		flex-direction: column;
		overflow: hidden;
		height: 100%;
		.swiper-box {
		flex: 1;
		width: 100%;
		height: calc(100% - 100upx);
		}
		.list {
			width: 750upx;
			height: 100%;
		}
	}
	.nothing{
		color: #B3B3B3;
		width: 100%;
		height: 30rpx;
		text-align: center;
		padding: 20rpx 0;
	}
</style>