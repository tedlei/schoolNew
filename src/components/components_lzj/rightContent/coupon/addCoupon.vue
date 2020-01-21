<template>
    <div class="coupon_add">
        <ul>
            <li>
                <span class="tit">发布学校</span>
                <span class="name col333">重庆荣冉科技教育学校</span>
            </li>
            <li>
                <label class="tit" for="money">优惠券金额</label>
                <input type="number" id="money" v-model="money" min="0">
                <span>元</span>
            </li>
            <li>
                <label class="tit" for="number">优惠券金额</label>
                <input type="number" id="number" v-model="number" min="0">
                <span>张</span>
            </li>
            <li>
                <span class="tit">是否定课程</span>
                <label><input name="yes" type="radio" value="1" v-model="isCurriculum" /> 是</label>
                <label><input name="yes" type="radio" value="0" v-model="isCurriculum" /> 否</label>
            </li>
            <li>
                <!-- updateTime 2019/10/26 -->
                <label v-if="isCurriculum !== '0'" class="tit" for="curriculumName">课程名称</label>
                <label v-else class="tit" for="curriculumName2">使用规则</label>
                <input :disabled="isCurriculum === ''"
                       v-if="isCurriculum !== '0'"
                       type="text" id="curriculumName"
                       v-model="curriculumName"
                       style="width: 500px;">
                <span v-if="isCurriculum === '0'" style="margin-right: 10px;">满</span>
                <input :disabled="isCurriculum === ''"
                       v-if="isCurriculum === '0'"
                       type="number" id="curriculumName2"
                       v-model="curriculumName"
                       style="width: 100px;">
                <span v-if="isCurriculum === '0'" style="margin-left: 10px;">元使用</span>
            </li>
            <li>
                <span class="tit">发布方式</span>
                <label><input name="releaseWay" type="radio" value="1" v-model="releaseWay" />全用户领取</label>
                <label><input name="releaseWay" type="radio" value="0" v-model="releaseWay" />关注用户领取</label>
            </li>
            <li>
                <span class="tit">有效日期</span>
                <el-date-picker
                        v-model="timer"
                        type="date"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions">
                </el-date-picker>
                <label><input name="time" type="radio" value="1" v-model="selectMonth" /> 1个月</label>
                <label><input name="time" type="radio" value="2" v-model="selectMonth" /> 2个月</label>
                <label><input name="time" type="radio" value="3" v-model="selectMonth" /> 3个月</label>
                <label><input name="time" type="radio" value="6" v-model="selectMonth" /> 6个月</label>
                <label><input name="time" type="radio" value="12" v-model="selectMonth" /> 1年</label>
            </li>
        </ul>
        <div class="commit fx">
            <span @click="commit" :style="{backgroundColor: isCommit ? '#2ab0ea' : '#ccc'}">确认发布</span>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {DatePicker} from 'element-ui';
    Vue.use(DatePicker);
    export default {
        components: {DatePicker},
        data() {
            return {
                money: '',  // 优惠券金额
                number: '', // 优惠券金额
                isCurriculum: '',    // 是否定课程
                curriculumName: '',  // 课程名称
                releaseWay: '',  // 发布方式
                selectMonth: '',    // 选择月
                pickerOptions: {    // 时间组件选项配置
                    disabledDate(time){ // 日期选择范围
                        return time.getTime() < Date.now();
                    }
                }
            }
        },
        methods: {
            commit(){
                console.log(this.isCommit, '结果');
            }
        },
        computed: {
            // 有效时间
            timer: {
                get(){
                    let selectMonth = Number(this.selectMonth),
                        result = 0;

                    if (selectMonth > 12) {
                        result = selectMonth;
                    } else {
                        let date = new Date();
                        let y = date.getFullYear();
                        let m = date.getMonth() + 1 + selectMonth;
                        let t = date.getDate();

                        if (m > 12) y++;
                        return　y + '-' + (m%12 || 12) + '-' + t;
                    }
                    return result;
                },
                set(value){this.selectMonth = value;}
            },
            /**
             * 是否可提交
             */
            isCommit(){
                let {money, number, isCurriculum, curriculumName, releaseWay, timer} = this;
                let arr = [money, number, isCurriculum, curriculumName, releaseWay, timer];
                return arr.every( item =>{
                    return !!item.toString().trim()
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .coupon_add{
        flex: 1;
        padding-top: 30px;
        ul{
            li{
                display: flex;
                align-items: center;
                color: #666;
                font-size: 18px;
                .tit{
                    width: 100px;
                    margin-right: 20px;
                    text-align: right;
                }
                input{text-indent: 1em;}
            }
            & li:nth-child(2){margin-bottom: 10px;}
            & li:nth-child(2), & li:nth-child(3){
                input{
                    width:200px;
                    height:50px;
                    margin-right: 20px;
                    background-color:rgba(255,255,255,1);
                    border:1px solid rgba(230,230,230,1);
                    border-radius:5px;
                }
            }
            & li:nth-child(4),
            & li:nth-child(6){
                & label:nth-last-child(2){margin-right: 36px;}
            }
            & li:nth-child(5) {
                input{
                    height:50px;
                    background-color:rgba(255,255,255,1);
                    border:1px solid rgba(230,230,230,1);
                    border-radius:5px;
                }
            }
            & li:nth-child(1),
            & li:nth-child(3),
            & li:nth-child(4),
            & li:nth-child(5),
            & li:nth-child(6){
                margin-bottom: 26px;
            }
            & li:nth-child(7){
                label{
                    margin-left: 30px;
                }
            }
        }
        .commit{
            justify-content: center;
            margin-top: 40px;
            span{
                width:150px;
                height:40px;
                color: #fff;
                text-align: center;
                line-height: 40px;
                border-radius:5px;
            }
        }
    }
</style>

