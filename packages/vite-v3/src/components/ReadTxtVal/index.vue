<template>
  <label className="text-reader">
    <input type="file" @change="loadTextFile">
  </label>
  <pre>{{ fileContent }}</pre>
</template>

<script>
export default {
  name: "ReadTxtVal",
  data() {
    return {
      fileContent: '文件内容'
    }
  },
  methods: {
    loadTextFile(e) {
      let self = this
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        self.fileContent = ev.target.result
        console.log(self.fileContent)
      }
      reader.readAsText(file)
    }
  }
}
</script>
