<template>
  <v-dialog :value="dialog" @input="dialog = $event" max-width="500px">
    <v-card>
      <v-card-title> 파일업로드 </v-card-title>
      <v-card-text>
        <v-select
          v-model="vm_select"
          :items="['일반문서', '신분증']"
          label="문서종류"
          item-value="text"
          dense
          outlined
        ></v-select>
        <v-file-input
          accept=".jpg,.tif,.tiff,.png,.bmp,.pdf"
          label="파일 선택"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="upload_btn"> Upload </v-btn>
        <v-btn color="primary" text @click.stop="dialog = false">Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["ocr_user_id"]),
    dialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  date() {
    return {
      dialog: false, //업로드팝업
      doc_items: [
        { name: "일반문서", value: "A" },
        { name: "신분증", value: "M" },
        { name: "신용카드", value: "M" },
        { name: "사업자등록증", value: "M" },
        { name: "영수증", value: "M" },
      ],
    };
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  
  methods: {
    upload_btn() {
      axios
        .get("/upload", { params: { docType: "{{vm_select}}" } })
        .then((res) => {
          console.log("1:", res.status);
          console.log("2:", res.data);
          console.log("3:", res);
        })
        .catch((error) => {
          console.log("error");
          console.log("error:", error);
        })
        .finally(() => {
          console.log("finally");
        });
    },
  },
};
</script>
