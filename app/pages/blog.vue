<template>
  <BlogSection />
</template>

<script setup>
import BlogSection from '~/components/BlogSection.vue'

useSeoMeta({
  title: 'مقالات و آموزش‌ها',
  description: 'مجموعه مقالات آموزشی در زمینه تعمیرات ابزار صنعتی، کارآفرینی و تجربیات بهزاد حیدری.',
  ogTitle: 'بلاگ آموزشی بهزاد حیدری',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: 'بلاگ و مقالات'
  })
])
</script>