<template>
	<view class="htz-image-upload-list">
		<view class="htz-image-upload-Item" v-for="(item,index) in tempFileList" :key="index">
			<view class="htz-image-upload-Item-video" v-if="(!/.(gif|jpg|jpeg|png|gif|jpg|png)$/i.test(item.tempSrc))">
				<video :disabled="false" :controls="false" :src="item.tempSrc">
					<cover-view class="htz-image-upload-Item-video-fixed" @click="previewVideo(item.tempSrc)">
					</cover-view>

					<cover-view class="htz-image-upload-Item-del-cover" v-if="remove && previewVideoSrc==''"
						@click="imgDel(index)">×</cover-view>

				</video>

			</view>

			<image v-else :src="item.tempSrc" @click="imgPreview(item.tempSrc)"></image>
			<u-line-progress v-if=" item.progress > 0 " :show-percent="false" height="16"
				class="htz-image-upload-Item-progress" :percent="item.progress"></u-line-progress>
			<view class="htz-image-upload-Item-del" v-if="remove" @click="imgDel(index)">×</view>
		</view>
		<view class="htz-image-upload-Item htz-image-upload-Item-add" v-if="tempFileList.length<max && add"
			@click="chooseFile">
			+
		</view>
		<view class="preview-full" v-if="previewVideoSrc!=''">
			<video :autoplay="true" :src="previewVideoSrc" :show-fullscreen-btn="false">
				<cover-view class="preview-full-close" @click="previewVideoClose"> ×
				</cover-view>
			</video>
		</view>


		<!--  -->
	</view>
</template>

<style>
	.ceshi {
		width: 100%;
		height: 100%;
		position: relative;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: #FFFFFF;
		color: #2C405A;
		opacity: 0.5;
		z-index: 100;
	}
</style>

