<script>
export default {
  data() {
    return {
      hasLogin: true,
    };
  },
  created() {
    if (this.hasLogin) {
      this.$router.push('/chat');
    }
  },
};
</script>
