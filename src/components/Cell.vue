<template>
  <div class="cell" v-bind:style="position">
    <span v-if="value != 0">{{ value }}</span>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        oleCoord: {x: 0, y: 0}// 记录旧的坐标为了做过渡动画
      }
    },
    props: {
      value: {
        type: Number,
        required: true
      },
      coord: {
        type: Object,
        required: true
      }
    },
    methods: {
      getBackgroudColor (number) {
        switch (number) {
          case 0:return 'rgba(238, 228, 218, 0.35)'
          case 2:return '#eee4da'
          case 4:return '#ede0c8'
          case 8:return '#f2b179'
          case 16:return '#f59563'
          case 32:return '#f67c5f'
          case 64:return '#f65e3b'
          case 128:return '#edcf72'
          case 256:return '#edcc61'
          case 512:return '#edc850'
          case 1024:return '#edc53f'
          case 2048:return '#edc22e'
        }
      }
    },
    computed: {
      position: function () {
        return {
          top: this.coord.x * 100 + (this.coord.x + 1) * 10 + 'px',
          left: this.coord.y * 100 + (this.coord.y + 1) * 10 + 'px',
          background: this.getBackgroudColor(this.value)
//          transform: `translate(${this.coord.x - this.oldCoord.x}px, ${this.coord.y - this.oldCoord.y}px)`
        }
      }
    },
    watch: {
      coord: function (val, oldVal) {
//        console.log(`newVal is ${val.y}, oldVal is ${oldVal.y}`)
//        this.oldCoord.x = oldVal.x
//        this.oldCoord.y = oldVal.y
        console.log(`new.x:${val.x} new.y:${val.y}`)
        console.log(`old.x:${oldVal.x} old.y:${oldVal.y}`)
      }
    }
  }
</script>


<style scoped>
  .cell {
    font-size: 30px;
    position: absolute;
    text-align: center;
    display: inline-block;
    line-height: 100px;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    color: #49390d
    /*margin: 5px;*/
  }
</style>