<script>
	export default {
		name: 'CommonUpload',
		props: {
			max: { //展示图片最大值
				type: Number,
				default: 1,
			},
			chooseNum: { //选择图片数
				type: Number,
				default: 9,
			},
			name: { //发到后台的文件参数名
				type: String,
				default: 'file',
			},
			remove: { //是否展示删除按钮
				type: Boolean,
				default: true,
			},
			add: { //是否展示添加按钮
				type: Boolean,
				default: true,
			},
			disabled: { //是否禁用
				type: Boolean,
				default: false,
			},
			sourceType: { //选择照片来源 【ps：H5就别费劲了，设置了也没用。不是我说的，官方文档就这样！！！】
				type: Array,
				default: () => ['album', 'camera'],
			},
			action: { //上传地址
				type: String,
				default: '',
			},
			headers: { //上传的请求头部
				type: Object,
				default: () => {},
			},
			formData: { //HTTP 请求中其他额外的 form data
				type: Object,
				default: () => {},
			},
			compress: { //是否需要压缩
				type: Boolean,
				default: true,
			},
			quality: { //压缩质量，范围0～100
				type: Number,
				default: 80,
			},
			value: { //受控图片列表
				type: Array,
				default: () => [],
			},
			uploadSuccess: {
				default: (res) => {
					return {
						success: false,
						url: ''
					}
				},
			},
			mediaType: { //文件类型 image/video/all
				type: String,
				default: 'image',
			},
			maxDuration: { //拍摄视频最长拍摄时间，单位秒。最长支持 60 秒。 (只针对拍摄视频有用)
				type: Number,
				default: 60,
			},
			camera: { //'front'、'back'，默认'back'(只针对拍摄视频有用)
				type: String,
				default: 'back',
			},

		},
		data() {
			return {
				uploadLists: [],
				tempFileList: [],
				mediaTypeData: ['image', 'video', 'all'],
				previewVideoSrc: '',
			}
		},
		mounted: function() {
			this.$nextTick(function() {
				this.uploadLists = this.value;
				if (this.mediaTypeData.indexOf(this.mediaType) == -1) {
					uni.showModal({
						title: '提示',
						content: 'mediaType参数不正确',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								//console.log('用户点击确定');
							} else if (res.cancel) {
								//console.log('用户点击取消');
							}
						}
					});
				}
			});
		},
		watch: {
			value(val, oldVal) {
				//console.log('value',val, oldVal)
				this.uploadLists = val;
			},
		},
		methods: {
			previewVideo(src) {
				// console.log(this.tempFileList)
				this.previewVideoSrc = src;
				// this.previewVideoSrc =
				// 	'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-fbd63a76-dc76-485c-b711-f79f2986daeb/ba804d82-860b-4d1a-a706-5a4c8ce137c3.mp4'
			},
			previewVideoClose() {
				this.previewVideoSrc = ''
				// console.log('previewVideoClose', this.previewVideoSrc)
			},
			imgDel(index) {
				uni.showModal({
					title: '提示',
					content: '您确定要删除么?',
					success: (res) => {
						if (res.confirm) {
							// this.uploadLists.splice(index, 1)
							// this.$emit("input", this.uploadLists);
							// this.$emit("imgDelete", this.uploadLists);
							let delUrl = this.uploadLists[index]
							this.uploadLists.splice(index, 1);
							this.tempFileList.splice(index, 1);
							this.$emit("input", this.uploadLists);
							this.$emit("imgDelete", {
								del: delUrl,
								tempFilePaths: this.uploadLists,

							});
						} else if (res.cancel) {}
					}
				});
			},
			imgPreview(index) {
				// console.log(this.tempFileList)
				var imgData = this.tempFileList.filter(item => /.(gif|jpg|jpeg|png|gif|jpg|png)$/i.test(item)) //只预览图片的
				uni.previewImage({
					urls: imgData,
					current: index,
					loop: true,
				});


			},
			chooseFile() {
				if (this.disabled) {
					return false;
				}
				switch (this.mediaTypeData.indexOf(this.mediaType)) {
					case 1: //视频
						this.videoAdd();
						break;
					case 2: //全部
						uni.showActionSheet({
							itemList: ['相册', '视频'],
							success: (res) => {
								if (res.tapIndex == 1) {
									this.videoAdd();
								} else if (res.tapIndex == 0) {
									this.imgAdd();
								}
							},
							fail: (res) => {
								console.log('错误信息', res.errMsg);
							}
						});
						break;
					default: //图片
						this.imgAdd();
						break;
				}


				//if(this.mediaType=='image'){


			},
			videoAdd() {
				let nowNum = Math.abs(this.uploadLists.length - this.max);
				let thisNum = (this.chooseNum > nowNum ? nowNum : this.chooseNum) //可选数量
				// uni.chooseMedia({
				// 	compressed: true,
				// 	sourceType: this.sourceType,
				// 	mediaType: ['video'],
				// 	camera: this.camera,
				// 	maxDuration: this.maxDuration,
				// 	success: (res) => {
				// 		const {
				// 			tempFiles
				// 		} = res;
				// 		const {
				// 			duration,
				// 			size,
				// 			heigth,
				// 			width,
				// 			tempFilePath
				// 		} = tempFiles[0]
				// 		if (!width || !height) {
				// 			this.$util.showToast({
				// 				title: '视频最多只能上传60秒',
				// 				icon: 'none',
				// 				duration: 3000
				// 			})
				// 			return;
				// 		}
				// 		if (duration > this.maxDuration) {
				// 			uni.hideLoading()
				// 			this.$util.showToast({
				// 				title: '视频最多只能上传60秒',
				// 				icon: 'none',
				// 				duration: 3000
				// 			})
				// 			return;
				// 		} else if (size / (1024 * 1024) > 10) {

				// 			this.$util.showToast({
				// 				title: '请上传10M以内的视频文件',
				// 				icon: 'none',
				// 				duration: 3000
				// 			})
				// 			return;
				// 		} else {
				// 			this.chooseSuccessMethod([tempFilePath], 1)
				// 		}
				// 	},
				// 	fail: (error) => {
				// 		console.log("调用失败", error)
				// 		this.$util.showToast({
				// 			title: '视频格式错误，请上传正确格式的视频',
				// 			icon: 'none',
				// 			duration: 3000
				// 		})
				// 		return;

				// 	}
				// })
				uni.chooseVideo({
					compressed: true,
					sourceType: this.sourceType,
					camera: this.camera,
					maxDuration: this.maxDuration,
					success: (res) => {
						const {
							duration,
							size,
							tempFilePath,
							height,
							width
						} = res;
						console.log(res);
						if (!height || !width) {
							this.$util.showToast({
								title: '视频格式错误，请上传正确格式的视频',
								icon: 'none',
								duration: 3000
							})
							return;
						}
						if (duration > this.maxDuration) {
							uni.hideLoading()
							this.$util.showToast({
								title: '视频最多只能上传60秒',
								icon: 'none',
								duration: 3000
							})
							return;
						} else if (size / (1024 * 1024) > 10) {

							this.$util.showToast({
								title: '请上传10M以内的视频文件',
								icon: 'none',
								duration: 3000
							})
							return;
						} else {
							this.chooseSuccessMethod([tempFilePath], 1)
						}
					},
					fail: (error) => {
						console.log("调用失败", error)
						this.$util.showToast({
							title: '视频格式错误，请上传正确格式的视频',
							icon: 'none',
							duration: 3000
						})
						return;

					}
				});
			},
			imgAdd() {
				console.log('imgAdd')
				let nowNum = Math.abs(this.uploadLists.length - this.max);
				let thisNum = (this.chooseNum > nowNum ? nowNum : this.chooseNum) //可选数量
				// console.log('nowNum', nowNum)
				// console.log('thisNum', thisNum)
				// #ifdef APP-PLUS
				if (this.sourceType.length > 1) {
					uni.showActionSheet({
						itemList: ['拍摄', '从手机相册选择'],
						success: (res) => {
							if (res.tapIndex == 1) {
								this.appGallery(thisNum);
							} else if (res.tapIndex == 0) {
								this.appCamera();
							}
						},
						fail: (res) => {
							console.log(res.errMsg);
						}
					});
				}
				if (this.sourceType.length == 1 && this.sourceType.indexOf('album') > -1) {
					this.appGallery(thisNum);
				}

				if (this.sourceType.length == 1 && this.sourceType.indexOf('camera') > -1) {
					this.appCamera();
				}
				// #endif
				//#ifndef APP-PLUS
				uni.chooseImage({
					count: thisNum,
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: this.sourceType,
					success: (res) => {
						if (res.size / (1024 * 1024) > 5) {

							this.$util.showToast({
								title: '请上传5M以内的图片文件',
								icon: 'none',
								duration: 3000
							})
							return;
						}
						this.chooseSuccessMethod(res.tempFilePaths, 0)
						//console.log('tempFiles', res)
						// if (this.action == '') { //未配置上传路径
						// 	this.$emit("chooseSuccess", res.tempFilePaths);
						// } else {
						// 	if (this.compress && (res.tempFiles[0].size / 1024 > 1025)) { //设置了需要压缩 并且 文件大于1M，进行压缩上传
						// 		this.imgCompress(res.tempFilePaths);
						// 	} else {
						// 		this.imgUpload(res.tempFilePaths);
						// 	}
						// }
					}
				});
				// #endif
			},
			appCamera() {
				var cmr = plus.camera.getCamera();
				var res = cmr.supportedImageResolutions[0];
				var fmt = cmr.supportedImageFormats[0];
				//console.log("Resolution: " + res + ", Format: " + fmt);
				cmr.captureImage((path) => {
						//alert("Capture image success: " + path);
						this.chooseSuccessMethod([path], 0)
					},
					(error) => {
						//alert("Capture image failed: " + error.message);
						console.log("Capture image failed: " + error.message)
					}, {
						resolution: res,
						format: fmt
					}
				);
			},
			appGallery(maxNum) {
				plus.gallery.pick((res) => {
					this.chooseSuccessMethod(res.files, 0)
				}, function(e) {
					//console.log("取消选择图片");
				}, {
					filter: "image",
					multiple: true,
					maximum: maxNum
				});
			},
			chooseSuccessMethod(filePaths, type) {
				if (this.action == '') { //未配置上传路径
					this.$emit("chooseSuccess", filePaths, type); //filePaths 路径 type 0 为图片 1为视频
				} else {
					this.$emit('beforeUpload')
					if (type == 1) {
						this.imgUpload(filePaths);
					} else {
						if (this.compress) { //设置了需要压缩
							this.imgCompress(filePaths);
						} else {
							this.imgUpload(filePaths);
						}
					}

				}
			},
			imgCompress(tempFilePaths) {
				let compressImgs = [];
				let results = [];

				tempFilePaths.forEach((item, index) => {

					compressImgs.push(new Promise((resolve, reject) => {
						// #ifndef H5
						uni.compressImage({
							src: item,
							quality: this.quality,
							success: res => {
								//console.log('compressImage', res.tempFilePath)

								results.push(res.tempFilePath);
								resolve(res.tempFilePath);
							},
							fail: (err) => {
								//console.log(err.errMsg);
								reject(err);
							},
							complete: () => {
								//uni.hideLoading();
							}
						})
						// #endif
						// #ifdef H5
						this.canvasDataURL(item, {
							quality: this.quality / 100
						}, (base64Codes) => {
							//this.imgUpload(base64Codes);
							results.push(base64Codes);
							resolve(base64Codes);
						})
						// #endif
					}))
				})
				Promise.all(compressImgs) //执行所有需请求的接口
					.then((results) => {
						uni.hideLoading();
						// console.log('imgUpload', results)
						this.imgUpload(results);
					})
					.catch((res, object) => {
						uni.hideLoading();
					});
			},
			imgUpload(tempFilePaths) {
				// if (this.action == '') {
				// 	uni.showToast({
				// 		title: '未配置上传地址',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// 	return false;
				// }
				// uni.showLoading({
				// 	title: '上传中,请耐心等待'
				// });
				// console.log('imgUpload', tempFilePaths)
				let uploadImgs = [];
				this.tempFileList = [
					...this.tempFileList,
					...tempFilePaths.map(item => ({
						tempSrc: item,
						progress: 0,
						error: false
					}))
				]

				tempFilePaths.forEach((item, index) => {
					const tempIndex = this.tempFileList.findIndex(fileItem => fileItem.tempSrc === item)
					this.tempFileList[tempIndex].progress = 40;
					uploadImgs.push(new Promise((resolve, reject) => {
						// 制造出上传的动态的效果
						setTimeout(() => {
							if (this.tempFileList[tempIndex].progress != 100) {
								this.tempFileList[tempIndex].progress = 80;
							}
						}, 100);

						const uploadTask = uni.uploadFile({
							url: this.action, //仅为示例，非真实的接口地址
							filePath: item,
							name: this.name,
							// fileType: 'image',
							formData: this.formData,
							header: this.headers,
							success: (uploadFileRes) => {
								// 進度條变成100%
								const tempIndex = this.tempFileList.findIndex(fileItem =>
									fileItem.tempSrc === item)
								if (tempIndex > -1) {
									this.tempFileList[tempIndex].progress = 100;
									//console.log(typeof this.uploadSuccess)
									//console.log('')
									if (typeof this.uploadSuccess == 'function') {
										if (this.uploadSuccess(uploadFileRes).success) {
											this.value.push(this.uploadSuccess(
													uploadFileRes)
												.url)
											this.$emit("input", this.uploadLists);
										}
									}
									resolve(uploadFileRes);
									this.$emit("uploadSuccess", uploadFileRes);
								} else {
									resolve(null);
									this.$emit("uploadSuccess", null);
								}

							},
							fail: (err) => {
								console.log(err);
								//uni.hideLoading();
								reject(err);
								this.$emit("uploadFail", err);
							},
							complete: () => {
								//uni.hideLoading();
							}
						});
					}))
				})
				Promise.all(uploadImgs) //执行所有需请求的接口
					.then((results) => {

						uni.hideLoading();
						this.$emit("uploadAllFinish");
					})
					.catch((res, object) => {
						uni.hideLoading();
						this.$emit("uploadFail", res);
					});
				// uploadTask.onProgressUpdate((res) => {
				// 	//console.log('',)
				// 	uni.showLoading({
				// 		title: '上传中' + res.progress + '%'
				// 	});
				// 	if (res.progress == 100) {
				// 		uni.hideLoading();
				// 	}
				// });
			},
			canvasDataURL(path, obj, callback) {
				var img = new Image();
				img.src = path;
				img.onload = function() {
					var that = this;
					// 默认按比例压缩
					var w = that.width,
						h = that.height,
						scale = w / h;
					w = obj.width || w;
					h = obj.height || (w / scale);
					var quality = 0.8; // 默认图片质量为0.8
					//生成canvas
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					// 创建属性节点
					var anw = document.createAttribute("width");
					anw.nodeValue = w;
					var anh = document.createAttribute("height");
					anh.nodeValue = h;
					canvas.setAttributeNode(anw);
					canvas.setAttributeNode(anh);
					ctx.drawImage(that, 0, 0, w, h);
					// 图像质量
					if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
						quality = obj.quality;
					}
					// quality值越小，所绘制出的图像越模糊
					var base64 = canvas.toDataURL('image/jpeg', quality);
					// 回调函数返回base64的值
					callback(base64);
				}
			},
		}
	}
