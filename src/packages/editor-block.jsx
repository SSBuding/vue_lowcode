import { defineComponent,inject,computed } from "vue";

export default defineComponent({
  props:{
    block:{type:Object}
  },
  setup(props){
    const blockStyle = computed(()=>({
      top:`${props.block.top}px`,
      left:`${props.block.left}px`,
      zIndex:`${props.block.zIndex}px`,
    }))
    const config = inject('config')
    const component = config.componentMap[props.block.key]
   
    const RenderComponent = component.render()
    return ()=>  
  (
    <div class='editor-block' style={blockStyle.value}>
      {RenderComponent}
    </div>
    )
  }
})