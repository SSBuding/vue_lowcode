import { reactive } from 'vue'
export function useBlockDragger(focusData, lastSelectBlock,data) {
  let dragState = {
    startX: 0,
    startY: 0,
  }
  let markline = reactive({ x: null, y: null })
  const mousedown = (e) => {
    const { width: BWidth, height: BHeight } = lastSelectBlock.value
    console.log(lastSelectBlock.value)
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: lastSelectBlock.value.left, // b组件拖拽前左右位置
      startTop: lastSelectBlock.value.top, // b组件拖拽前上下位置
      startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
      lines: (() => {
        const { unfocused } = focusData.value // 以未选中组件为辅助线

        let lines = { x: [], y: [] };
        [...unfocused,
          {
            top:0,
            left:0,
            width:data.value.container.width,
            height:data.value.container.height
          }
        ].forEach((block) => {
          const {
            top: ATop,
            left: ALeft,
            width: AWidth,
            height: AHeight,
          } = block
          // 横向辅助线
          lines.y.push({ showTop: ATop, top: ATop }) // 顶对顶
          
          lines.y.push({ showTop: ATop, top: ATop - BHeight }) // 顶对底
          lines.y.push({
            showTop: ATop + AHeight / 2,
            top: ATop + AHeight / 2 - BHeight / 2,
          }) // 中对中
          lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight }) // 底对顶
          lines.y.push({
            showTop: ATop + AHeight,
            top: ATop + AHeight - BHeight,
          }) // 底对底
          // 纵向辅助线
          lines.x.push({ showLeft: ALeft, left: ALeft }) // 左对左
          lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth }) // 右对左
          lines.x.push({
            showLeft: ALeft + AWidth / 2,
            left: ALeft + AWidth / 2 - BWidth / 2,
          }) // 中对中
          lines.x.push({
            showLeft: ALeft + AWidth,
            left: ALeft + AWidth - BWidth,
          }) // 右对右
          lines.x.push({ showLeft: ALeft, left: ALeft - BWidth }) // 左对右
        })
        return lines
      })(),
    }

    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }

  // 获取焦点
  const mousemove = (e) => {
    let { clientX: moveX, clientY: moveY } = e

    // 计算当前元素最新的left，top
    let left = moveX - dragState.startX + dragState.startLeft
    let top = moveY - dragState.startY + dragState.startTop
    // 计算横线，离参照元素还有5像素的时候显示
    let y = null
    let x = null
    for (let i = 0; i < dragState.lines.y.length; i++) {
      // console.log(dragState.lines.y)
      const { top: t, showTop: s } = dragState.lines.y[i]
      
      if (Math.abs(t - top) < 5) {
        y = s
        moveY = dragState.startY - dragState.startTop + t
        break
      }
    }
    for (let i = 0; i < dragState.lines.x.length; i++) {
      const { left: l, showLeft: s } = dragState.lines.x[i]
      
      if (Math.abs(l - left) < 5) {
        x = s
       
        moveX = dragState.startX - dragState.startLeft + l
        break
      }
    }
    markline.x = x
    markline.y = y
    let durX = moveX - dragState.startX
    let durY = moveY - dragState.startY
    focusData.value.focus.forEach((block, index) => {
      block.top = dragState.startPos[index].top + durY
      block.left = dragState.startPos[index].left + durX
    })
  }

  const mouseup = (e) => {
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
    markline.x = null
    markline.y = null
    
  }
  return {
    mousedown,
    markline,
  }
}
