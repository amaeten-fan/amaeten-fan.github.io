
// // APIキーとユーザーID
// const apiKey = "AIzaSyC5ZNz0aJdW8IdtaQyfW13HULkTc2Zyl6Q";
// const channelId = "UCW98GVLrx8lG_ddOts3cl4g";

// // YouTube APIからチャンネル情報を取得して更新
// function updateSubscriberCount() {
    // try {
        // const response = fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`);
        // const data = response.json();
        // if (data.items && data.items.length > 0) {
            // const subscriberCount = data.items[0].statistics.subscriberCount;
            // document.getElementById("subscriberCount").textContent = subscriberCount;
        // } else {
            // console.error("データが取得できませんでした。");
        // }
    // } catch (error) {
        // console.error("エラーが発生しました:", error);
    // }
// }

// // 初回更新
// updateSubscriberCount();

// // 10秒ごとに更新
// setInterval(updateSubscriberCount, 60000);