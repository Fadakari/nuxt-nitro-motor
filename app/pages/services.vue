<template>
  <ServicesSection />
</template>

<script setup>
import ServicesSection from '~/components/ServicesSection.vue'

useSeoMeta({
  title: 'خدمات و فعالیت‌ها',
  description: 'ارائه خدمات تخصصی تعمیرات ابزارآلات صنعتی (هیلتی)، اپلیکیشن استوک و آموزش‌های فنی توسط بهزاد حیدری.',
  ogTitle: 'خدمات تخصصی بهزاد حیدری | تعمیرات و آموزش',
  ogDescription: 'آشنایی با خدمات ما: تعمیرات هیلتی، اپلیکیشن خرید و فروش ابزار استوک و دوره‌های آموزشی.',
  ogImage: 'https://behzadheydari.ir/services-cover.jpg',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: 'خدمات و فعالیت‌ها',
    description: 'لیست خدمات فنی و مهندسی بهزاد حیدری'
  }),
  defineLocalBusiness({
    '@type': 'ProfessionalService',
    name: 'تعمیرات تخصصی هیلتی حیدری',
    description: 'مرکز تخصصی تعمیر و سرویس ابزارآلات صنعتی و هیلتی.',
    image: '/me.jpg',
    telephone: '+989122719204',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressLocality: 'Tehran',
    },
    areaServed: 'Iran'
  })
])
</script>