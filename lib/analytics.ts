export const trackConversion = (eventData: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", eventData)
  } else {
    console.log("Frontend Conversion Track:", eventData)
  }
}

export const trackEvent = (eventName: string, eventData: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventData)
  } else {
    console.log("Frontend Event Track:", { eventName, eventData })
  }
}

export const trackServerEvent = (eventName: string, eventData: any) => {
  console.log("Server Event Track:", { eventName, eventData })
}
