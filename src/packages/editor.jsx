import {computed,defineComponent,inject,ref} from "vue"
import EditorBlock from "./editor-block"
import './edItor.scss'
export default defineComponent({
  props:{
    modelValue:{type:Object}
  },
  setup(props){
    const data =  computed({
      get(){
        return props.modelValue
      }
    })
    
    const containerStyle = computed(()=>({
      width:data.value.container.width+'px',
      height:data.value.container.height+'px'
    }))
    const config = inject('config')
    const containerRef = ref(null)
    const dragStart = (e,component)=>{
      containerRef.value.addEventListener()

    }




    return ()=>(
    <div class='editor'>
      <div class='editor-left'>
        {config.componentList.map(component=>(
          <div class='editor-left-item'
          draggable
          onDragStart={e=>dragStart(e,component)}
          >
            <span>{component.label}</span>
            <div>{component.preview()}</div>
          </div>
        ))}
      </div>
      <div class='editor-top'>菜单栏</div>
      <div class='editor-right'>属性控制栏目</div>
      <div className="editor-container">
        {/* 负责产生滚动条 */}
        <div className="editor-container-canvas">
          {/* 产生内容区域 */}
          <div className="editor-container-canvas_content" style={containerStyle.value}
          ref={containerRef}
          >
            {data.value.blocks.map(block=>(
              <EditorBlock block={block}></EditorBlock>
            ))}
          </div>
        </div>
      </div>
    </div>
    )
  }
})