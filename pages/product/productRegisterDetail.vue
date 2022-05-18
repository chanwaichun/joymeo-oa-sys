<template>
  <view class="page-registerDetail">
    <view class="page-registerDetail-inner" v-if="productInfo">
      <view class="page-image u-flex-col u-col-center u-row-center">
        <CommonImage width="300rpx" height="300rpx" :src="productInfo.productImg"></CommonImage>
        <view class="u-m-t-28 u-font-36 word-break-all">{{productInfo.productName}}</view>
      </view>

      <view class="u-p-20 product-detail">
        <u-form :model="form" ref="uForm" label-width="200rpx">
          <u-form-item label="输入数量" prop="productNum">
            <u-input v-model="form.productNum" maxlength="6" type="number" placeholder="请输入数量" />
          </u-form-item>

          <view @click="clickAction('showTimeSelect')">
            <u-form-item label="备货时间" right-icon="arrow-right" prop="time">
              {{form.sellTime}}
              <u-picker
                :default-time="form.sellTime"
                :params="pickerOption"
                mode="time"
                v-model="showTimeSelect"
                @confirm="(params)=>callbackAction(params,'time')"
              ></u-picker>
            </u-form-item>
          </view>
          <view @click="clickAction('showCustomerSelect')">
            <u-form-item label="选择客户" right-icon="arrow-right" prop="customerId">
              <view
                class="word-break-all max-width-300"
              >{{form.customerName ?form.customerName : '请选择'}}</view>
              <u-select
                v-model="showCustomerSelect"
                label-name="text"
                mode="single-column"
                :list="customerList"
                @confirm="(params)=>callbackAction(params,'customer')"
              ></u-select>
            </u-form-item>
          </view>
          <view @click="clickAction('showCompanySelect')">
            <u-form-item label="选择商业公司" right-icon="arrow-right" prop="businessId">
              <view
                class="word-break-all max-width-300"
              >{{form.businessName ?form.businessName : '请选择'}}</view>
              <u-select
                v-model="showCompanySelect"
                label-name="text"
                mode="single-column"
                :list="companyList"
                @confirm="(params)=>callbackAction(params,'company')"
              ></u-select>
            </u-form-item>
          </view>
        </u-form>
      </view>
    </view>

    <fixed-btn>
      <u-button
        slot="right-button"
        style="width: 100%;"
        type="primary"
        shape="circle"
        @click="clickAction('save')"
      >保存</u-button>
    </fixed-btn>
  </view>
</template>

<script>
import formMixin from "../../mixins/formMixin.js";
import apiConfig from "../../config/apiConfig.js";
import util from "../../utils/util.js";
import CommonImage from "@/components/CommonImage/CommonImage.vue";
export default {
  components: {
    CommonImage,
  },
  mixins: [formMixin],
  data() {
    return {
      productInfo: null,
      customerList: [],
      companyList: [],
      rules: {
        productNum: [
          {
            required: true,
            message: "请输入货品数量",
            trigger: ["change"],
          },
          {
            validator: (rule, value, callback) => {
              return /^[1-9][0-9]*$/.test(value);
            },
            message: "请输入正确数量",
            trigger: ["blur", "change"],
          },
        ],
        customerId: [
          {
            required: true,
            message: "请选择客户",
            trigger: ["blur", "change"],
          },
        ],
        // businessId: [{
        // 	required: true,
        // 	message: '请选择商业公司',
        // 	trigger: ['blur', 'change']
        // }]
      },
      mode: "",

      showTimeSelect: false,
      showCustomerSelect: false,
      showCompanySelect: false,

      form: {
        productNum: "", //商品数量
        productName: "", //商品名称
        productPrice: "", //商品原价
        productId: "",
        businessId: "", //商业公司ID
        businessName: "",
        sellTime: this.$moment().format("YYYY-MM-DD hh:mm:ss"),
        customerId: "",
        customerName: "",
      },
      formValue: {
        customerName: "",
        businessName: "",
      },
      pickerOption: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: true,
      },
    };
  },
  onShow() {
    const { data } = util.getUrlParams();
    const productInfo = JSON.parse(data);
    const {
      productName,
      id: productId,
      purchasePrice: productPrice,
      customerName = "",
      customerId = "",
    } = productInfo;
    this.productInfo = productInfo;
    this.form = {
      ...this.form,
      productName,
      productId,
      productPrice,
      customerName,
      customerId,
    };
    this.getClinicForSales();
  },
  methods: {
    getClinicForSales() {
      let { staffId: id } = uni.getStorageSync("userInfo");
      this.$requestData(apiConfig.getClinicForSales, {
        id,
      }).then((res) => {
        this.customerList = res.data.map((item) => ({
          value: item.cid,
          text: item.clinicName,
        }));
      });
    },
    getSupplyCompanyList(callback) {
      this.$requestData(apiConfig.getSupplyCompanyList, {}).then((res) => {
        this.companyList = res.data.map((item) => ({
          value: item.id,
          text: item.companyName,
        }));
        callback && callback();
      });
    },
    productInsert() {
      let { staffId, trueName: staffName } = uni.getStorageSync("userInfo");
      let params = {
        ...this.form,
        productNum: Number(this.form.productNum),
        staffId,
        staffName,
      };

      this.$requestData(apiConfig.productInsert, params).then((res) => {
        uni.reLaunch({
          url: `/pages/product/productReport`,
        });
      });
    },
    callbackAction(params, type) {
      if (type === "time") {
        const { year, month, day, hour, minute, second } = params;
        const currentTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        if (this.$moment(currentTime).stamp() > this.$moment().stamp()) {
          this.$util.showToast({
            title: "备货时间不得晚于当前时间,请重新选择",
            icon: "none",
          });
        } else {
          this.form = {
            ...this.form,
            sellTime: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
          };
        }
      }
      if (type === "customer") {
        const [{ value, label: text }] = Array.from(params);

        this.form = {
          ...this.form,
          customerId: value,
          customerName: text,
        };
        this.formValue = {
          ...this.formValue,
          customerName: text,
        };
      }
      if (type === "company") {
        const [{ value, label: text }] = Array.from(params);

        this.form = {
          ...this.form,
          businessId: value,
          businessName: text,
        };
        this.formValue = {
          ...this.formValue,
          businessName: text,
        };
      }
    },
    clickAction(type) {
      if (type === "save") {
        this.onSubmit();
      } else if (type === "showTimeSelect") {
        this.mode = "time";
        this.showTimeSelect = true;
      } else if (type === "showCustomerSelect") {
        this.showCustomerSelect = true;
      } else if (type === "showCompanySelect") {
        this.getSupplyCompanyList(() => {
          this.showCompanySelect = true;
        });
      }
    },

    formSubmit() {
      this.productInsert();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-registerDetail {
  padding: 20rpx;
  height: 100vh;
  display: flex;
  background-color: #f7f7f7;

  .page-registerDetail-inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;

    .product-detail {
      flex: 1;
    }
  }
}

.page-image {
  height: 448rpx;
  padding: 20rpx;

  image {
    width: 320rpx;
    height: 246rpx;
  }
}
</style>
