document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    var terminalContainer = document.getElementById('terminal');
    var terminalText = document.getElementById('terminal-text');
    var videoBackground = document.getElementById('myVideo');
    var audioBackground = document.getElementById('myAudio');
    var blurredBox = document.getElementById('blurred-box');
    var closeButton = document.getElementById('close-button');

    // Initial terminal text content
    var terminalTextContent = ["Người Dùng: unknown", "IP: Loading...", "System: Loading...", // System information placeholder
        "Hoàn Tất Load Bio", "Nhấn Enter Để Tiếp Tục",];
    var currentIndex = 0;

    // Pause background video and audio
    videoBackground.pause();
    audioBackground.pause();

    // Function to type out terminal text
    function typeWriter() {
        var line = currentIndex === 0 ? getAsciiArt() : terminalTextContent[currentIndex - 1];
        var i = 0;

        function typeChar() {
            if (i < line.length) {
                terminalText.textContent += line.charAt(i);
                i++;
                setTimeout(typeChar, 50);
            } else {
                terminalText.textContent += "\n";
                currentIndex++;
                if (currentIndex < terminalTextContent.length + 1) {
                    typeWriter();
                } else {
                    addEventListeners(); // Add event listeners when typing is done
                }
            }
        }

        typeChar();
    }

    // Handle key press event or touch event
    function handleInput() {
        // Hide terminal, play background video and audio, and show blurred box
        terminalContainer.style.display = 'none';
        videoBackground.play();
        audioBackground.play();
        blurredBox.style.display = 'block';
        removeEventListeners(); // Remove event listeners after handling input
    }

    // Add event listeners for both key press and touch events
    function addEventListeners() {
        document.addEventListener('keydown', handleKeyPress);
        terminalContainer.addEventListener('click', handleInput); // For touch support
    }

    // Remove event listeners
    function removeEventListeners() {
        document.removeEventListener('keydown', handleKeyPress);
        terminalContainer.removeEventListener('click', handleInput); // For touch support
    }

    // Handle key press event
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleInput();
        }
    }

    // Handle close button click event
    closeButton.addEventListener('click', function () {
        handleInput();
    });

    // Fetch IP address using API
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            var ipAddress = data.ip;
            terminalTextContent[1] = "IP: " + ipAddress;
            typeWriter();
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);
            terminalTextContent[1] = "IP: Unable to fetch IP address";
            typeWriter();
        });

    // Extract system information from user agent
    var userAgent = navigator.userAgent;
    var systemInfo;

    // Function to get the operating system name based on user agent
    function getOperatingSystem() {
        if (userAgent.match(/Windows/)) {
            // Windows OS detected
            return getWindowsVersion();
        } else if (userAgent.match(/Macintosh/)) {
            // macOS detected
            return getMacOSVersion();
        } else if (userAgent.match(/Linux/)) {
            // Linux OS detected
            return "Linux";
        } else if (userAgent.match(/Android/)) {
            // Android OS detected
            return getAndroidVersion();
        } else if (userAgent.match(/iPhone|iPad|iPod/)) {
            // iOS detected
            return getiOSVersion();
        } else {
            // Default to "Unknown" if system information cannot be determined
            return "Unknown";
        }
    }

    // Function to map Windows version numbers to their corresponding releases
    function getWindowsVersion() {
        var version = userAgent.match(/Windows NT ([\d.]+)/);
        if (version) {
            version = version[1];
            switch (version) {
                case "5.1":
                    return "Windows XP";
                case "6.0":
                    return "Windows Vista";
                case "6.1":
                    return "Windows 7";
                case "6.2":
                    return "Windows 8";
                case "6.3":
                    return "Windows 8.1";
                case "10.0":
                    return "Windows 10";
                case "10.0":
                    return "Windows 11";
                default:
                    return "Windows";
            }
        } else {
            return "Windows";
        }
    }

    // Function to get the macOS version
    function getMacOSVersion() {
        var version = userAgent.match(/Mac OS X ([\d_]+)/);
        if (version) {
            // Replace underscores with dots for macOS version
            version = version[1].replace(/_/g, '.');
            return "macOS " + version;
        } else {
            return "macOS";
        }
    }

    // Function to get the Android version
    function getAndroidVersion() {
        var version = userAgent.match(/Android ([\d.]+)/);
        if (version) {
            return "Android " + version[1];
        } else {
            return "Android";
        }
    }

    // Function to get the iOS version
    function getiOSVersion() {
        var version = userAgent.match(/OS ([\d_]+)/);
        if (version) {
            // Replace underscores with dots for iOS version
            version = version[1].replace(/_/g, '.');
            return "iOS " + version;
        } else {
            return "iOS";
        }
    }

    // Get the operating system information
    var operatingSystem = getOperatingSystem();
    terminalTextContent[2] = "System: " + operatingSystem;

    // Center the terminal window on the screen
    function centerTerminal() {
        var terminalWidth = terminalContainer.offsetWidth;
        var terminalHeight = terminalContainer.offsetHeight;
        var centerX = (window.innerWidth - terminalWidth) / 2;
        var centerY = (window.innerHeight - terminalHeight) / 2;

        terminalContainer.style.position = 'absolute';
        terminalContainer.style.left = centerX + 'px';
        terminalContainer.style.top = centerY + 'px';
    }

    // Center the terminal initially and on window resize
    centerTerminal();
    window.addEventListener('resize', centerTerminal);

    // Center the ASCII art within the terminal window
    terminalText.style.textAlign = 'center';

    // Function to generate ASCII art
    function getAsciiArt() {
        return `
██████╗ ███████╗    ██╗ ██╗██████╗ 
╚════██╗██╔════╝   ██╔╝███║╚════██╗
 █████╔╝███████╗  ██╔╝ ╚██║ █████╔╝
██╔═══╝ ╚════██║ ██╔╝   ██║██╔═══╝ 
███████╗███████║██╔╝    ██║███████╗
╚══════╝╚══════╝╚═╝     ╚═╝╚══════╝
  `;
    }

    // Get the audio element
    var audio = document.getElementById("myAudio");

    // Set the maximum volume level (between 0 and 1)
    var maxVolume = 0.1; // Adjust this value as needed

    // Function to limit the volume
    function limitVolume(volume) {
        if (volume > maxVolume) {
            audio.volume = maxVolume; // Set volume to the maximum allowed
        } else {
            audio.volume = volume; // Set volume to the provided value
        }
    }

    // Example usage:
    // Set volume to 0.7 (will be limited to maxVolume)
    limitVolume(0.1);
});

