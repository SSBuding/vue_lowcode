import { computed, ref } from 'vue'
export function useFocus(data, callback) {
  const selectIndex = ref(-1)
  const lastSelectBlock = computed(()=>data.value.blocks[selectIndex.value])
  const focusData = computed(() => {
    let focus = []
    let unfocused = []
    data.value.blocks.forEach((block) =>
      (block.focus ? focus : unfocused).push(block)
    )
    return { focus, unfocused }
  })

  const clearBlockFocus = () => {
    data.value.blocks.forEach((block) => (block.focus = false))
  }
  const containerMousedown = () => {
    selectIndex.value = -1
    clearBlockFocus() // 点击容器失去焦点
  }
  const blockMousedown = (e, block, index) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.shiftKey) {
      if (focusData.value.focus.length <= 1) {
        block.focus = true
      } else {
        block.focus = !block.focus
      }
    } else {
      if (!block.focus) {
        clearBlockFocus()
        block.focus = true // 需要清空其他focus
      }
    }
    selectIndex.value = index
    callback(e)
  }

  return {
    focusData,
    blockMousedown,
    containerMousedown,
    lastSelectBlock
  }
}
