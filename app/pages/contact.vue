<template>
  <ContactSection />
</template>

<script setup>
import ContactSection from '~/components/ContactSection.vue'

useSeoMeta({
  title: 'ارتباط با من',
  description: 'راه‌های تماس مستقیم با بهزاد حیدری جهت مشاوره، سفارش تعمیرات و همکاری. شماره تماس و شبکه‌های اجتماعی.',
  ogTitle: 'تماس با بهزاد حیدری',
  ogDescription: 'برای مشاوره تخصصی و همکاری با ما در تماس باشید.',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'ContactPage',
    name: 'صفحه تماس با ما'
  }),
  definePerson({
    name: 'بهزاد حیدری',
    telephone: '+989122719204',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+989122719204',
      contactType: 'customer service',
      areaServed: 'IR',
      availableLanguage: 'Persian'
    }
  })
])
</script>