</script>

<style>
	.preview-full {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1002;
	}

	.preview-full video {
		width: 100%;
		height: 100%;
		z-index: 1002;
	}

	.preview-full-close {
		position: fixed;
		right: 32rpx;
		top: 25rpx;
		width: 80rpx;
		height: 80rpx;
		line-height: 60rpx;
		text-align: center;
		z-index: 1003;
		/* 	background-color: #808080; */
		color: #fff;
		font-size: 65rpx;
		font-weight: bold;
		text-shadow: 1px 2px 5px rgb(0 0 0);
	}



	/* .preview-full-close-before,
	.preview-full-close-after {
		position: absolute;
		top: 50%;
		left: 50%;
		content: '';
		height: 60rpx;
		margin-top: -30rpx;
		width: 6rpx;
		margin-left: -3rpx;
		background-color: #FFFFFF;
		z-index: 20000;
	}

	.preview-full-close-before {
		transform: rotate(45deg);

	}

	.preview-full-close-after {
		transform: rotate(-45deg);

	} */

	.htz-image-upload-list {
		display: flex;
		flex-wrap: wrap;
	}

	.htz-image-upload-Item {
		width: 160rpx;
		height: 160rpx;
		margin: 13rpx;
		border-radius: 10rpx;
		position: relative;
	}

	.htz-image-upload-Item-progress {
		position: absolute;
		bottom: 8rpx;
		left: 0rpx;
		width: 100%;
		padding: 0 16rpx;
		box-sizing: border-box;
	}

	.htz-image-upload-Item image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.htz-image-upload-Item-video {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
		position: relative;

	}

	.htz-image-upload-Item-video-fixed {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
		z-index: 996;

	}

	.htz-image-upload-Item video {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;

	}

	.htz-image-upload-Item-add {
		font-size: 105rpx;
		/* line-height: 160rpx; */
		text-align: center;
		border: 1px dashed #d9d9d9;
		color: #d9d9d9;
	}

	.htz-image-upload-Item-del {
		background-color: #f5222d;
		font-size: 24rpx;
		position: absolute;
		width: 35rpx;
		height: 35rpx;
		line-height: 35rpx;
		text-align: center;
		top: 0;
		right: 0;
		z-index: 997;
		color: #fff;
	}

	.htz-image-upload-Item-del-cover {
		background-color: #f5222d;
		font-size: 24rpx;
		position: absolute;
		width: 35rpx;
		height: 35rpx;
		text-align: center;
		top: 0;
		right: 0;
		color: #fff;
		/* #ifdef APP-PLUS */
		line-height: 25rpx;
		/* #endif */
		/* #ifndef APP-PLUS */
		line-height: 35rpx;
		/* #endif */
		z-index: 997;

	}
</style>
