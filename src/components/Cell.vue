<template>
  <div class="cell" v-bind:class="{'new-tile': tile.isNew}" v-bind:style="position">
    <span v-if="tile.value != 0">{{ tile.value }}</span>
  </div>
</template>

<script>
  export default{
    data () {
      return {
      }
    },
    props: {
      tile: {
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
          top: this.tile.coord.x * 100 + (this.tile.coord.x + 1) * 10 + 'px',
          left: this.tile.coord.y * 100 + (this.tile.coord.y + 1) * 10 + 'px',
          background: this.getBackgroudColor(this.tile.value)
        }
      }
    }
  }
</script>


<style scoped>
  .cell {
    transition: 100ms ease-in;
    font-size: 45px;
    position: absolute;
    text-align: center;
    display: inline-block;
    line-height: 100px;
    margin: 5px;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    color: #49390d;
    /*margin: 5px;*/
  }
  .new-tile {
    animation-duration: 200ms;
    animation-name: emerge;
    animation-delay: 100ms;
  }
  @keyframes emerge {
    from{transform: scale(0.4)}
    to{transform: scale(1)}
  }
</style>
