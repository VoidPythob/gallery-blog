import { nextTick, onBeforeUnmount, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

const wait = (duration: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration)
  })

const waitForPaint = async () => {
  await nextTick()

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

export const useRouteLoading = (minimumDuration = 220) => {
  const router = useRouter()
  const isRouteLoading = shallowRef(false)
  let navigationToken = 0
  let startedAt = 0

  const finishLoading = async (token: number) => {
    await waitForPaint()

    const elapsed = performance.now() - startedAt
    if (elapsed < minimumDuration) {
      await wait(minimumDuration - elapsed)
    }

    if (token !== navigationToken) {
      return
    }

    isRouteLoading.value = false
  }

  const removeBeforeEach = router.beforeEach((to, from) => {
    if (to.fullPath !== from.fullPath) {
      navigationToken += 1
      startedAt = performance.now()
      isRouteLoading.value = true
    }
  })

  const removeAfterEach = router.afterEach((to, from) => {
    if (to.fullPath === from.fullPath) {
      return
    }

    const currentToken = navigationToken
    void finishLoading(currentToken)
  })

  const removeOnError = router.onError(() => {
    navigationToken += 1
    isRouteLoading.value = false
  })

  onBeforeUnmount(() => {
    removeBeforeEach()
    removeAfterEach()
    removeOnError()
  })

  return {
    isRouteLoading,
  }
}
