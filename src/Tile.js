/**
 * Created by feng on 17-11-6.
 */
export default class {
  constructor (value = 0, coord = {x: 0, y: 0}) {
    this.value = value// 当前显示的值
    this.coord = {// 当前的坐标值
      x: coord.x,
      y: coord.y
    } // 动画过渡 translate
    this.isNew = false // 判断是不是新格子 新格子应该有 scale 动画
    this.oldCoord = {x: this.coord.x, y: this.coord.y}
  }

  refreshCoord (newCoord) {
    this.isNew = false
    this.oldCoord.x = this.coord.x
    this.oldCoord.y = this.coord.y
    this.coord.x = newCoord.x
    this.coord.y = newCoord.y
  }
}
