import { getSubtitles } from 'youtube-captions-scraper';
import executeScript from './ChromeTabScriptExecutor';
import { ReceivedMessage } from '../../sidepanel/lib/MessageType';

const getYoutubeSubtitles = async () => {
  return await executeScript(
    getVideoIdAndTitleFromUrl,
    'YoutubeアドレスからvideoIDを取り出せませんでした。',
    async result => {
      try {
        const subtitles = await getSubtitles({ videoID: result.videoId, lang: 'en' });
        const concatenatedSubtitles = concatenateSubtitles(result.title, subtitles);
        return { status: 'success', response: concatenatedSubtitles } as ReceivedMessage;
      } catch (e) {
        console.error(e + ' :en');
        try {
          const subtitles = await getSubtitles({ videoID: result.videoId, lang: 'ja' });
          const concatenatedSubtitles = concatenateSubtitles(result.title, subtitles);
          return { status: 'success', response: concatenatedSubtitles } as ReceivedMessage;
        } catch (e) {
          console.error(e + ' :ja');
          return { status: 'error', errorMessage: e.message };
        }
      }
    },
  );
};

const getVideoIdAndTitleFromUrl = () => {
  const videoId = new URLSearchParams(new URL(window.location.href).search).get('v');
  const title = document.querySelector('title').innerText;
  return { videoId, title };
};

const concatenateSubtitles = (title: string, subtitles: { text: string }[]): string => {
  return 'title: ' + title + '\n\n' + subtitles.map(subtitle => subtitle.text).join('\n');
};

export default getYoutubeSubtitles;
