<template>
  <div style="padding: 20px;font-size: 14px;">
    <el-form ref="ruleForm" :model="ruleForm" class="demoRuleForm" :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="input输入框" prop="inputTxt"><el-input v-model="ruleForm.inputTxt" size="large" placeholder="请输入书籍名称" /></el-form-item>
      <el-form-item label="textarea" prop="textarea">
        <el-input v-model="ruleForm.textarea" type="textarea" placeholder="请输入textarea" :autosize="{ minRows: 4, maxRows: 8 }" size="large" />
      </el-form-item>
      <el-form-item label="纯数字" prop="number"><el-input v-model="ruleForm.number" type="number" size="large" placeholder="请输入number" /></el-form-item>
      <el-form-item label="密码" prop="password"><el-input v-model="ruleForm.password" type="password" size="large" placeholder="请输入password" /></el-form-item>
      <el-form-item label="时间" prop="date1">
        <el-col :span="11"><el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;" /></el-col>
        <el-col class="line flex ali-cen just-cent" :span="2">-</el-col>
        <el-col :span="11"><el-time-picker v-model="ruleForm.date2" placeholder="选择时间" style="width: 100%;" /></el-col>
        <span class="ml40 fo-gray fo-10">返回给后端的数据是：{{ ruleForm.date1 }}::::::::::{{ ruleForm.date2 }}</span>
      </el-form-item>
      <el-form-item label="城市下拉" prop="areaName"><city-select @change="CitySelectOnchange" /></el-form-item>
      <div class="mb20 ml60">
        <span class="ml40 fo-gray fo-10">provinceId：{{ ruleForm.provinceId }}</span>
        <span class="ml40 fo-gray fo-10">provinceName：{{ ruleForm.provinceName }}</span>
        <span class="ml40 fo-gray fo-10">cityId：{{ ruleForm.cityId }}</span>
        <span class="ml40 fo-gray fo-10">cityName：{{ ruleForm.cityName }}</span>
        <span class="ml40 fo-gray fo-10">areaId：{{ ruleForm.areaId }}</span>
        <span class="ml40 fo-gray fo-10">areaName：{{ ruleForm.areaName }}</span>
      </div>
      <el-form-item label="HTML下拉">
        <el-select v-model="ruleForm.autoDrown" placeholder="请选择自定义下拉1">
          <el-option label="写在HTML01" value="01啊" />
          <el-option label="写在HTML02" value="02啊" />
        </el-select>
      </el-form-item>
      <el-form-item label="JSON下拉" prop="JsonDrown">
        <el-select v-model="ruleForm.JsonDrown" placeholder="请选择JsonDrown" @change="JsonDrownChange">
          <el-option v-for="item in JsonDrownList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="ml40 fo-gray fo-10">返回给后端的数据是：{{ ruleForm.JsonDrown }}</span>
      </el-form-item>
      <el-form-item label="Switch" prop="Switch">
        <el-switch v-model="ruleForm.Switch" />
        <span class="ml40 fo-gray fo-10">返回给后端的数据是：{{ ruleForm.Switch }}</span>
      </el-form-item>
      <el-form-item label="单选按钮" prop="singleRadios">
        <el-radio-group v-model="ruleForm.singleRadios">
          <el-radio label="后端" />
          <el-radio label="全栈" />
        </el-radio-group>
        <span class="ml40 fo-gray fo-10">返回给后端的数据是：{{ ruleForm.singleRadios }}</span>
      </el-form-item>
      <el-form-item label="checkBox" prop="checkBox">
        <el-checkbox-group v-model="ruleForm.checkBox" @change="checkBoxOnchange">
          <el-checkbox v-for="item in checkBoxList" :key="item.id" :label="item.name" :disabled="item.disabled" />
          <span class="ml40 fo-gray fo-10">返回给后端的数据是：{{ ruleForm.checkBox }}</span>
        </el-checkbox-group>
      </el-form-item>
      <el-button v-show="true" type="primary" @click.native.prevent="Submit('ruleForm')">添加</el-button>
    </el-form>
  </div>
</template>
<script>
import CitySelect from '@/components/CitySelect/CitySelect'
export default {
  name: 'BookDetail',
  components: { CitySelect },
  data() {
    return {
      rules: {
        inputTxt: [{ required: true, message: '请输入inputTxt', trigger: 'change' }],
        textarea: [{ required: true, message: '内容textarea', trigger: 'change' }],
        number: [{ required: true, message: '请输入专栏类别id', trigger: 'change' }],
        password: [{ required: true, message: '请输入password', trigger: 'change' }],
        date1: [{ required: true, message: '请选择时间1', trigger: 'change' }],
        date2: [{ required: true, message: '请选择时间2', trigger: 'change' }],
        areaName: [{ required: true, message: '请选择地区', trigger: 'change' }],
        autoDrown: [{ required: true, message: '请选择自定义下拉', trigger: 'change' }],
        JsonDrown: [{ required: true, message: '请输入JsonDrown', trigger: 'change' }],
        singleRadios: [{ required: true, message: '请输入singleRadios', trigger: 'change' }],
        checkBox: [{ required: true, message: '请选择checkBox', trigger: 'change' }]
      },
      JsonDrownList: [{ id: 'id是01啊', name: 'JS' }, { id: 'id是02啊', name: 'Node' }, { id: 'id是03啊', name: 'Nosql' }], // 自定义下拉宽数据
      checkBoxList: [
        { id: 'id是011111啊', name: 'uniapp', disabled: false },
        { id: 'id是022222啊', name: 'unicloud', disabled: false },
        { id: 'id是033333啊', name: 'vue', disabled: false },
        { id: 'id是03344啊', name: 'react', disabled: true },
        { id: 'id是55555啊', name: 'ts', disabled: false }
      ], // 自定义下拉宽数据
      ruleForm: {
        inputTxt: '',
        textarea: '',
        number: '',
        password: '',
        date1: '',
        date2: '',
        autoDrown: '',
        JsonDrown: '',
        Switch: '',
        singleRadios: '',
        checkBox: [],

        areaId: '',
        areaName: '',
        cityId: '',
        cityName: '',
        provinceId: '',
        provinceName: '',
        str: ''
      }
    }
  },
  methods: {
    // 下拉款选则改变时触发
    JsonDrownChange(e) {
      console.log('下拉宽数据发生变化啦，这是函数回调：', e)
    },
    // checkbox选择改变时触发
    checkBoxOnchange(e) {
      console.log('checkbox选择改变时触发，这是函数回调：', e)
    },
    // 下拉城市选择
    CitySelectOnchange(e) {
      console.log('下拉城市选择改变时触发，这是函数回调：', e)
      for (const i in e) {
        this.ruleForm[i] = e[i]
      }
    },
    async Submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let loading = null
          try {
            loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            // this.$refs.demoRuleForm.resetField()
            this.clearRuleForm()
            console.log('这是传给后端的数据哦：', this.ruleForm)
          } catch (e) {
            this.$message.error(e)
          } finally {
            loading.close()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearRuleForm() {
      // this.$refs.upload.clearFiles()
      this.ruleForm = {
        inputTxt: '',
        textarea: '',
        number: '',
        password: '',
        autoDrown: '',
        JsonDrown: '',
        Switch: '',
        singleRadios: '',
        checkBox: []
      }
    }
  }
}
</script>
<style>
.demoRuleForm {
  text-align: left;
}
</style>
