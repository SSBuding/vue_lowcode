import { computed, defineComponent, inject, ref } from 'vue'
import deepcopy from 'deepcopy'
import EditorBlock from './editor-block'
import './edItor.scss'
import { useMenuDragger } from '@/hooks/useMenudragger'
import { useFocus } from '@/hooks/useFocus'
import { useBlockDragger } from '@/hooks/useBlockDragger'
export default defineComponent({
  props: {
    modelValue: { type: Object },
  },
  emit: ['update:modelValue'],
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue
      },
      set(newValue) {
        ctx.emit('update:modelValue', deepcopy(newValue))
      },
    })

    const containerStyle = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px',
    }))
    const config = inject('config')
    const containerRef = ref(null)

    // 实现菜单拖拽功能

    const { dragStart, dragend } = useMenuDragger(containerRef, data)

    const { blockMousedown, focusData, containerMousedown, lastSelectBlock } =
      useFocus(
        data,
        // 获取焦点后拖拽
        (e) => {
          mousedown(e)
        }
      )
    // 实现组件拖拽
    const { mousedown, markline } = useBlockDragger(
      focusData,
      lastSelectBlock,
      data
    )

    return () => (
      <div class='editor'>
        <div class='editor-left'>
          {config.componentList.map((component) => (
            <div
              class='editor-left-item'
              draggable
              onDragstart={(e) => dragStart(e, component)}
              onDragend={dragend}
            >
              <span>{component.label}</span>
              <div>{component.preview()}</div>
            </div>
          ))}
        </div>
        <div class='editor-top'>菜单栏</div>
        <div class='editor-right'>属性控制栏目</div>
        <div className='editor-container'>
          {/* 负责产生滚动条 */}
          <div className='editor-container-canvas'>
            {/* 产生内容区域 */}
            <div
              className='editor-container-canvas_content'
              style={containerStyle.value}
              ref={containerRef}
              onMousedown={containerMousedown}
            >
              {data.value.blocks.map((block, index) => (
                <EditorBlock
                  block={block}
                  class={block.focus ? 'editor-block-focus' : ''}
                  onMousedown={(e) => blockMousedown(e, block, index)}
                ></EditorBlock>
              ))}
              {markline.x !== null && (
                <div class='line-x' style={{ left: markline.x + 'px' }}></div>
              )}
              {markline.y !== null && (
                <div class='line-y' style={{ top: markline.y + 'px' }}></div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  },
})