// Lấy thẻ <a> thứ 3 và popup
const paypalLink = document.getElementById('paypal-link');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');

// Thêm sự kiện click vào thẻ <a> thứ 3
paypalLink.addEventListener('click', function (event) {
    // Ngăn chặn hành động mặc định (không mở link)
    event.preventDefault();

    // Hiển thị popup
    popup.style.display = 'block';
});

// Đóng popup khi nhấn nút "Đóng"
closePopup.addEventListener('click', function () {
    popup.style.display = 'none';
});

// Chờ cho trang web được tải hoàn toàn
document.addEventListener("DOMContentLoaded", function() {

    // Hiển thị popup
    function showCustomPopup() {
        const popup = document.getElementById("custom-popup");
        if (popup) {
            popup.style.display = "block";
        }
    }

    // Đóng popup
    function closeCustomPopup() {
        const popup = document.getElementById("custom-popup");
        if (popup) {
            popup.style.display = "none";
        }
    }

    // Chuyển hướng đến Discord
    function redirectToDiscord() {
        window.location.href = "discord://discordapp.com/users/598704008940486656";
    }

    // Lắng nghe sự kiện cho nút mở popup (tên "sikawanonka.")
    const usernameLink = document.querySelector("p#username a");
    if (usernameLink) {
        usernameLink.addEventListener("click", function(event) {
            event.preventDefault();  // Ngừng hành động mặc định của liên kết
            showCustomPopup();
        });
    }

    // Lắng nghe sự kiện cho nút đóng trong popup
    const closeButtons = document.querySelectorAll(".custom-close-btn");
    closeButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            closeCustomPopup();
        });
    });

    // Lắng nghe sự kiện cho nút đồng ý trong popup
    const agreeButton = document.querySelector(".custom-agree-btn");
    if (agreeButton) {
        agreeButton.addEventListener("click", function(event) {
            redirectToDiscord();
        });
    }
});


document.addEventListener('keydown', (event) => {
    if (event.key === 'p') {
        document.querySelector('.game-overlay').classList.add('active');
        document.querySelector('.game-popup').classList.add('active');
    }
});

document.getElementById('game-accept').addEventListener('click', () => {
    document.querySelector('.game-popup').classList.remove('active');
    document.querySelector('.game-overlay').classList.remove('active');
    document.querySelector('.game-loading').classList.add('active');

    const progressBar = document.getElementById('game-progress-bar');
    let progress = 0;

    const interval = setInterval(() => {
        progress += 1;
        progressBar.value = progress;

        if (progress >= 100) {
            clearInterval(interval);
            window.location.href = "../accounts/login.html";
        }
    }, 50); // 50ms mỗi bước, tổng cộng 5 giây để hoàn thành
});

document.getElementById('game-cancel').addEventListener('click', () => {
    document.querySelector('.game-popup').classList.remove('active');
    document.querySelector('.game-overlay').classList.remove('active');
});

