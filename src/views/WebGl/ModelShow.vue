<template>
  <div class="model">
    <div v-if="controlPanel_IsShow" class="controlPanel">
      <button @click="switchAngle">顺旋转45度角</button>
      <button @click="jietu">启动截图并下载</button>
      <button @click="onCreate">一键生成海报（含6张，左右45/90度，仰视20度，正脸）</button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three' // 引入threeJS库
import OrbitControls from 'three-orbitcontrols' // 引入鼠标控制模型的控制器
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader' //  引入mtl文件加载器和obj文件加载器

import html2canvas from 'html2canvas' // 引入截图库
let timers = null
export default {
  name: '',
  data() {
    return {
      loading: '',
      container: '',
      stats: '',
      camera: '', // 相机
      scene: '', // 场景
      renderer: '', // 渲染器
      mouseX: 0,
      mouseY: 0,
      windowHalfX: '',
      windowHalfY: '',
      ObjFile: 'https://qdds666.oss-cn-hangzhou.aliyuncs.com/15892023482/Pre11.obj',
      MtlFile: 'https://qdds666.oss-cn-hangzhou.aliyuncs.com/15892023482/Pre11.mtl',
      pngFile: 'https://qdds666.oss-cn-hangzhou.aliyuncs.com/15892023482/Pre11Image1.png',
      Obejct_model: '', // 加载后的obj模型
      Mtl_mode: '', // 加载后的mtl模型
      Png_model: '', // 加载后的png资源
      Object_rotationY: 0, // 模型对象旋转
      Camera_distance: 300,
      Current_Angle: 0, // 当模型
      type: '',

      controlPanel_IsShow: true // 工具栏是否显示
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = this.$loading({
        lock: true,
        text: '3D模型加载中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const that = this
      this.scene = new THREE.Scene() // 创建场景
      this.camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 200) / (window.innerHeight - 50), 1, 1000)

      const renderWidth = window.innerWidth - 200
      const renderHeight = null

      this.windowHalfX = (window.innerWidth - 200) / 2
      this.windowHalfY = (window.innerHeight - 50) / 2

      this.container = document.querySelector('.model')
      this.camera.position.z = this.Camera_distance
      var light = new THREE.AmbientLight('#deebf7', 0.9) // soft white light
      this.scene.add(light)
      this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true
      })
      this.renderer.setSize(renderWidth, window.innerHeight - 50)
      // this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
      this.container.appendChild(this.renderer.domElement)

      this.loadModeFile(this.MtlFile, this.ObjFile, this.pngFile)

      window.addEventListener('resize', onWindowResize, false)
      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.25
      controls.enableZoom = false
      controls.addEventListener('change', render) // 监听鼠标、键盘事件

      function onWindowResize() {
        that.windowHalfX = (window.innerWidth - 200) / 2
        that.windowHalfY = (window.innerHeight - 50) / 2
        that.camera.aspect = window.innerWidth / (window.innerHeight - 50)
        that.camera.updateProjectionMatrix()
        that.renderer.setSize(renderWidth, window.innerHeight - 50)
      }

      function render() {
        that.camera.lookAt(that.scene.position)
        that.renderer.render(that.scene, that.camera)
      }
      render()
    },
    // 网络加载模型资源
    loadModeFile(MtlFile, ObjFile, pngFile) {
      var MTLLoaders = new MTLLoader() // mtl加载器
      var OBJLoaders = new OBJLoader() // obj加载器
      var textureLoader = new THREE.TextureLoader() // 图片加载器

      var onProgress = xhr => {
        let Percent = null
        console.warn('onProgress的回调数据：', xhr)
        if (xhr.lengthComputable) {
          var percentComplete = (xhr.loaded / xhr.total) * 100
          Percent = Math.round(percentComplete, 2)
          console.log(Percent + '%')
        }
      }
      var onError = function(xhr) {
        console.log(xhr)
        this.$message.error('加载错误，请重新加载！')
        this.loading.close()
      }

      MTLLoaders.load(MtlFile, materials => {
        this.Mtl_mode = materials
        // materials.preload()
        // OBJLoaders.setMaterials(materials)
        OBJLoaders.load(
          ObjFile,
          object => {
            this.Obejct_model = object
            textureLoader.load(pngFile, texture => {
              this.Png_model = texture
              this.RednerModel(1)
              this.loading.close()
            })
          },
          onProgress,
          onError
        )
      })
    },
    // 渲染模型
    RednerModel(Object_rotationY) {
      // 设置旋转中心点
      this.Obejct_model.children[0].geometry.computeBoundingBox()
      this.Obejct_model.children[0].geometry.center()
      // this.type === 'Ipad' ? object.scale.set(3, 3, 3) : object.scale.set(0.1, 0.1, 0.1)
      this.Obejct_model.rotation.y = 0
      this.Obejct_model.children[0].material.map = this.Png_model
      this.Obejct_model.children[0].material.needsUpdate = true
      this.scene.add(this.Obejct_model)
      this.renderer.render(this.scene, this.camera)
    },
    // 旋转模型
    switchAngle() {
      if (timers) return
      var run_num = this.Object_rotationY
      this.Object_rotationY = Number(this.Object_rotationY) + Math.PI / 4
      const run = () => {
        if (run_num >= this.Object_rotationY) return
        run_num = run_num + 0.05
        this.Obejct_model.rotation.y = run_num
        this.scene.add(this.Obejct_model)
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(run)
      }
      run()
      timers = setTimeout(() => {
        timers = null
      }, 500)
    },
    // 截图
    jietu() {
      this.controlPanel_IsShow = false
      setTimeout(() => {
        this.DownLoadImg()
        this.controlPanel_IsShow = true
      }, 500)
    },
    // 一键拍照生成截图
    async onCreate() {
      this.controlPanel_IsShow = false
      this.Object_rotationY = 0
      const len = 5

      const PPP = () => {
        return new Promise((res, rej) => {
          var run_num = this.Object_rotationY
          this.Object_rotationY = Number(this.Object_rotationY) + Math.PI / 4
          const run = () => {
            if (run_num >= this.Object_rotationY) {
              this.DownLoadImg()
              res()
              return
            }
            run_num = run_num + 0.05
            this.Obejct_model.rotation.y = run_num
            this.scene.add(this.Obejct_model)
            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(run)
          }
          run()
        })
      }

      for (let i = 0; i < len; i++) {
        await PPP()
      }

      const Object_rotationX = -(Math.PI / 4)

      var run_num = this.Object_rotationY // 先赋值
      this.Object_rotationY = Math.PI // 设置结束角度
      const run = () => {
        if (run_num <= this.Object_rotationY) {
          this.DownLoadImg()
          return
        }
        run_num = run_num - 0.05
        this.Obejct_model.rotation.y = run_num
        this.Obejct_model.rotation.x = Object_rotationX
        this.scene.add(this.Obejct_model)
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(run)
      }
      run()

      this.controlPanel_IsShow = true
    },
    // 传入图片数据下载图片
    DownLoadImg() {
      html2canvas(document.querySelector('.model > canvas'), {}).then(canvas => {
        // 封装blob对象
        // var data = dataURItoBlob(imgData)
        // const blob = new Blob([imgData], { type: 'image/png' }) // 创建一个blob对象
        // const url = window.URL.createObjectURL(blob) // 获取url
        var imgData = canvas.toDataURL('image/png')
        console.log(imgData)
        const link = document.createElement('a')
        link.href = imgData
        link.download = `${this.$tools.create_token()}.png` // 下载的文件名
        link.click()
      })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.model {
  position: relative;
  .controlPanel {
    position: absolute;
  }
}
</style>
