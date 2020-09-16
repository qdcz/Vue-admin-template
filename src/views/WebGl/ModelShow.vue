<template>
  <div class="model">
    <div class="controlPanel"><button @click="switchAngle">切换角度</button></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
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
      Camera_distance: 200,
      type: ''
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
      this.camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 220) / (window.innerHeight - 80), 1, 1000)

      const renderWidth = window.innerWidth - 220
      const renderHeight = null

      this.windowHalfX = (window.innerWidth - 220) / 2
      this.windowHalfY = (window.innerHeight - 80) / 2

      this.container = document.querySelector('.model')
      this.camera.position.z = this.Camera_distance
      var light = new THREE.AmbientLight('#deebf7', 0.9) // soft white light
      this.scene.add(light)
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(renderWidth, window.innerHeight - 80)
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
        that.windowHalfX = (window.innerWidth - 220) / 2
        that.windowHalfY = (window.innerHeight - 80) / 2
        that.camera.aspect = window.innerWidth / (window.innerHeight - 80)
        that.camera.updateProjectionMatrix()
        that.renderer.setSize(renderWidth, window.innerHeight - 80)
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
        OBJLoaders.load(ObjFile, object => {
          this.Obejct_model = object
          textureLoader.load(pngFile, texture => {
            this.Png_model = texture
            this.RednerModel()
            this.loading.close()
          })
        },
        onProgress,
        onError
        )
      })
    },
    RednerModel() {
      // 设置旋转中心点
      this.Obejct_model.children[0].geometry.computeBoundingBox()
      this.Obejct_model.children[0].geometry.center()
      // this.type === 'Ipad' ? object.scale.set(3, 3, 3) : object.scale.set(0.1, 0.1, 0.1)
      this.Obejct_model.rotation.y = this.Object_rotationY
      this.Obejct_model.children[0].material.map = this.Png_model
      this.Obejct_model.children[0].material.needsUpdate = true
      this.scene.add(this.Obejct_model)
      this.renderer.render(this.scene, this.camera)
      // requestAnimationFrame()
    },
    switchAngle() {
      this.Object_rotationY = 180
      this.RednerModel()
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
