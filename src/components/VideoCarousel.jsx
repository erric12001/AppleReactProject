import gsap from "gsap";
import { useGSAP } from "@gsap/react"; // 引入 useGSAP 來使用 gsap hooks
import { ScrollTrigger } from "gsap/all"; // 引入 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger); // 註冊 ScrollTrigger 插件
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants"; // 引入幻燈片數據
import { pauseImg, playImg, replayImg } from "../utils"; // 引入圖片資源，用於控制播放/暫停/重播按鈕的圖標

// VideoCarousel 是一個視頻輪播組件
const VideoCarousel = () => {
  // 使用 useRef 來引用多個 video 元素和其相應的進度條
  const videoRef = useRef([]); 
  const videoSpanRef = useRef([]); 
  const videoDivRef = useRef([]);

  // 定義狀態，用來管理當前視頻的播放信息
  const [video, setVideo] = useState({
    isEnd: false, // 當前視頻是否已結束
    startPlay: false, // 是否已經開始播放
    videoId: 0, // 當前播放的視頻ID
    isLastVideo: false, // 是否是最後一個視頻
    isPlaying: false, // 當前視頻是否正在播放
  });

  // 保存已加載的視頻數據，用來判斷視頻是否已加載
  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  // 使用 useGSAP 來處理動畫效果
  useGSAP(() => {
    // 對 slider 的動畫，根據當前視頻ID進行平移，將當前視頻移出屏幕並顯示下一個視頻
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut", // 使用緩動效果，讓過渡動畫更平滑
    });

    // 當滾動到視頻時，觸發 ScrollTrigger 播放動畫
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video", // 當視頻滾動到屏幕時觸發
        toggleActions: "restart none none none", // 設置滾動觸發行為
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true, // 開始播放視頻
          isPlaying: true, // 設置視頻正在播放
        }));
      },
    });
  }, [isEnd, videoId]);

  // 用來處理視頻進度條的更新動畫
  useEffect(() => {
    let currentProgress = 0; // 當前的進度
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // 進行進度條動畫，動態更新進度
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // 根據動畫進度計算百分比
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            // 根據設備尺寸設置進度條的寬度
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // 手機屏幕
                  : window.innerWidth < 1200
                  ? "10vw" // 平板屏幕
                  : "4vw", // 筆記本或更大屏幕
            });

            // 設置進度條的背景顏色和寬度
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // 當視頻播放完畢，重置進度條
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px", // 結束後進度條變小
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf", // 改變進度條背景顏色
            });
          }
        },
      });

      // 如果是第一個視頻，重新啟動動畫
      if (videoId == 0) {
        anim.restart();
      }

      // 更新進度條進度
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration // 計算當前視頻進度
        );
      };

      if (isPlaying) {
        // 添加 gsap 的 ticker 來不斷更新進度條
        gsap.ticker.add(animUpdate);
      } else {
        // 如果視頻暫停，則移除 ticker
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  // 控制視頻的播放/暫停狀態
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause(); // 如果視頻不是在播放中，則暫停
      } else {
        startPlay && videoRef.current[videoId].play(); // 如果已經開始播放，則播放視頻
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // 根據不同操作類型處理視頻播放流程
  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 })); // 當視頻結束，播放下一個視頻
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true })); // 標記為最後一個視頻
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false })); // 重置視頻播放
        break;

      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying })); // 切換播放/暫停狀態
        break;

      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying })); // 切換播放/暫停狀態
        break;

      default:
        return video;
    }
  };

  // 處理視頻的元數據加載事件
  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`} // 控制視頻元素的樣式
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)} // 設置每個視頻的引用
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i) // 當不是最後一個視頻時，播放下一個
                      : handleProcess("video-last") // 當是最後一個視頻時，標記為最後
                  }
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true })) // 當播放時，設置狀態
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)} // 當視頻元數據加載完成時觸發
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {text} {/* 渲染每個視頻對應的文本 */}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)} // 設置進度指示器的引用
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)} // 設置進度條的引用
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} // 根據視頻播放狀態顯示不同的按鈕圖標
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"} // 根據狀態設置圖標的 alt 屬性
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset") // 當是最後一個視頻時，重置播放
                : !isPlaying
                ? () => handleProcess("play") // 如果視頻未播放，點擊播放
                : () => handleProcess("pause") // 如果視頻正在播放，點擊暫停
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel; // 將 VideoCarousel 組件導出
