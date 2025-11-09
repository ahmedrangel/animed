<script setup lang="ts">
import { format } from "date-fns";

const { loggedIn } = useUserSession();
const data = ref<AiringSchedules>();
const schedules = ref<AiringSchedules["airingSchedules"]>([]);
const userSchedule = ref<AiringSchedules["airingSchedules"]>([]);
const showUserSchedule = ref<boolean>(false);
const daysOfTheWeek = ref<number[]>([]);
const daysOfTheWeekFull = ref<string[]>([]);
const loading = ref<boolean>(true);
const hasNextPage = ref<boolean>(true);
const currentPage = ref<number>(1);
const watchlist = await useWatchlist();

const now = computed(() => new Date());
const startDate = new Date(now.value.getFullYear(), now.value.getMonth(), now.value.getDate() - 1);
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 7);
const startTimestamp = Math.floor(startDate.getTime() / 1000);
const endTimestamp = Math.floor(endDate.getTime() / 1000);

const setupSchedules = () => {
  const days: number[] = [];
  const dates: string[] = [];
  for (const schedule of schedules.value) {
    if (schedule.airingAt) {
      days.push(new Date(schedule.airingAt * 1000).getDay());
      dates.push(format(new Date(schedule.airingAt * 1000), "MMMM do"));
    }
  }
  daysOfTheWeek.value = [...new Set(days)];
  daysOfTheWeekFull.value = [...new Set(dates)];
};

const filterScheduleByDay = (day: number) => computed (() => {
  return (!showUserSchedule.value ? schedules.value : userSchedule.value)
    .toSorted((a, b) => a.airingAt - b.airingAt)
    .filter(schedule => new Date(schedule.airingAt * 1000).getDay() === day && (!showUserSchedule.value ? !schedule.media.isAdult : true));
}).value;

const nearestAiringSchedule = computed(() => {
  return (!showUserSchedule.value ? schedules.value : userSchedule.value)
    .find(schedule => schedule.airingAt * 1000 > now.value.getTime())?.airingAt;
});

const nowAiringSchedule = computed(() => {
  return (!showUserSchedule.value ? schedules.value : userSchedule.value)
    .find(schedule => (now.value.getTime() / 1000) - schedule.airingAt < 60 * schedule.media.duration && schedule.airingAt * 1000 < now.value.getTime())?.airingAt;
});

onMounted(async () => {
  showUserSchedule.value = localStorage.getItem("animed-show-watchlist-only") === "true" && loggedIn.value;
  data.value = await getSchedules({ airingAt_greater: startTimestamp, airingAt_lesser: endTimestamp, page: currentPage.value }, { swr: true });
  schedules.value.push(...data.value.airingSchedules);
  hasNextPage.value = data.value.pageInfo.hasNextPage;
  loading.value = false;
  while (hasNextPage.value) {
    loading.value = true;
    currentPage.value = currentPage.value + 1;
    data.value = await getSchedules({
      airingAt_greater: startTimestamp,
      airingAt_lesser: endTimestamp,
      page: currentPage.value
    }, { swr: true });
    schedules.value.push(...data.value.airingSchedules);
    userSchedule.value = schedules.value.filter(schedule => watchlist.value?.some(watch => watch.mediaId === schedule.media.id));
    hasNextPage.value = data.value.pageInfo.hasNextPage;
    loading.value = false;
  }
  setupSchedules();
});

useSeoMeta({
  title: "Airing Schedule | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: "Airing Schedule | " + SITE.name,
  ogUrl: SITE.url + "/schedule",
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: "Airing Schedule | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + "/schedule" }]
});

watch(showUserSchedule, (value) => {
  localStorage.setItem("animed-show-watchlist-only", value ? "true" : "false");
});
</script>

<template>
  <main>
    <section id="schedules">
      <h3 class="px-4 py-4 mb-0 bg-dark border-bottom">Airing Schedule</h3>
      <TransitionGroup name="fade">
        <SpinnerFullScreenLoading v-if="loading && !schedules.length" />
        <div v-else class="px-2 py-4 px-xl-5 w-100 accordion border-0" data-aos="fade-in">
          <div v-if="loggedIn" class="form-check form-switch p-0 mb-2 d-flex align-items-center justify-content-end gap-2">
            <input id="userWatchlistFilter" v-model="showUserSchedule" class="form-check-input m-0" type="checkbox" role="switch">
            <label class="form-check-label" for="userWatchlistFilter">Show my watchlist only</label>
          </div>
          <div v-for="(day, i) of daysOfTheWeek" :key="i" class="py-2 accordion-item border-0">
            <div class="fw-bold accordion-header user-select-none">
              <span v-ripple class="accordion-button rounded-1" :class="{ collapsed: i === 0 }" type="button" data-bs-toggle="collapse" :data-bs-target="`#${formatDayName(day).toLowerCase()}`">
                <h4 class="mb-0">{{ formatDayName(day) }}, {{ daysOfTheWeekFull[i] }}</h4>
              </span>
            </div>
            <div :id="formatDayName(day).toLowerCase()" class="accordion-collapse collapse" :class="{ show: i !== 0 }">
              <div class="accordion-body p-0">
                <div class="d-flex flex-wrap py-3 justify-content-start anime-row g-3 h-100">
                  <template v-if="filterScheduleByDay(day).length">
                    <template v-for="(schedule, j) of filterScheduleByDay(day)" :key="j">
                      <div class="col-xl-3 col-lg-4 col-sm-6 col-12 d-flex justify-content-center">
                        <div class="mb-0 w-100">
                          <AnimeCardSchedule :data="schedule" :airing-next="schedule.airingAt === nearestAiringSchedule" :airing-now="schedule.airingAt === nowAiringSchedule" />
                        </div>
                      </div>
                    </template>
                  </template>
                  <div v-else class="col-12 d-flex justify-content-center">
                    <div class="mb-0 w-100 text-start">
                      <h5 class="text-muted mb-0">No watching schedule for this day</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SpinnerLoading v-if="loading" />
        </div>
      </TransitionGroup>
    </section>
  </main>
</template>
