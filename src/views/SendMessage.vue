<template>
    <v-container class="pa-16 mb-16">
        <v-row>
      <!-- 제목 -->
      <v-col sm="4" class="mb-4">
        <h2>메시지 전송</h2>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <!-- 하위 컴포넌트 영역 -->
      <v-col cols="12" md="6">
        <mail-card />
      </v-col>
      <v-col cols="12" md="6">
        <sms-card />
      </v-col>
    </v-row>
    </v-container>
</template>
<script>
import MailCard from '@/components/MailCard.vue';
import SmsCard from '@/components/SmsCard.vue';

export default {
    components: {
        MailCard,
        SmsCard
    },
    data() {
        return {
             sampleData: ''
        }
    },
    setup() {},
    created() {},
    mounted() {},
    unmounted() {},
    methods: {}
}
</script>