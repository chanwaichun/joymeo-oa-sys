<!-- 货款详情 -->
<template>
  <view class="page-productDetail common-container-bottom">
    <view class="page-header">
      <view class="header-title">{{urlParams.customerName||''}}</view>
      <view class="header-content">
        <view class="content-item">
          <view class="item-name">货数累计</view>
          <view
            class="item-value"
          >{{isNaN(productCountInfo.totalNum)||productCountInfo.totalNum===null?'-':productCountInfo.totalNum}}</view>
        </view>
        <view class="content-item item-border-around">
          <view class="item-name">货款累计</view>
          <view
            class="item-value"
          >￥{{isNaN(productCountInfo.totalNum) || productCountInfo.totalNum===null?'-':productCountInfo.totalPrice}}</view>
        </view>
        <view class="content-item">
          <view class="item-name">最新登记</view>
          <view
            class="item-value"
          >{{productCountInfo.lastSignTime ? $moment(productCountInfo.lastSignTime).format('YYYY-MM-DD hh:mm:ss'):'--'}}</view>
        </view>
      </view>
    </view>
    <view class="page-container">
      <view v-for="(monthItem,index) in productList" :key="index">
        <!-- <u-gap height="20" bg-color="#F7F7F7"></u-gap> -->

        <view class="page-content">
          <view class="content-everyMonth">
            <view class="content-detail">
              <view class="detail-time">{{monthItem.monthNum}}月</view>
              <view class="u-flex">
                <view class="u-flex detail-number">
                  <view class="detail-target-grey">送货数量:</view>
                  <view class="detail-value-dark">{{monthItem.totalNum}}</view>
                </view>
                <view class="u-flex">
                  <view class="detail-target-grey">货款:</view>
                  <view class="detail-value-dark">￥{{monthItem.totalPrice}}</view>
                </view>
              </view>
            </view>
            <view v-if="monthItem.paymentReportingVoList.records.length > 0">
              <u-cell-group :border="false">
                <u-cell-item
                  v-for="(productItem,productIndex) in monthItem.paymentReportingVoList.records"
                  :key="productIndex"
                  :arrow="false"
                  :style="{alignItems:'flex-start'}"
                  :value-style="{color:'#00CCA0',fontWeight:'bold'}"
                  :title-style="{color:'#000000',fontWeight:'bold',fontSize:'34rpx'}"
                  :label-style="{color:'#999999',fontSize:'24rpx',fontWeight:'normal'}"
                >
                  <view slot="title">
                    <view class="word-break-all max-width-500">{{productItem.productName}}</view>
                  </view>
                  <view slot="value">X{{productItem.productNum}}</view>
                  <view slot="label">
                    <view>登记时间：{{productItem.createTime}}</view>
                    <view>货物总额：￥{{productItem.totalPrice}}</view>
                    <view>商业公司：{{productItem.businessName||'-'}}</view>
                    <view v-if="productItem.abolishStatus" class="label-abolishStatus">已废除</view>
                  </view>
                </u-cell-item>
              </u-cell-group>
            </view>
            <page-empty emptyType="card" v-else></page-empty>
          </view>
        </view>
      </view>
    </view>
    <fixed-btn>
      <u-button
        slot="right-button"
        style="width: 100%;"
        type="primary"
        shape="circle"
        @click="clickAction($event,'add')"
      >新增</u-button>
    </fixed-btn>
  </view>
</template>

<script>
import apiConfig from "../../config/apiConfig.js";
export default {
  data() {
    return {
      productList: [],
      productCountInfo: {},
      urlParams: {
        totalNum: "",
        lastSignTime: "",
      },
      params: {
        yearNum: "", //年份
        monthNum: "", //月份
        pageNum: 1,
        pageSize: 5000,
      },
    };
  },
  onShow() {
    this.urlParams = this.$util.getUrlParams();
    this.productList = [];
    // 默认设置为本年本月数据
    this.params.monthNum = Number(this.$moment().format("MM"));
    this.params.yearNum = Number(this.$moment().format("YYYY"));
    this.getProductDetail();
    this.productGetCountDetail();
  },
  onReachBottom() {
    // 小于等于零返回上一年的12月份
    if (this.params.monthNum - 1 <= 0) {
      this.params.monthNum = 12;
      this.params.yearNum -= 1;
    } else {
      this.params.monthNum -= 1;
    }
    this.getProductDetail();
  },
  methods: {
    productGetCountDetail() {
      const { staffId } = uni.getStorageSync("userInfo");
      const { customerId } = this.urlParams;
      this.$requestData(apiConfig.productGetCountDetail, {
        staffId,
        customerId,
      }).then(({ data }) => {
        this.productCountInfo = data;
      });
    },
    getProductDetail() {
      const { staffId } = uni.getStorageSync("userInfo");
      const { customerId } = this.urlParams;
      const params = {
        ...this.params,
        staffId,
        customerId,
      };
      this.$requestData(apiConfig.productGetDetail, params).then(({ data }) => {
        this.productList.push(data);
      });
    },
    clickAction(e, type) {
      if (type === "add") {
        let paramsString = this.$util.paramsObjectToString(this.urlParams);
        uni.navigateTo({
          url: `/pages/product/productRegister${paramsString}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-productDetail {
  position: relative;
  min-height: 100vh;

  .page-header {
    background-color: #4975c0;

    .header-title {
      padding: 20rpx;
      color: #ffffff;
      font-size: 36rpx;
    }

    .header-content {
      padding: 36rpx 0rpx;
      color: #ffffff;
      font-size: 36rpx;
      display: flex;
      justify-content: space-around;

      .content-item {
        flex: 1;

        &.item-border-around {
          border-left: 2px solid #345a9a;
          border-right: 2px solid #345a9a;
        }

        .item-product-name {
          font-weight: bold;
        }

        .item-name {
          text-align: center;
          font-size: 30rpx;
          margin-bottom: 18rpx;
        }

        .item-value {
          color: #d9e7ff;
          text-align: center;
          font-size: 24rpx;
        }
      }
    }
  }

  .page-content {
    .label-abolishStatus {
      font-weight: bold;
      color: red;
      margin-bottom: 6rpx;
    }

    .content-everyMonth {
      min-height: 100vh;

      .content-detail {
        padding: 30rpx 20rpx;

        .detail-time {
          color: #1a1a1a;
          font-size: 36rpx;
          font-weight: bold;
          margin-bottom: 21rpx;
        }

        .detail-number {
          margin-right: 86rpx;
        }

        .detail-target-grey {
          color: #999999;
        }
      }
    }
  }
}
</style>
