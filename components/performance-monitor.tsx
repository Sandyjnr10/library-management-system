"use client"

import { useEffect } from "react"

// Define the metrics interface
interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  tbt?: number
}

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      // Report Web Vitals
      const reportWebVitals = () => {
        const metrics: PerformanceMetrics = {}

        // LCP
        if ("PerformanceObserver" in window) {
          // LCP
          try {
            new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries()
              const lastEntry = entries[entries.length - 1]
              metrics.lcp = lastEntry.startTime
              console.log("LCP:", metrics.lcp)
            }).observe({ type: "largest-contentful-paint", buffered: true })
          } catch (e) {
            console.error("LCP monitoring error:", e)
          }

          // FID
          try {
            new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries()
              entries.forEach((entry) => {
                // Type assertion to access processingStart
                const fidEntry = entry as unknown as { processingStart: number; startTime: number }
                metrics.fid = fidEntry.processingStart - fidEntry.startTime
                console.log("FID:", metrics.fid)
              })
            }).observe({ type: "first-input", buffered: true })
          } catch (e) {
            console.error("FID monitoring error:", e)
          }

          // CLS
          try {
            let clsValue = 0
            new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries()
              entries.forEach((entry: any) => {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value
                  metrics.cls = clsValue
                  console.log("CLS:", metrics.cls)
                }
              })
            }).observe({ type: "layout-shift", buffered: true })
          } catch (e) {
            console.error("CLS monitoring error:", e)
          }

          // TBT calculation
          try {
            let totalBlockingTime = 0
            new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries()
              entries.forEach((entry) => {
                // Long tasks are those that take more than 50ms
                const blockingTime = entry.duration > 50 ? entry.duration - 50 : 0
                totalBlockingTime += blockingTime
                metrics.tbt = totalBlockingTime
                console.log("TBT:", metrics.tbt)
              })
            }).observe({ type: "longtask", buffered: true })
          } catch (e) {
            console.error("TBT monitoring error:", e)
          }
        }
      }

      reportWebVitals()
    }
  }, [])

  // This component doesn't render anything
  return null
}
