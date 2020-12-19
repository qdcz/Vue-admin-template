<template>
  <div id="Box">
    <p>路由配置树</p>
    <el-button class="mb20" type="primary" icon="el-icon-edit" size="mini" @click="addRootMenu('DialogForm')">添加根菜单</el-button>

    <el-tree class="tree" :data="RouterList" :props="defaultProps" node-key="_id" :default-expand-all="true">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <div class="padd10">
          <div>{{ data.meta.title }}</div>
        </div>
        <span>
          <el-button type="text" size="mini" @click.stop="() => append(data,node)">
            添加
          </el-button>
          <el-button type="text" size="mini" @click.stop="() => lookup(data,node)">
            查看/修改
          </el-button>
          <el-button type="text" size="mini" @click.stop="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>



   <!-- 弹窗 -->
   <el-dialog :title="DialogTitle" :visible.sync="isshowDialogs" width="60%" center @close="dialogClose('DialogForm')">
     <el-form ref="DialogForm" :model="DialogForm" class="el-form" :rules="rules" label-width="80px" label-position="left">
       <el-form-item label="meta.title" prop="title" label-width="100px"><el-input v-model="DialogForm.title" size="large" /></el-form-item>
       <el-form-item label="meta.icon" prop="icon" label-width="100px"><el-input v-model="DialogForm.icon" size="large" /></el-form-item>
       <el-form-item label="name" prop="name" label-width="100px"><el-input v-model="DialogForm.name" size="large" /></el-form-item>
       <el-form-item label="path" prop="path" label-width="100px"><el-input v-model="DialogForm.path" size="large" /></el-form-item>
       <el-button type="primary" @click="submitDialogForm('DialogForm')">
         {{DialogTitle==='添加路由信息' || DialogTitle==='添加根路由' ?'添加':'修改'}}
       </el-button>
       <el-button @click="dialogClose('DialogForm')">取消</el-button>
     </el-form>
   </el-dialog>
  </div>
</template>

<script>
  import {
    SyncRouter,
    SelRouter
  } from '@/api/YangPan/role.js'
  import { Loading } from 'element-ui';
  let id = 1000;
  let loadingInstance = "加载种";
  export default {
    data() {
      return {
        RouterList: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          title:'mate'
        },


        // 弹窗
        CurrentSelectNode:null, //当前选择的根树点
        DialogTitle:"添加路由信息",
        isshowDialogs:false,
        DialogForm:{
          title:"",
          icon:"",
          name:"",
          path:""
        },
        rules: {
          title: [{ required: true, message: '路由title不能为空', trigger: 'change' }],
          // icon: [{ required: true, message: '路由图标不能为空', trigger: 'change' }],
          name: [{ required: true, message: '路由name不能为空', trigger: 'change' }],
          path: [{ required: true, message: '路由path不能为空', trigger: 'change' }]
        }
      }
    },
    mounted() {
      this.onSelRouter()
    },
    methods: {
      // 添加根级目录
      addRootMenu(){
        this.isshowDialogs= true
        this.DialogTitle = '添加根路由'
      },
      // 获取根节点和level
      getParentNode_level(CurrentNode){
        CurrentNode = CurrentNode || this.CurrentSelectNode[1]
        // 此操作是为了拿到根节点的_id值
        let level = CurrentNode.level,
        parentNode = CurrentNode.parent,rootID=null;
         // 添加第二级节点的时候
        if(CurrentNode.level===1){
          rootID = CurrentNode.data._id
        }else{ // 添加第二节点以上的时候
          while(level!==1){
            level = parentNode.level
            if(level===1) rootID = parentNode.data._id
            parentNode = parentNode.parent
          }
        }
        return {level,parentNode,rootID}
      },
      async onSelRouter() {
        loadingInstance = Loading.service({ fullscreen: true })
        let {
          code,
          data
        } = await SelRouter()
        if (code === 200) {
          this.RouterList = JSON.parse(JSON.stringify(data))
        }
        loadingInstance.close()
      },
      // 添加节点
      append(data,node) {
        this.CurrentSelectNode = [data,node]
        this.isshowDialogs= true
        this.DialogTitle = '添加路由信息'
      },
      // 查看节点
      lookup(data,node){
        this.CurrentSelectNode = [data,node]
        this.isshowDialogs= true
        this.DialogTitle = '查看路由信息'
        this.DialogForm={
          title:data.meta.title,
          icon:data.meta.icon,
          name:data.name,
          path:data.path
        }
      },
      // 删除节点
      async remove(node, data) {
        this.$confirm('此操作将永久删除该路由, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          loadingInstance = Loading.service({ fullscreen: true })


          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d._id === data._id);
          children.splice(index, 1);

          let {level,parentNode,rootID} = await this.getParentNode_level(node)

          // 更新整条数据
          let {code,msg} = await SyncRouter({
            id:rootID,
            data:this.RouterList.find((i,j)=>i._id == rootID)
          })
          if(code==200){
            this.$message.success(msg)
            this.onSelRouter()  // 重新刷新数据
          }
          loadingInstance.close()
        })
      },
      // 弹窗的确认按钮
      async submitDialogForm(e){
         this.$refs['DialogForm'].validate(async(valid) => {
          if (valid) {
            loadingInstance = Loading.service({ fullscreen: true })

            let JsonData={
              meta:{
                icon:this.DialogForm.icon,
                title:this.DialogForm.title
              },
              name:this.DialogForm.name,
              path:this.DialogForm.path
            }

            if(this.DialogTitle==='添加根路由'){
              let {code,msg} = await SyncRouter({ data:JsonData })
              if(code==200){
                this.$message.success(msg)
                this.onSelRouter()  // 重新刷新数据
              }
              this.dialogClose(e)  // 关闭弹窗
              loadingInstance.close()
              return
            }


            // 添加二级及以上路由和修改
            if (!this.CurrentSelectNode[0].children) {
              this.$set(this.CurrentSelectNode[0], 'children', []);
            }
            let {level,parentNode,rootID} = await this.getParentNode_level()
            // 添加
            if(this.DialogTitle==='添加路由信息'){
              JsonData._id = this.$tools.create_timeName()
              this.CurrentSelectNode[0].children.push(JSON.parse(JSON.stringify(JsonData))); // 改变静态数据
            }else{ // 修改路由信息
              this.$set(this.CurrentSelectNode[0], 'meta',{
                icon:this.DialogForm.icon,
                title:this.DialogForm.title
              });
              this.$set(this.CurrentSelectNode[0], 'name',this.DialogForm.name);
              this.$set(this.CurrentSelectNode[0], 'path',this.DialogForm.path);
            }
            // 更新整条数据到服务端
            let {code,msg} = await SyncRouter({
              id:rootID,
              data:this.RouterList.find((i,j)=>i._id == rootID)
            })
            if(code==200){
              this.$message.success(msg)
              this.onSelRouter()  // 重新刷新数据
            }
            this.dialogClose(e)  // 关闭弹窗
            loadingInstance.close()
          } else {
            // 验证规则不通过！
            return false;
          }
        });
      },
      // 关闭弹窗
      dialogClose(formName){
        this.isshowDialogs = false
        this.CurrentSelectNode = null
        this.DialogForm={
          title:"",
          icon:"",
          name:"",
          path:""
        }
        // this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped="scoped" lang="less">
  #Box {
    padding: 20px;
    width: 100%;

    .tree {
      display: flex;
      flex-direction: column;
      .custom-tree-node {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  /deep/ .el-tree-node__content{
    height: auto;
  }
</style>
