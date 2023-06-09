import { ElButton, ElInput } from "element-plus"

function createEditorConfig(){
  const componentList = []
  const componentMap = {}

  return {
    componentList,
    componentMap,
    register:(component)=>{
      componentList.push(component)
      componentMap[component.key] = component
    }
  }
}

export const registerConfig = createEditorConfig()

registerConfig.register({
  label:'文本',
  preview:()=>'预览文字',
  render:()=>'渲染文字',
  key:'text'
})

registerConfig.register({
  label:'按钮',
  preview:()=><ElButton>预览按钮</ElButton>,
  render:()=><ElButton>渲染按钮</ElButton>,
  key:'button'
})
registerConfig.register({
  label:'按钮',
  preview:()=>(<ElInput placeholder='文本预览'></ElInput>),
  render:()=>(<ElInput placeholder='文本渲染'></ElInput>),
  key:'input'
})