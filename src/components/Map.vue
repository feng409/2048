<template>
  <div class="map">
    <Cell :value="item" :coord="{x: 0, y: index}" v-for="(item, index) in cells[0]"></Cell>
    <Cell :value="item" :coord="{x: 1, y: index}" v-for="(item, index) in cells[1]"></Cell>
    <Cell :value="item" :coord="{x: 2, y: index}" v-for="(item, index) in cells[2]"></Cell>
    <Cell :value="item" :coord="{x: 3, y: index}" v-for="(item, index) in cells[3]"></Cell>
  </div>
</template>

<script>
  import Cell from './Cell.vue'
  export default{
    data () {
      return {
        testdata: Array.from(new Array(8), (v, i) => i),
        testunit: 15,
        cells: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]
      }
    },
    created () {
      this.generateRandom()
    },
    mounted () {
      document.onkeydown = this.onKeyDown
    },
    methods: {
      generateRandom () {
        let space = []
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            if (this.cells[r][c] === 0) {
              space.push({r: r, c: c})
            }
          }
        }
        if (space.length > 0) {
          let randomIndex = Math.floor(Math.random() * space.length)
          let randomValue = Math.random() > 0.5 ? 2 : 4
          let r = space[randomIndex].r
          let c = space[randomIndex].c
          /* 二维数组的更新方式只能是更新整个一维数组 */
          this.cells[r][c] = randomValue
          this.$set(this.cells, r, this.cells[r])
        }
      },
      onKeyDown (event) {
        /** keyCode 37 == Left  38 == Up 39 == Right 40 == Down */
        if (event.keyCode >= 37 && event.keyCode <= 40) {
          this.move(event.keyCode - 37)
        }
      },
      /**
       * rotate 逆时针旋转 纯粹数学规律
       * n维矩阵旋转,假设矩阵中一数字坐标为(i,j)，逆时针翻转后的坐标为(n-1-j,i)
       * 原矩阵
       * (0,0) (0,1) (0,2) (0,3)
       * (1,0) (1,1) (1,2) (1,3)
       * (2,0) (2,1) (2,2) (2,3)
       * (3,0) (3,1) (3,2) (3,3)
       * 逆时针旋转90度后坐标变化
       * (0,3) (1,3) (2,3) (3,3)
       * (0,2) (1,2) (2,2) (3,2)
       * (0,1) (1,1) (2,1) (3,1)
       * (0,0) (1,0) (2,0) (3,0)
       */
      rotateLeft (matrix) {
        let rows = matrix.length
        let columns = matrix[0].length
        let res = []
        for (let row = 0; row < rows; row++) {
          res.push([])
          for (let column = 0; column < columns; column++) {
            res[row][column] = matrix[column][columns - row - 1]// 计算变化后的坐标
          }
        }
        return res
      },
      /** 游戏移动实现规则:
       * 先将地图向左旋转,
       * 然后进行合并操作,
       * 再旋转回来,
       * 生成新的单元格
       * */
      move (direction) {
        if (direction === 0) {
          this.moveLeft()
        } else {
          for (let i = 0; i < direction; i++) {
            this.cells = this.rotateLeft(this.cells)
          }
          this.moveLeft()
          for (let i = 0; i < 4 - direction; i++) {
            this.cells = this.rotateLeft(this.cells)
          }
        }
        for (let i = 0; i < 4; i++) {
          this.$set(this.cells, i, this.cells[i])
        }
        this.generateRandom()
      },
      /**
       * 向左移动游戏规则:
       * 清除所有的空白格子后,
       * 当左边的格子等于右边的格子,
       * 合并,
       * 最后当剩下的有数字的格子都操作完毕后,
       * 填充补足4个单元格,
       * */
      moveLeft () {
        for (let r = 0; r < 4; r++) {
          let row = this.cells[r].filter(value => (value !== 0))
          let newRow = []
          while (row.length > 0) {
            let cell = row.shift()
            if (cell === row[0]) {
              cell += row.shift()
            }
            newRow.push(cell)
          }
          if (newRow.length < 4) {
            newRow = newRow.concat(new Array(4 - newRow.length).fill(0))
          }
          this.cells[r] = newRow
        }
      }
    },

    components: {
      Cell
    }
  }
</script>

<style scoped>
  .map {
    /**  div居中,
    * 当设置width一定,margin 为 auto,
    * 减去 top left right botton的值后,
    * 剩下的的边距自动作为两边的左右边距,上下边距,
    * 并且此时div的父元素是body,所以是全局居中
    */
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    /*弹性盒子的方式居中*/
    /*display: flex;*/
    /*justify-content: center;*/

    width: 450px;
    height: 450px;
    background-color: #baa;
    border-radius: 20px;
  }

</style>
