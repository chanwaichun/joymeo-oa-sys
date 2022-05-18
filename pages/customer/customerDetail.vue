<template>
  <view class="page-customerDetail common-container-bottom">
    <!-- 弹窗上传合同弹窗 -->
    <u-top-tips ref="uTips"></u-top-tips>
    <u-modal
      :async-close="true"
      v-model="modalShow"
      z-index="900"
      :show-cancel-button="true"
      cancel-color="#999999"
      :title-style="{ fontSize: '40rpx', fontWeight: 'bold' }"
      :max-size="5 * 1024 * 1024"
      ref="uModal"
      confirm-color="#1A1A1A"
      confirm-text="确定"
      title="上传合同"
      @cancel="modalAction($event, 'cancel')"
      @confirm="modalAction($event, 'confirm')"
    >
      <u-upload
        :file-list="fileList"
        name="multipartFile"
        :customBtn="true"
        ref="uUpload"
        width="160"
        height="160"
        :action="action"
        max-count="1"
        :before-upload="beforeUpload"
        @onSuccess="onSuccess"
        @onError="onError"
        @onRemove="onRemove"
      >
        <view slot="addBtn" class="content-logo">
          <image
            src="https://static.joymeohis.com/wx/gongzonghao/image/camera_2x.png"
          ></image>
        </view>
      </u-upload>
    </u-modal>
    <view class="page-header">
      <view class="header-time">
        <view class="time-end"
          >截止时间：<text class="time-end-detail"
            >{{ urlParams.remainingDays || "-" }}天</text
          >
        </view>
        <view
          v-if="form.circulationStatus && form.circulationStatus !== 'coop'"
          class="time-last"
        >
          最后跟进：{{
            urlParams.punchClockFollow === "null"
              ? "-"
              : urlParams.punchClockFollow
          }}
        </view>
      </view>
      <view class="header-steps">
        <u-steps
          :list="numList"
          active-color="#1D4393"
          mode="number"
          :current="getCurrentStep(this.form.circulationStatus)"
        ></u-steps>
      </view>
    </view>
    <u-gap height="20" bg-color="#F7F7F7"></u-gap>
    <card card-title="诊所信息">
      <u-cell-group :border="false">
        <u-cell-item
          v-for="(item, index) in basicInfo"
          :key="index"
          :title="getFieldAttribute(item, 'name')"
          :value="getValueFromConfig(item, form[item])"
          :padding="cellItemPadding"
          :border-top="false"
          :arrow="false"
        >
        </u-cell-item>
      </u-cell-group>
    </card>
    <u-gap height="20" bg-color="#F7F7F7"></u-gap>
    <card card-title="医生信息">
      <u-cell-group :border="false">
        <u-cell-item
          v-for="(item, index) in doctorInfo"
          :key="index"
          :title="getFieldAttribute(item, 'name')"
          :value="getValueFromConfig(item, form[item])"
          :padding="cellItemPadding"
          :border-top="false"
          :arrow="false"
        >
        </u-cell-item>
      </u-cell-group>
    </card>
    <u-gap height="20" bg-color="#F7F7F7"></u-gap>
    <card card-title="诊所核心信息">
      <u-cell-group :border="false">
        <u-cell-item
          v-for="(item, index) in coreInfo"
          :key="index"
          :title="getFieldAttribute(item, 'name')"
          :value="getValueFromConfig(item, form[item])"
          :padding="cellItemPadding"
          :border-top="false"
          :arrow="false"
        >
        </u-cell-item>
      </u-cell-group>
    </card>
    <fixed-btn>
      <u-button
        v-if="
          form.circulationStatus === 'quot' ||
          form.circulationStatus === 'medi' ||
          form.circulationStatus === 'cont'
        "
        slot="left-button"
        type="success"
        style="width: 200rpx"
        shape="circle"
        @click="buttonClick($event, 'uploadFile')"
        >上传合同
      </u-button>
      <u-button
        slot="right-button"
        type="primary"
        style="width: 470rpx"
        shape="circle"
        @click="buttonClick($event, 'updateInfo')"
        >修改</u-button
      >
    </fixed-btn>
  </view>
</template>

<script>
import Card from "../../components/Card/Card.vue";
import FixedBtn from "../../components/FixedBtn/FixedBtn.vue";
import fieldMap from "@/fieldMap/fieldNormal.js";
import selectConfig from "../../config/selectConfig.js";
import apiConfig from "../../config/apiConfig.js";
import util from "../../utils/util.js";

