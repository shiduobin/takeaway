<template>
  <div id="welcome" class="welcome">
    <a class="jump" @click="toJump">跳过</a>
    <img :src="logo" id="entry" class="entry"/>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        logo: require('../../assets/logo.jpg'),
        isJump: false
      };
    },
    methods: {
      auto() {
        let advWidth = document.documentElement.clientWidth;
        let advHeight = document.documentElement.clientHeight;
        let entryEl = document.getElementById('entry');
        let welcomeEl = document.getElementById('welcome');
        entryEl.style.width = advWidth + 'px';
        entryEl.style.height = advHeight + 'px';
        welcomeEl.style.overflowY = 'hidden';
        // 阻止滑动执行
        welcomeEl.ontouchmove = function (ev) {
          ev.preventDefault();
        };
      },
      toJump() {
        this.isJump = true;
        this.jump();
      },
      jump() {
        if (this.isJump) {
          this.$router.push('/goods');
        } else {
          setTimeout(() => {
            this.$router.push('/goods');
          }, 3000);
        }
      }
    },
    mounted() {
      this.auto();
      this.jump();
    }
  };
</script>

<style scoped>
  .jump {
    z-index: 10;
    color: #fff;
    position: absolute;
    right: 15px;
    top: 15px;
    width: 75px;
    height: 35px;
    line-height: 35px;
    border: 1px solid #fff;
    border-radius: 50px;
    text-align: center;
  }

  .entry {
    z-index: 5;
    width: 100%;
    height: auto;
  }
</style>
