<script setup lang="ts">
import { format } from "date-fns";

const { loggedIn, user, clear } = useUserSession();
const { params } = useRoute("u-username");
const { username } = params;
const isMyPage = loggedIn.value && user.value?.username?.toLowerCase() === username.toLowerCase();

const { data: result } = await useFetch<User>(`/api/account/${username}`);

if (!result.value && isMyPage) {
  clear();
  navigateTo("/login", { external: true });
}

if (!result.value && !isMyPage) {
  throw createError({
    statusCode: 404,
    message: `User not found: ${username}`,
    fatal: true
  });
}

const { data: userWatchlist } = await useFetch("/api/watchlist", {
  query: { userId: result.value?.id }
});

const data = ref<AiringSchedules>();
const schedules = ref<AiringSchedules["airingSchedules"]>([]);
const filteredSchedules = ref<AiringSchedules["airingSchedules"]>([]);
const daysOfTheWeek = ref<number[]>([]);
const daysOfTheWeekFull = ref<string[]>([]);
const loading = ref<boolean>(true);
const hasNextPage = ref<boolean>(true);
const currentPage = ref<number>(1);

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
  return filteredSchedules.value
    .toSorted((a, b) => a.airingAt - b.airingAt)
    .filter(schedule => new Date(schedule.airingAt * 1000).getDay() === day);
}).value;

const nearestAiringSchedule = computed(() => {
  return filteredSchedules.value
    .find(schedule => schedule.airingAt * 1000 > now.value.getTime())?.airingAt;
});

const nowAiringSchedule = computed(() => {
  return filteredSchedules.value
    .find(schedule => (now.value.getTime() / 1000) - schedule.airingAt < 60 * schedule.media.duration && schedule.airingAt * 1000 < now.value.getTime())?.airingAt;
});

onMounted(async () => {
  data.value = await getSchedules({ airingAt_greater: startTimestamp, airingAt_lesser: endTimestamp, page: currentPage.value });
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
    });
    schedules.value.push(...data.value.airingSchedules);
    filteredSchedules.value = schedules.value.filter(schedule => userWatchlist.value?.some(watch => watch.mediaId === schedule.media.id));
    hasNextPage.value = data.value.pageInfo.hasNextPage;
    loading.value = false;
  }
  setupSchedules();
});
</script>

<template>
  <main>
    <section id="profile">
      <div class="px-2 px-lg-5 px-xl-5 w-100 position-relative">
        <ProfileDropdown />
        <ProfileMenu :username="username" :is-my-page="isMyPage" />
        <TransitionGroup name="fade">
          <SpinnerFullScreenLoading v-if="loading && !schedules.length" />
          <div v-else class="pt-4 w-100 accordion border-0" data-aos="fade-in">
            <div v-for="(day, i) of daysOfTheWeek" :key="i" class="py-2 accordion-item border-0">
              <div class="fw-bold accordion-header user-select-none">
                <span v-ripple class="accordion-button rounded-2" :class="{ collapsed: i === 0 }" type="button" data-bs-toggle="collapse" :data-bs-target="`#${formatDayName(day).toLowerCase()}`">
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
      </div>
    </section>
  </main>
</template>
