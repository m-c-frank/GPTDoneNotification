const textarea = document.querySelector('textarea');
const parent = textarea.parentNode;
const button = parent.querySelector('button');

let prevElement = null;

// Create a new MutationObserver instance
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        // Check if the mutation was a direct child change
        if (mutation.type === 'childList' && mutation.target === button) {
            const newElement = mutation.addedNodes[0];
            if (newElement == prevElement) {
                return
            } else {
                if (newElement instanceof SVGElement) {
                    console.log('prompt is done');
                    sendNotification();
                } else if (newElement instanceof HTMLDivElement) {
                    console.log("question was sent");
                }
                prevElement = newElement
            }
        }
    });
});

// Configure and start the observer
const observerConfig = { childList: true };
observer.observe(button, observerConfig);

function makeSound() {
    var audioUrl = chrome.runtime.getURL("audio/notification.mp3");
    var snd = new Audio(audioUrl);
    snd.play();
}


const makeNotification = () => {
    const notification = new Notification("ChatGPT", {
        body: "ChatGPT is done",
        sound: true
    });
    makeSound();
    return
}

const sendNotification = () => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }
    // Request permission if it hasn't been granted yet
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                // Create a new notification with a sound
                makeNotification();
            }
        });
    } else {
        // Create a new notification with a sound
        makeNotification();
    }
}
