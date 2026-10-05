import http from "./http";

export async function getMyNotifications() {
  return await http.get("/notifications/me");
}

export async function getUnreadNotifications() {
  return await http.get("/notifications/unread");
}

export async function getUnreadCount() {
  return await http.get("/notifications/unread/count");
}

export async function markNotificationAsRead(notificationId) {
  return await http.patch(`/notifications/${notificationId}/read`);
}

export async function markAllNotificationsAsRead() {
  return await http.patch("/notifications/read-all");
}

export async function deleteNotification(notificationId) {
  return await http.delete(`/notifications/${notificationId}`);
}

export async function deleteAllNotifications() {
  return await http.delete("/notifications/all");
}