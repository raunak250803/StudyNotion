export const formatDate = (dateString) => {
  if (!dateString) return "N/A"

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "Invalid Date"

  const options = { year: "numeric", month: "long", day: "numeric" }
  const formattedDate = date.toLocaleDateString("en-US", options)

  const hour = date.getHours()
  const minutes = date.getMinutes()
  const period = hour >= 12 ? "PM" : "AM"
  const formattedTime = `${hour % 12 || 12}:${minutes.toString().padStart(2, "0")} ${period}`

  return `${formattedDate} | ${formattedTime}`
}
