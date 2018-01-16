<template>

  <div class="game">
    <div class="map">
      <cell :tile="tile" v-for="tile in tiles[0]"></cell>
      <cell :tile="tile" v-for="tile in tiles[1]"></cell>
      <cell :tile="tile" v-for="tile in tiles[2]"></cell>
      <cell :tile="tile" v-for="tile in tiles[3]"></cell>
      <div class="gameover" v-show="isOver">
        <div class="again">
          <p class="show-over">GAME OVER</p>
          <button v-on:click="init()" class="try-again">Try Again</button>
        </div>
      </div>
    </div>
    <div class="score">
      max: {{ score }}
    </div>

  </div>
</template>

<script>
  import Cell from './Cell.vue'
  import Tile from '../Tile.js'
  export default{
    data () {
      return {
        tiles: [],
        isOver: false,
        score: 0
      }
    },
    created () {
      this.init()
    },
    mounted () {
      document.onkeydown = this.onKeyDown
    },
    methods: {
      init () {
        this.isOver = false
        this.tiles = []
        for (let i = 0; i < 4; i++) {
          this.tiles.push([])
          for (let j = 0; j < 4; j++) {
            this.tiles[i].push(new Tile(0, {x: i, y: j}))
            this.$set(this.tiles, i, this.tiles[i])
          }
        }
        this.generateRandom()
      },
      generateRandom () {
        let space = []
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            if (this.tiles[r][c].value === 0) {
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
          this.tiles[r][c].value = randomValue
          this.tiles[r][c].isNew = true
          this.$set(this.tiles, r, this.tiles[r])
          if (!this.score) {
            this.score = randomValue
          }
        }
      },
      onKeyDown (event) {
        /** keyCode 37 == Left  38 == Up 39 == Right 40 == Down */
        if (event.keyCode >= 37 && event.keyCode <= 40) {
          this.move(event.keyCode - 37)
        }
      },
      refreshTiles () {
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            this.score = Math.max(this.score, this.tiles[r][c].value)
            this.tiles[r][c].refreshCoord({x: r, y: c})
          }
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
            this.tiles = this.rotateLeft(this.tiles)
          }
          this.moveLeft()
          for (let i = 0; i < 4 - direction; i++) {
            this.tiles = this.rotateLeft(this.tiles)
          }
        }
        this.refreshTiles()
        for (let i = 0; i < 4; i++) {
          this.$set(this.tiles, i, this.tiles[i])
        }
        // TODO 这里的逻辑有问题,应该是有移动格子时候才需要生成新格子
        this.generateRandom()
        if (this.isDefeat()) {
          this.isOver = true
        }
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
          let row = this.tiles[r].filter(tile => (tile.value !== 0))
          let newRow = []
          while (row.length > 0) {
            let cell = row.shift()
            if (row.length > 0 && cell.value === row[0].value) {
              cell.value += row.shift().value || 0
            }
            newRow.push(cell)
          }
          if (newRow.length < 4) {
            for (let currentY = newRow.length; currentY < 4; currentY++) {
              newRow.push(new Tile())
            }
          }
          this.tiles[r] = newRow
        }
      },
      /**
       * 判断是否失败的规则,
       * 假如还有空白格子,
       * 或者xx格子的数值和周围上 下 左 右的格子值相等,
       * 则还没有输
       */
      isDefeat () {
        let defeat = false
        // 上 下 左 右
        let x = [-1, 1, 0, 0]
        let y = [0, 0, -1, 1]
        for (let r = 0; r < 4; r++) {
          // 用 |= 的好处: 这里只需要满足以上任意规则则游戏没有输, 因此当任意规则为true, 则defeat一直为true
          defeat |= (this.tiles[r].filter(tile => tile.value !== 0).length !== 4)
          if (defeat) { // 如果当前行去掉空格子后不为4个格子,则说明有空格
            break
          }
          for (let c = 0; c < 4; c++) {
            for (let direct = 0; direct < 4; direct++) {
              let aroundX = r + x[direct]
              let aroundY = c + y[direct]
              // 判断当前this.tiles[r+x[direct]][c+[direct]]的格子存在
              if (aroundX >= 0 && aroundY >= 0 && aroundX < 4 && aroundY < 4) {
                defeat |= (this.tiles[r][c].value === this.tiles[aroundX][aroundY].value)
              }
            }
          }
        }
        return !defeat
      }
    },

    components: {
      Cell
    }
  }
</script>

<style scoped>
  .game {
    width: 460px;
    height: 560px;

    /**  div居中,
    * 当设置width一定,margin 为 auto,
    * 减去 top left right botton的值后,
    * 剩下的的边距自动作为两边的左右边距,上下边距,
    * 并且此时div的父元素是body,所以是全局居中
    */
    position: absolute;
    margin: auto;
    top: 0; left: 0; right: 0; bottom: 0;

    /*弹性盒子的方式居中*/
    /*display: flex;*/
    /*justify-content: center;*/

  }

  .score {
    width: 450px;
    height: 100px;

    text-align: center;
    font-size: 6em;
  }

  .map {
    width: 460px;
    height: 460px;
    background-color: #baa;
    border-radius: 20px;

    /*border-bottom: 5px;*/
    /*border-top: 5px;*/
  }
  .gameover {
    position: relative;
    width: 460px;
    height: 460px;
    background-color: rgba(0, 191, 255, 0.4);
    border-radius: 20px;
  }
  .again {
    position: absolute;
    margin: auto;
    top: 0; left: 0; right: 0; bottom: 0;
    width: auto;
    height: 200px;
    display: inline-block;
    text-align: center;
  }
  .show-over {
    font-size: 36px;
    color: coral;
    font-weight: bold;
  }
  .try-again {
    font-size: 20px;
    border-radius: 5px;
    background-color: #876;
    color: white;
    border: 0;
    width: 200px;
    height: 50px;
  }
</style>