export default {
  components: {
    card: Card,
    "fixed-btn": FixedBtn,
  },
  onShow() {
    this.urlParams = util.getUrlParams();
    // 判断是否有cid这个参数
    if (this.urlParams.hasOwnProperty("cid")) {
      this.getCustomerDetail(this.urlParams.cid);
    }
  },
  data() {
    return {
      modalShow: false,
      fileList: [],
      // url参数
      action: `${
        this.$global[`${this.$global.mode}Address`]
      }/pub-biz-base/file/upload`,
      urlParams: {},
      numList: [
        {
          name: "验证客户",
          value: "veri",
        },
        {
          name: "方案报价",
          value: "quot",
        },
        {
          name: "签订合同",
          value: "cont",
        },
        {
          name: "开展合作",
          value: "coop",
        },
      ],
      basicInfo: [
        "clinicName",
        "address",
        "doctorNumber",
        "assistantNumber",
        "relationship",
      ],
      doctorInfo: [
        "majorDoctor",
        "gender",
        "age",
        "operationYears",
        "telPhone",
        "phoneBrand",
        "usedApp",
      ],
      coreInfo: [
        "buildRoom",
        "clinicArea",
        "rent",
        "annualIncome",
        "runningTime",
        "inboundChannel",
        "supervisionDepartment",
        "certification",
        "busySeason",
        "paymentWay",
        "cooperate",
      ],
      form: {
        // 诊所基本信息
        clinicName: "",
        clinicDistrict: "",
        address: "",
        lat: "",
        lng: "",
        doctorNumber: "",
        assistantNumber: "",
        relationship: "",
        // 医生基本信息
        majorDoctor: "",
        gender: "",
        age: "",
        operationYears: "",
        telPhone: "",
        phoneBrand: "",
        usedApp: "",
        // 诊所核心信息
        buildRoom: "",
        clinicArea: "",
        rent: "",
        annualIncome: "",
        runningTime: "",
        inboundChannel: "",
        supervisionDepartment: "",
        certification: "",
        busySeason: "",
        paymentWay: "",
        cooperate: "",
      },
      currentUploadUrl: null,
      cellItemPadding: "24rpx 0px",
    };
  },
  methods: {
    beforeUpload() {
      uni.showLoading({
        title: "图片上传中",
      });
    },
    onSuccess(data, index, lists, name) {
      uni.hideLoading();
      this.currentUploadUrl = data.data;
      this.$refs.uTips.show({
        title: "上传成功",
        type: "success",
        duration: "2300",
      });
    },
    onError() {
      uni.hideLoading();
      this.$refs.uTips.show({
        title: "上传失败",
        type: "error",
        duration: "2300",
      });
    },
    onRemove() {
      this.currentUploadUrl = null;
    },
    getCustomerDetail(cid) {
      this.$requestData(apiConfig.customerGetDetail, {
        cid,
      }).then(({ data }) => {
        this.form = {
          ...this.form,
          ...data,
        };
        if (data.contractUrl) {
          this.currentUploadUrl = data.contractUrl;
          this.fileList = [
            {
              url: data.contractUrl,
            },
          ];
        }
      });
    },
    getCurrentStep(status) {
      if (status === "medi") {
        return this.numList.findIndex((item) => item.value === "quot");
      }
      return this.numList.findIndex((item) => item.value === status);
    },
    getFieldAttribute(key, attr, isNull) {
      return fieldMap.getFieldAttribute(key, attr, isNull);
    },
    getValueFromConfig(formKey, formValue) {
      if (formValue === undefined || formValue === "") return "-";
      const multipleSelect = [
        "relationship",
        "phoneBrand",
        "usedApp",
        "certification",
        "busySeason",
        "paymentWay",
      ];
      const selectMap = selectConfig.getMap();
      if (selectMap.hasOwnProperty(formKey)) {
        // 针对多选的回显
        if (multipleSelect.includes(formKey)) {
          return formValue
            .split(",")
            .map((itemValue) => {
              return selectMap[formKey][itemValue];
            })
            .join(" 、");
        } else {
          return selectMap[formKey][formValue]
            ? `${selectMap[formKey][formValue]}`
            : "-";
        }
      } else {
        return this.form[formKey]
          ? `${this.form[formKey]}${this.getFieldAttribute(
              formKey,
              "unitCN",
              true
            )}`
          : "-";
      }
    },
    // 弹窗的action代码
    modalAction(e, type) {
      const typeForAction = {
        cancel: () => {
          this.modalShow = false;
        },
        confirm: () => {
          if (!this.currentUploadUrl) {
            this.$util.showToast({
              title: "请上传合同照片",
              icon: "none",
            });
            this.$refs.uModal.clearLoading();
            return;
          }

          const { staffId: salesmanId } = uni.getStorageSync("userInfo");
          const params = {
            cid: this.urlParams.cid,
            url: this.currentUploadUrl,
            salesmanId,
          };
          this.$requestData(apiConfig.updateContractUrl, params).then((res) => {
            this.$refs.uModal.clearLoading();
            if (res) {
              this.$util.showToast({
                title: "上传合同成功",
              });
              this.fileList = [];
              this.$refs.uUpload.lists = [];
              this.currentList = null;
              this.modalShow = false;

              this.getCustomerDetail(this.urlParams.cid);
            } else {
              this.$util.showToast({
                title: "上传合同失败",
                icon: "none",
              });
            }
          });
        },
      };
      if (typeForAction.hasOwnProperty(type)) {
        typeForAction[type]();
      }
    },
    // 下方按钮触发管理
    buttonClick(e, type) {
      const typeForAction = {
        uploadFile: () => {
          this.modalShow = true;
        },
        updateInfo: () => {
          const cid = this.urlParams.cid;
          uni.navigateTo({
            url: `/pages/customer/customerAdd?cid=${cid}`,
          });
        },
      };
      if (typeForAction.hasOwnProperty(type)) {
        typeForAction[type]();
      }
    },
  },
};
</script>

<style lang="scss">
.page-header {
  padding: 24rpx 24rpx 50rpx 24rpx;

  .header-time {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .time-end-detail {
      color: #1d4393;
    }

    .time-last {
      color: #999999;
      font-size: 20rpx;
    }
  }

  .header-steps {
    margin-top: 50rpx;
  }
}

.modal-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36rpx;
}

.content-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360rpx;
  width: 600rpx;

  image {
    width: 160rpx;
    height: 120rpx;
  }
}
</style>
